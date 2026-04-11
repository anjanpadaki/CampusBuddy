const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');

const updateStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for update');

    // Remove old students (keep admin)
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('🗑️  Cleared old student records');

    // 1. Create New Students
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('student123', salt);

    const studentsData = [
      { name: 'Aarav Sharma', email: 'aarav@msrit.edu', password, role: 'student' },
      { name: 'Priya Patel', email: 'priya@msrit.edu', password, role: 'student' },
      { name: 'Rohan Desai', email: 'rohan@msrit.edu', password, role: 'student' },
      { name: 'Ananya Singh', email: 'ananya@msrit.edu', password, role: 'student' },
      { name: 'Karan Malhotra', email: 'karan@msrit.edu', password, role: 'student' },
      { name: 'Neha Gupta', email: 'neha@msrit.edu', password, role: 'student' }
    ];

    const students = [];
    for (const data of studentsData) {
      const student = await User.create(data);
      console.log(`Created student: ${data.name}`);
      students.push(student);
    }

    // Assign random interests to the new students for existing events
    const events = await Event.find({});
    
    for (const student of students) {
        let updated = false;

        for (const event of events) {
            // 40% chance a student is interested in an event
            if (Math.random() > 0.6) {
                student.interests.push({
                    eventId: event._id,
                    hasTeam: Math.random() > 0.5 // 50% chance they have a team
                });
                updated = true;
            }
        }
        if (updated) {
            await student.save();
        }
    }

    console.log('✅ New students with Indian names successfully seeded!');
    process.exit(0);

  } catch (err) {
    console.error('Error updating students:', err);
    process.exit(1);
  }
};

updateStudents();
