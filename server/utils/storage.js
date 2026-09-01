const fs = require('fs');
const path = require('path');
const { seedUsers, seedNotices, seedFaqs, seedTickets, seedTeam, seedManifesto } = require('../data/seedData');

const DB_FILE = path.join(__dirname, '../data/db.json');

let db = {
  users: [...seedUsers],
  notices: [...seedNotices],
  faqs: [...seedFaqs],
  tickets: [...seedTickets],
  team: [...seedTeam],
  manifesto: [...seedManifesto]
};

// Initialize or load DB
function initDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
      console.log('📦 Loaded existing database from db.json');
    } else {
      saveDB();
      console.log('🌱 Seeded new database into db.json');
    }
  } catch (err) {
    console.error('Error initializing db.json, falling back to seed data:', err.message);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err.message);
  }
}

const storage = {
  init: initDB,

  // Users
  getUsers: () => db.users,
  getUserById: (id) => db.users.find(u => u.id === id),
  getUserByEmail: (email) => db.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  addUser: (user) => {
    db.users.push(user);
    saveDB();
    return user;
  },

  // Tickets
  getTickets: () => db.tickets,
  getTicketById: (id) => db.tickets.find(t => t.id === id || t.ticketId.toUpperCase() === id.toUpperCase()),
  getTicketByNumber: (num) => db.tickets.find(t => t.ticketId.replace('#', '').toUpperCase() === num.replace('#', '').toUpperCase()),
  getUserTickets: (email) => db.tickets.filter(t => t.studentEmail.toLowerCase() === email.toLowerCase()),
  addTicket: (ticket) => {
    db.tickets.unshift(ticket);
    saveDB();
    return ticket;
  },
  updateTicket: (id, updates) => {
    const idx = db.tickets.findIndex(t => t.id === id || t.ticketId === id);
    if (idx !== -1) {
      db.tickets[idx] = { ...db.tickets[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDB();
      return db.tickets[idx];
    }
    return null;
  },
  deleteTicket: (id) => {
    const idx = db.tickets.findIndex(t => t.id === id || t.ticketId === id);
    if (idx !== -1) {
      const removed = db.tickets.splice(idx, 1);
      saveDB();
      return removed[0];
    }
    return null;
  },

  // Notices
  getNotices: () => db.notices,
  addNotice: (notice) => {
    db.notices.unshift(notice);
    saveDB();
    return notice;
  },
  updateNotice: (id, updates) => {
    const idx = db.notices.findIndex(n => n.id === id);
    if (idx !== -1) {
      db.notices[idx] = { ...db.notices[idx], ...updates };
      saveDB();
      return db.notices[idx];
    }
    return null;
  },
  deleteNotice: (id) => {
    const targetId = String(id);
    const idx = db.notices.findIndex(n => String(n.id) === targetId || String(n._id) === targetId);
    if (idx !== -1) {
      const removed = db.notices.splice(idx, 1);
      saveDB();
      return removed[0];
    }
    return null;
  },

  // FAQs
  getFaqs: () => db.faqs,
  addFaq: (faq) => {
    db.faqs.push(faq);
    saveDB();
    return faq;
  },
  updateFaq: (id, updates) => {
    const idx = db.faqs.findIndex(f => f.id === id);
    if (idx !== -1) {
      db.faqs[idx] = { ...db.faqs[idx], ...updates };
      saveDB();
      return db.faqs[idx];
    }
    return null;
  },
  deleteFaq: (id) => {
    const idx = db.faqs.findIndex(f => f.id === id);
    if (idx !== -1) {
      const removed = db.faqs.splice(idx, 1);
      saveDB();
      return removed[0];
    }
    return null;
  },

  // Team
  getTeam: () => db.team,
  addTeamMember: (member) => {
    db.team.push(member);
    saveDB();
    return member;
  },
  updateTeamMember: (id, updates) => {
    const idx = db.team.findIndex(t => String(t.id) === String(id));
    if (idx !== -1) {
      db.team[idx] = { ...db.team[idx], ...updates };
      saveDB();
      return db.team[idx];
    }
    return null;
  },
  deleteTeamMember: (id) => {
    const idx = db.team.findIndex(t => String(t.id) === String(id));
    if (idx !== -1) {
      const removed = db.team.splice(idx, 1);
      saveDB();
      return removed[0];
    }
    return null;
  },

  // Manifesto
  getManifesto: () => db.manifesto || [],
  addManifestoPoint: (point) => {
    if (!db.manifesto) db.manifesto = [];
    db.manifesto.push(point);
    saveDB();
    return point;
  },
  updateManifestoPoint: (id, updates) => {
    if (!db.manifesto) db.manifesto = [];
    const idx = db.manifesto.findIndex(m => String(m.id) === String(id));
    if (idx !== -1) {
      db.manifesto[idx] = { ...db.manifesto[idx], ...updates };
      saveDB();
      return db.manifesto[idx];
    }
    return null;
  },
  deleteManifestoPoint: (id) => {
    if (!db.manifesto) db.manifesto = [];
    const idx = db.manifesto.findIndex(m => String(m.id) === String(id));
    if (idx !== -1) {
      const removed = db.manifesto.splice(idx, 1);
      saveDB();
      return removed[0];
    }
    return null;
  }
};

module.exports = storage;
