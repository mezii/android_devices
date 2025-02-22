const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const Version = require('../models/Version');
const getStringBeforeDot = str => str ? (str.match(/^([^.]*)/) || [])[1] || "" : null;
const randomNetwork = require("./random/randomNetwork");
const seedDatabase = require('../startup/seed');
const randomAbout = require("./random/randomAbout");
// Get a random device with merged version information
const fetchGeolocation = require("./random/geolocation");
router.get('/seed', async (req,res) => {
    await seedDatabase();
    return res.send("Success seed database");

});
router.get('/test', async (req, res) => {
    return res.send("Test endpoint");
})
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
        // Find the corresponding version in the Version database
        const version = await Version.findOne({ releaseType: randomDevice.VERSION });
        
        if (!version) {
            return res.status(404).json({ message: 'No matching version found for the selected device' });
        }
        const tacs = randomDevice.tacs;
        const TAC = tacs[Math.floor(Math.random() * tacs.length)]["Tac"];
        const aboutInfo = randomAbout(TAC.toString());

        // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // const geolocation = await fetchGeolocation(ip);
        // console.log(geolocation);

        const FIRMWARE = randomDevice.KERNEL.split("-ab")[1];
        const DISPLAY = version.id + "." + FIRMWARE;
        const FINGERPRINT = `${randomDevice.MANUFACTURER}/${randomDevice.PRODUCT}/${randomDevice.PRODUCT}:${version.releaseType}/${version.id}/${FIRMWARE}:user/release-keys`
        const HOST = "SWDD" + (Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000).toString();

        const versionReleaseDate = (new Date(version.releaseDate)).getTime();

        // Merge version data into the device
        const mergedData = {
            version,
            versionReleaseDate,
            DISPLAY,
            FIRMWARE,
            FINGERPRINT,
            HOST,
            "network": randomNetwork(),
            TAC,
            aboutInfo,
            ...randomDevice.toObject(),


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
