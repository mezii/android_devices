const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const Version = require('../models/Version');
const getStringBeforeDot = str => str ? (str.match(/^([^.]*)/) || [])[1] || "" : null;

// Get a random device with merged version information
router.get('/random', async (req, res) => {
    try {
        const { start_v, end_v } = req.query;
        if (!start_v || !end_v) {
            throw new Error("Invalid start or end version parameters");
        }

        const startVersion = parseInt(start_v);
        const endVersion = parseInt(end_v);
        const versionRange = Array.from(
            { length: endVersion - startVersion + 1 },
            (_, i) => (i + startVersion).toString()
        );

        const devices = await Device.find({});
        const filteredDevices = devices.filter(device =>
            versionRange.includes(getStringBeforeDot(device.VERSION))
        );

        if (filteredDevices.length === 0) {
            return res.status(404).json({ message: 'No devices found in specified version range' });
        }

        // Select a random device
        const randomDevice = filteredDevices[Math.floor(Math.random() * filteredDevices.length)];
        console.log({ releaseType: randomDevice.VERSION });
        // Find the corresponding version in the Version database
        const version = await Version.findOne({ releaseType: randomDevice.VERSION });
        
        if (!version) {
            return res.status(404).json({ message: 'No matching version found for the selected device' });
        }

        // Merge version data into the device
        const mergedData = {
            ...randomDevice.toObject(),
            version
        };

        res.json(mergedData);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching random device',
            error: error.message
        });
    }
});

module.exports = router;
