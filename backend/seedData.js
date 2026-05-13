const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Find the admin user to be the creator of the events
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        console.error('❌ Admin user not found. Please run seedAdmin.js first.');
        process.exit(1);
    }

    // 1. Create Students
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('student123', salt);

    const studentsData = [
      { name: 'Bob Builder', email: 'bob@msrit.edu', password, role: 'student' },
      { name: 'Charlie Clark', email: 'charlie@msrit.edu', password, role: 'student' },
      { name: 'Diana Prince', email: 'diana@msrit.edu', password, role: 'student' },
      { name: 'Ethan Hunt', email: 'ethan@msrit.edu', password, role: 'student' }
    ];

    const students = [];
    for (const data of studentsData) {
      let student = await User.findOne({ email: data.email });
      if (!student) {
        student = await User.create(data);
        console.log(`Created student: ${data.name}`);
      }
      students.push(student);
    }
    
    // Also try to grab 'alice@msrit.edu' if she exists from the browser steps
    const alice = await User.findOne({ email: 'alice@msrit.edu' });
    if (alice && !students.find(s => s.email === alice.email)) {
        students.push(alice);
    }

    // 2. Create Events
    const eventsData = [
      {
        eventName: 'AI Hackathon 2026',
        type: 'Technical',
        date: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        location: 'CS Block, Lab 2',
        createdBy: admin._id
      },
      {
        eventName: 'Capture The Flag (CTF)',
        type: 'Technical',
        date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: 'Networking Lab',
        createdBy: admin._id
      },
      {
        eventName: 'Science & Tech Quiz',
        type: 'Technical',
        date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        location: 'Main Auditorium',
        createdBy: admin._id
      },
      {
        eventName: 'React Native Workshop',
        type: 'Workshop',
        date: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        location: 'Seminar Hall A',
        createdBy: admin._id
      },
      {
        eventName: 'Cloud Computing Summit',
        type: 'Technical',
        date: new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        location: 'Main Auditorium',
        createdBy: admin._id
      },
      {
        eventName: 'Inter-College Football',
        type: 'Sports',
        date: new Date(new Date().getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        location: 'Campus Ground',
        createdBy: admin._id
      },
      {
        eventName: 'Ethical Hacking Boot Camp',
        type: 'Technical',
        date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        location: 'Cyber Security Lab',
        createdBy: admin._id
      },
      {
        eventName: 'Annual Cultural Fest',
        type: 'Cultural',
        date: new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        location: 'Open Air Theatre',
        createdBy: admin._id
      },
      {
        eventName: 'UX/UI Design Sprint',
        type: 'Workshop',
        date: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        location: 'Design Studio',
        createdBy: admin._id
      }
    ];

    const events = [];
    for (const data of eventsData) {
        let event = await Event.findOne({ eventName: data.eventName });
        if (!event) {
            event = await Event.create(data);
            console.log(`Created event: ${data.eventName}`);
        }
        events.push(event);
    }

    // 3. Mark random interests for students
    for (const student of students) {
        // Just clear previous interests for this seed run's clean slate on specific students
        // student.interests = []; 
        let updated = false;

        for (const event of events) {
            // 50% chance a student is interested in an event
            if (Math.random() > 0.5) {
                // Check if not already interested
                if (!student.interests.some(i => i.eventId.toString() === event._id.toString())) {
                    student.interests.push({
                        eventId: event._id,
                        hasTeam: Math.random() > 0.5 // 50% chance they have a team
                    });
                    updated = true;
                }
            }
        }
        if (updated) {
            await student.save();
        }
    }

    console.log('✅ Students, events, and dummy interests successfully seeded!');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
