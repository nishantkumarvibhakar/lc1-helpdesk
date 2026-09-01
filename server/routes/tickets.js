const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// Generate unique ticket ID: LC1-2026-XXXXX
function generateTicketId(prefix = 'LC1') {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${year}-${randomNum}`;
}

// @route   POST /api/tickets/upload
// @desc    Upload attachment to Cloudinary
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'lc1_helpdesk');
    res.json({
      message: 'Attachment uploaded successfully',
      fileUrl: result.secure_url || null,
      fileName: req.file.originalname,
      publicId: result.public_id || null
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ message: 'Failed to upload attachment' });
  }
});

// @route   GET /api/tickets/track/:ticketNumber
// @desc    Public tracking endpoint for students by ticket ID
router.get('/track/:ticketNumber', (req, res) => {
  const cleanId = req.params.ticketNumber.trim().replace(/^#/, '');
  const ticket = storage.getTicketByNumber(cleanId);
  
  if (!ticket) {
    return res.status(404).json({ message: `No record found with ID #${cleanId}. Please check your ID and try again.` });
  }

  res.json({ ticket });
});

// @route   GET /api/tickets/my
// @desc    Get tickets for logged-in student
router.get('/my', authMiddleware, (req, res) => {
  const tickets = storage.getUserTickets(req.user.email);
  res.json({ tickets });
});

