const fs = require('fs');
const seedDevices = require("../devices");
const Device = require("../models/Device");
const Version = require("../models/Version");
const versions = require("../versions");

const processSeedData = (data) => {
  return data
    .map(device => {
      const cpu = device.CPU;
      const kernel = device.KERNEL;
      if (cpu && cpu.includes('Intel')) return null; // Skip Intel devices
      if (!kernel || !kernel.includes("-ab")) return null; // Skip if KERNEL doesn't meet condition

      if (device.API) {
        const match = device.API.match(/([\d.]+) \((\d+)\)/);
        if (match) {
          device.VERSION = match[1]; // Extract "8.1"
          device.API_LEVEL = parseInt(match[2], 10); // Extract 27
        } else {
          console.warn(`API format mismatch for device: ${device}`); // Log mismatches
        }
      }
      return device;
    })
    .filter(device => device !== null); // Remove skipped devices
};

const seedDatabase = async () => {
  try {
    console.log(versions.length);

    // Clear existing devices
    await Device.deleteMany({});

    // Process and insert devices
    const processedData = processSeedData(seedDevices);
    await Device.insertMany(processedData);

    // Clear existing versions
    await Version.deleteMany({});
    // Insert versions
    await Version.insertMany(versions);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDatabase;
