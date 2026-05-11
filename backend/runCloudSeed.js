const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// The user's cloud URI
const CLOUD_URI = "mongodb+srv://anjanpadaki27:mongoatlas27@cluster0.i5nvbgj.mongodb.net/campusbuddy?appName=Cluster0";

// Force mongoose to use this URI
process.env.MONGO_URI = CLOUD_URI;

const seedAdmin = require('./seedAdmin'); // Wait, seedAdmin is a standalone script that connects itself.

// Let's just execute them via child_process with the env var injected
const { execSync } = require('child_process');

console.log("🚀 Starting Cloud Seeding Process...");

try {
    console.log("1. Seeding Admin...");
    execSync('node seedAdmin.js', { env: { ...process.env, MONGO_URI: CLOUD_URI }, stdio: 'inherit' });

    console.log("\n2. Seeding Dummy Events & Old Students...");
    execSync('node seedData.js', { env: { ...process.env, MONGO_URI: CLOUD_URI }, stdio: 'inherit' });
    
    console.log("\n3. Updating to Indian Students & Randomly Mapping Interests...");
    execSync('node updateStudents.js', { env: { ...process.env, MONGO_URI: CLOUD_URI }, stdio: 'inherit' });

    console.log("\n🎉 Cloud Database successfully seeded!");
} catch(err) {
    console.error("❌ Seeding failed:", err.message);
}
