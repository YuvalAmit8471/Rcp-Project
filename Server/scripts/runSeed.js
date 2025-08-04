#!/usr/bin/env node

const path = require("path");
const { execSync } = require("child_process");

// Change to the server directory
const serverDir = path.join(__dirname, "..");
process.chdir(serverDir);

console.log("Running seed script...");

try {
  // Run the TypeScript seed script
  execSync("npx ts-node scripts/seedDemoRecipes.ts", {
    stdio: "inherit",
    env: { ...process.env },
  });
} catch (error) {
  console.error("Error running seed script:", error.message);
  process.exit(1);
}
