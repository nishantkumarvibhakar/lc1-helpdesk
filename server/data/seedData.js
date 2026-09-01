const seedUsers = [
  {
    id: "usr_admin_01",
    name: "Prashant Kumar Diwakar",
    username: "prashantdiwakar",
    email: "anubhavnishant1@gmail.com",
    password: "$2a$10$X9kS3R6ncF0FZjZeObBHW./lzKqu1RlzhzU.762kmZUDMe/V8cuK2", // Nishant@80
    role: "admin",
    designation: "Presidential Candidate & Main Leader",
    studentId: "24LC10001",
    phone: "6206319802",
    createdAt: new Date("2026-01-01").toISOString()
  },
  {
    id: "usr_student_01",
    name: "Aarav Sharma",
    email: "student@lc1.du.ac.in",
    password: "$2a$10$k1wP2Gq/66jYgq8p0p7FZe0kM6/U6eO9p3vE2YtB0/s0.4tZgI66I", // student123
    role: "student",
    designation: "1st Year LL.B. Student",
    studentId: "24LC10124",
    phone: "+91 98111 22334",
    createdAt: new Date("2026-02-10").toISOString()
  }
];

const seedNotices = [
  {
    id: "not_01",
    title: "Urgent: Examination Form Submission Deadline - Sem II/IV/VI",
    category: "Examination",
    description: "All LL.B. students of Law Centre-1 appearing for May-June 2026 term-end examinations must submit their online exam forms on the DU Samarth portal by 28th August 2026, 5:00 PM. No late submissions will be accepted by the Exam Branch.",
    priority: "Urgent",
    isPinned: true,
    publishedBy: "Team Prashant Diwakar",
    date: "2026-08-20",
    linkText: "Visit DU Samarth Portal",
    linkUrl: "https://slc.uod.ac.in"
  },
  {
    id: "not_02",
    title: "1st Year LL.B. Internal Assessment & Memorial Submission Dates",
    category: "Academic",
    description: "The internal assessment tests and Moot Court memorial drafts for 1st Year (Semester II) students will be accepted between 5th September and 12th September 2026. Submit hard copies to your respective subject convenors.",
    priority: "High",
    isPinned: true,
    publishedBy: "Team Prashant Diwakar",
    date: "2026-08-18",
    linkText: "Download Format Guidelines",
    linkUrl: "#"
  },
  {
    id: "not_03",
    title: "Extended Law Centre-1 Library Timings (Open till 9:00 PM)",
    category: "Library",
    description: "In view of upcoming semester exams, the Faculty of Law LC-1 library reading room will remain open from 8:00 AM to 9:00 PM on all working days including Saturdays starting next Monday.",
    priority: "Normal",
    isPinned: false,
    publishedBy: "Team Prashant Diwakar",
    date: "2026-08-15",
    linkText: "Library Rules & Details",
    linkUrl: "#"
  },
  {
    id: "not_04",
    title: "Duplicate / Re-issue of LC-1 Student ID Cards at Counter No. 3",
    category: "ID Card / Documents",
    description: "Students who lost their physical ID card can collect their newly printed biometric barcoded cards from Counter No. 3 between 2:00 PM and 4:30 PM after submitting the police DDR copy and fee receipt.",
    priority: "Normal",
    isPinned: false,
    publishedBy: "Team Prashant Diwakar",
    date: "2026-08-12",
    linkText: "Check Document Checklist",
    linkUrl: "#"
  }
];

