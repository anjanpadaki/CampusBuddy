const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Use the MONGO_URI from .env or process environment
const CLOUD_URI = process.env.MONGO_URI;

if (!CLOUD_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables.");
    process.exit(1);
}

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