// @route   GET /api/tickets
// @desc    Get all tickets with type/category/status filters (Admin & Portal)
router.get('/', (req, res) => {
  const { status, category, search, priority, type } = req.query;
  let tickets = storage.getTickets();

  if (type && type !== 'All') {
    tickets = tickets.filter(t => (t.type || 'Issue').toLowerCase() === type.toLowerCase());
  }

  if (status && status !== 'All') {
    tickets = tickets.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  if (category && category !== 'All') {
    tickets = tickets.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }

  if (priority && priority !== 'All') {
    tickets = tickets.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    tickets = tickets.filter(t => 
      t.ticketId.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.studentName.toLowerCase().includes(q) ||
      t.studentEmail.toLowerCase().includes(q) ||
      (t.studentId && t.studentId.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  }

  res.json({ tickets });
});

// @route   GET /api/tickets/:id
// @desc    Get ticket by ID
router.get('/:id', (req, res) => {
  const ticket = storage.getTicketById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  res.json({ ticket });
});

// @route   POST /api/tickets
// @desc    Raise a new Issue, Manifesto Suggestion, or Volunteer Signup
router.post('/', (req, res) => {
  try {
    const {
      type = 'Issue', // 'Issue' | 'Manifesto Suggestion' | 'Volunteer Application'
      studentName,
      studentEmail,
      studentId,
      llbYear,
      section,
      phone,
      isAnonymous = false,
      category,
      subject,
      description,
      priority = 'Normal',
      attachmentName,
      attachmentUrl
    } = req.body;

    if (!studentName || !studentEmail || !category || !subject || !description) {
      return res.status(400).json({ message: 'Please fill all required fields (Name, Email, Category, Subject, Description)' });
    }

    const prefix = type === 'Manifesto Suggestion' ? 'SUGG' : (type === 'Volunteer Application' ? 'VOL' : 'LC1');
    const ticketId = generateTicketId(prefix);

    const displayName = isAnonymous ? 'Anonymous Student (LC-1)' : studentName.trim();

    const initialMessage = type === 'Manifesto Suggestion'
      ? '💡 Manifesto Idea submitted to Prashant Kumar Diwakar for LC-1 Student Council 2026.'
      : (type === 'Volunteer Application'
        ? '🤝 Volunteer registration received by Campaign Team Prashant Diwakar.'
        : '🚨 Campus issue registered on LC-1 Student Support Portal.');

    const newTicket = {
      id: `tkt_${Date.now()}`,
      ticketId,
      type,
      studentName: displayName,
      studentEmail: studentEmail.trim().toLowerCase(),
      studentId: studentId ? studentId.trim().toUpperCase() : 'N/A',
      llbYear: llbYear || '1st Year',
      section: section || 'Section A',
      phone: phone ? phone.trim() : '',
      isAnonymous: Boolean(isAnonymous),
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority,
      status: 'Pending',
      assignedTo: 'Unassigned (Team Prashant Diwakar)',
      attachment: attachmentName || null,
      attachmentUrl: attachmentUrl || null,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          author: isAnonymous ? 'Anonymous Student' : `${studentName} (${llbYear || 'Student'})`,
          role: 'student',
          message: initialMessage,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = storage.addTicket(newTicket);
    res.status(201).json({
      message: type === 'Manifesto Suggestion' 
        ? 'Thank you for your valuable suggestion! Prashant Kumar Diwakar and the manifesto team will review it.' 
        : (type === 'Volunteer Application'
          ? 'Welcome to Team Prashant Diwakar! Our campaign coordinator will contact you shortly.'
          : 'Your campus issue has been registered successfully! Team Prashant Diwakar will follow up.'),
      ticket: created
    });
  } catch (err) {
    console.error('Ticket creation error:', err);
    res.status(500).json({ message: 'Failed to submit' });
  }
});

// @route   PATCH /api/tickets/:id/status
// @desc    Update ticket status (Admin only)
router.patch('/:id/status', authMiddleware, adminOnly, (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided' });
  }

  const existing = storage.getTicketById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  const newTimelineEntry = {
    id: `tl_${Date.now()}`,
    author: `${req.user.name || 'Prashant Diwakar'} (Team Lead)`,
    role: 'admin',
    message: note || `Status updated to ${status}.`,
    timestamp: new Date().toISOString()
  };

  const updatedTimeline = [...(existing.timeline || []), newTimelineEntry];

  const updated = storage.updateTicket(req.params.id, {
    status,
    resolutionNote: note || '',
    timeline: updatedTimeline
  });

  res.json({ message: `Status updated to ${status}`, ticket: updated });
});

// @route   PATCH /api/tickets/:id/assign
// @desc    Assign ticket to team member (Admin only)
router.patch('/:id/assign', authMiddleware, adminOnly, (req, res) => {
  const { assignedTo } = req.body;
  if (!assignedTo) {
    return res.status(400).json({ message: 'Assigned member name is required' });
  }

  const existing = storage.getTicketById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  const newTimelineEntry = {
    id: `tl_${Date.now()}`,
    author: `${req.user.name || 'Prashant Diwakar'} (Team Lead)`,
    role: 'admin',
    message: `Assigned to ${assignedTo}.`,
    timestamp: new Date().toISOString()
  };

  const updated = storage.updateTicket(req.params.id, {
    assignedTo,
    timeline: [...(existing.timeline || []), newTimelineEntry]
  });

  res.json({ message: 'Ticket assigned successfully', ticket: updated });
});

// @route   POST /api/tickets/:id/messages
// @desc    Add a message/reply to ticket
router.post('/:id/messages', (req, res) => {
  const { author, role, message } = req.body;
  if (!author || !message) {
    return res.status(400).json({ message: 'Author and message are required' });
  }

  const existing = storage.getTicketById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  const newEntry = {
    id: `tl_${Date.now()}`,
    author,
    role: role || 'student',
    message,
    timestamp: new Date().toISOString()
  };

  const updated = storage.updateTicket(req.params.id, {
    timeline: [...(existing.timeline || []), newEntry]
  });

  res.json({ message: 'Message added to timeline', ticket: updated });
});

// @route   PATCH /api/tickets/:id
// @desc    Full update of ticket / suggestion / volunteer details (Admin only)
router.patch('/:id', authMiddleware, adminOnly, (req, res) => {
  const existing = storage.getTicketById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  const {
    subject,
    description,
    category,
    priority,
    status,
    assignedTo,
    studentName,
    studentEmail,
    studentId,
    llbYear,
    section,
    phone
  } = req.body;

  const updates = {};
  if (subject !== undefined) updates.subject = subject.trim();
  if (description !== undefined) updates.description = description.trim();
  if (category !== undefined) updates.category = category;
  if (priority !== undefined) updates.priority = priority;
  if (status !== undefined) updates.status = status;
  if (assignedTo !== undefined) updates.assignedTo = assignedTo;
  if (studentName !== undefined) updates.studentName = studentName.trim();
  if (studentEmail !== undefined) updates.studentEmail = studentEmail.trim();
  if (studentId !== undefined) updates.studentId = studentId.trim();
  if (llbYear !== undefined) updates.llbYear = llbYear;
  if (section !== undefined) updates.section = section;
  if (phone !== undefined) updates.phone = phone;

  const updated = storage.updateTicket(req.params.id, updates);
  res.json({ message: 'Record updated successfully', ticket: updated });
});

// @route   DELETE /api/tickets/:id
// @desc    Delete ticket (Admin only)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const deleted = storage.deleteTicket(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  res.json({ message: 'Ticket deleted successfully', ticket: deleted });
});

module.exports = router;