const seedFaqs = [
  {
    id: "faq_01",
    category: "Examination",
    question: "What should I do if my exam fee was deducted from bank but the DU portal shows 'Unpaid'?",
    answer: "Wait for 24-48 hours for the payment gateway reconciliation. If it still shows unpaid, do not pay again immediately. Take a screenshot of the bank transaction ID, raise a ticket here under 'Examination' category, or visit the LC-1 office Counter No. 2 with the transaction slip."
  },
  {
    id: "faq_02",
    category: "Academic",
    question: "What is the mandatory attendance requirement for LL.B. at Law Centre-1, DU?",
    answer: "As per Bar Council of India (BCI) and Delhi University rules, a minimum of 70% attendance in lectures and practical training classes is mandatory in each subject to be eligible to write semester examinations."
  },
  {
    id: "faq_03",
    category: "ID Card / Documents",
    question: "How can I obtain a Migration Certificate or Character Certificate from LC-1?",
    answer: "Apply online through the DU Student Portal or submit a written application at LC-1 Admin Office with your clearance slip from the Library, copy of marksheets, and payment receipt of prescribed fee."
  },
  {
    id: "faq_04",
    category: "Library",
    question: "How do I access SCC Online, Manupatra, and HeinOnline from off-campus / home?",
    answer: "Remote access to legal databases is provided through your official DU institutional email address (@lc1.du.ac.in). Contact the Library technical desk or raise a ticket under 'Library' to receive your remote access activation credentials."
  },
  {
    id: "faq_05",
    category: "Fees",
    question: "Where and how to pay the Re-appear / Back paper examination fee?",
    answer: "Re-appear examination fee must be paid online via the DU Samarth portal while filling the examination form. Select your back paper codes and make the payment via net banking / UPI."
  },
  {
    id: "faq_06",
    category: "Portal/Technical Issue",
    question: "I forgot my DU Samarth / LC1 portal password and am not receiving the OTP. What can I do?",
    answer: "First check your spam/junk folder for the OTP. If still not received, raise a ticket here under 'Portal/Technical Issue' with your Roll Number and registered mobile number; our team will assist in resetting it with the DU Computer Centre."
  }
];

const seedTickets = [
  {
    id: "tkt_01",
    ticketId: "LC1-2026-00124",
    studentName: "Aarav Sharma",
    studentEmail: "student@lc1.du.ac.in",
    studentId: "24LC10124",
    phone: "+91 98111 22334",
    category: "Examination",
    subject: "Exam form fee deducted but Samarth portal shows Pending",
    description: "I submitted the examination fee of Rs. 1420 for 2nd Semester on 20th August via UPI (Ref: 42109823412). The amount was debited from my SBI account, but the status on the DU Samarth portal is still showing 'Fee Pending'. Please help verify with the accounts section.",
    priority: "High",
    status: "Pending",
    assignedTo: "Rohit Kumar (Portal Team)",
    attachment: "fee_receipt_upi.png",
    timeline: [
      {
        id: "tl_01",
        author: "Aarav Sharma (Student)",
        role: "student",
        message: "Query submitted with transaction screenshot.",
        timestamp: "2026-08-20T11:30:00.000Z"
      }
    ],
    createdAt: "2026-08-20T11:30:00.000Z",
    updatedAt: "2026-08-20T11:30:00.000Z"
  },
  {
    id: "tkt_02",
    ticketId: "LC1-2026-00119",
    studentName: "Sneha Gupta",
    studentEmail: "sneha.g@lc1.du.ac.in",
    studentId: "23LC10088",
    phone: "+91 98999 11223",
    category: "ID Card / Documents",
    subject: "Character Certificate issuance for judicial internship",
    description: "I need an urgent Character and Bona fide Certificate for my upcoming High Court internship starting next week. Application submitted last Tuesday.",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Priya Verma",
    attachment: null,
    timeline: [
      {
        id: "tl_02_1",
        author: "Sneha Gupta (Student)",
        role: "student",
        message: "Application submitted.",
        timestamp: "2026-08-16T10:00:00.000Z"
      },
      {
        id: "tl_02_2",
        author: "Priya Verma (Team Diwakar)",
        role: "admin",
        message: "Certificate verified by Faculty Office. Ready for collection from Admin Window #1.",
        timestamp: "2026-08-18T14:20:00.000Z"
      }
    ],
    createdAt: "2026-08-16T10:00:00.000Z",
    updatedAt: "2026-08-18T14:20:00.000Z"
  },
  {
    id: "tkt_03",
    ticketId: "LC1-2026-00115",
    studentName: "Rahul Mehra",
    studentEmail: "rahul.m@lc1.du.ac.in",
    studentId: "24LC10340",
    phone: "+91 97123 45678",
    category: "Library",
    subject: "SCC Online Off-Campus Access Account Activation",
    description: "Requesting activation credentials for SCC Online off-campus web edition for research purposes.",
    priority: "Normal",
    status: "In Progress",
    assignedTo: "Prashant Diwakar",
    attachment: null,
    timeline: [
      {
        id: "tl_03_1",
        author: "Rahul Mehra (Student)",
        role: "student",
        message: "Query raised.",
        timestamp: "2026-08-17T09:15:00.000Z"
      },
      {
        id: "tl_03_2",
        author: "Prashant Diwakar (Lead)",
        role: "admin",
        message: "Forwarded to the Law Library IT admin. Credentials will be sent on your DU email within 24 hours.",
        timestamp: "2026-08-18T11:00:00.000Z"
      }
    ],
    createdAt: "2026-08-17T09:15:00.000Z",
    updatedAt: "2026-08-18T11:00:00.000Z"
  }
];

const seedTeam = [
  {
    id: "tm_01",
    name: "Prashant Kumar Diwakar",
    role: "Candidate for President (LC-1) • Main Leader",
    organization: "Team Prashant Diwakar",
    phone: "6206319802",
    email: "prashant@lc1helpdesk.in",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Main Campaign Leader & Presidential Candidate. Dedicated to student welfare, academic transparency, and 24/7 issue resolution at Law Centre-1, DU."
  },
  {
    id: "tm_02",
    name: "Rohan Singh",
    role: "Campaign Coordinator & 2nd Year Lead",
    organization: "Team Prashant Diwakar",
    phone: "9546924281",
    email: "rohan.singh@lc1.du.ac.in",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Heading on-ground campaign mobilization, volunteer network, student welfare follow-ups, and 2nd year batch coordination."
  },
  {
    id: "tm_03",
    name: "Siddharth Gour",
    role: "Senior Campaign Strategist & 3rd Year Lead",
    organization: "Team Prashant Diwakar",
    phone: "9266583607",
    email: "siddharth.gour@lc1.du.ac.in",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Managing election strategy, student issues liaison with Faculty administration, policy drafting, and 3rd year outreach."
  }
];

const seedManifesto = [
  {
    id: "mf_01",
    num: "01",
    title: "Guaranteed Clean RO Water",
    desc: "Functional RO water coolers with weekly TDS checks and hygiene audit on all floors.",
    icon: "Droplet"
  },
  {
    id: "mf_02",
    num: "02",
    title: "10 PM Library AC & Reading Room",
    desc: "Extended library hours till 10:00 PM during exam months with working air-conditioning.",
    icon: "Library"
  },
  {
    id: "mf_03",
    num: "03",
    title: "High-Speed Campus Wi-Fi",
    desc: "High-speed Wi-Fi across LC-1 classrooms and remote off-campus proxy for SCC Online / Manupatra.",
    icon: "Wifi"
  },
  {
    id: "mf_04",
    num: "04",
    title: "Hygienic Canteen & Subsidized Food",
    desc: "Quality inspection of canteen food, strict hygiene protocols, and affordable student pricing.",
    icon: "Utensils"
  },
  {
    id: "mf_05",
    num: "05",
    title: "Placement & Internship Cell Revival",
    desc: "Dedicated placement cell connecting LC-1 students with top tier law firms, senior advocates & NGOs.",
    icon: "Scale"
  },
  {
    id: "mf_06",
    num: "06",
    title: "Transparent Attendance Dispute Redressal",
    desc: "Student representation in medical leave clearance and issue hearings before detention lists.",
    icon: "Building2"
  },
  {
    id: "mf_07",
    num: "07",
    title: "Formation of Corporate Law Society",
    desc: "Establishment of dedicated LC-1 Corporate Law Society for corporate mooting, M&A workshops, tier-1 law firm networking, and specialized commercial law seminars.",
    icon: "Scale"
  }
];

module.exports = {
  seedUsers,
  seedNotices,
  seedFaqs,
  seedTickets,
  seedTeam,
  seedManifesto
};
