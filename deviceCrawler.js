const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const devicesDir = path.join(__dirname, 'devices');
const outputFile = path.join(__dirname, 'devices.json');

if (!fs.existsSync(devicesDir)) {
    fs.mkdirSync(devicesDir, { recursive: true });
}

async function crawlDeviceInfo(itemId) {
    try {
        const url = `https://www.deviceinfohw.ru/devices/item.php?item=${itemId}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        let deviceInfo = {};
        
        $('table.tcommon tr').each((index, element) => {
            const key = $(element).find('td').eq(0).text().trim();
            const value = $(element).find('td').eq(1).html();
            
            if (key && value) {
                deviceInfo[key] = value.replace(/<br\s*\/?>(, )?/g, ', ').trim();
            }
        });
        
        if (Object.keys(deviceInfo).length < 5 || deviceInfo['MANUFACTURER']?.toLowerCase() !== 'samsung') { // Skip if not enough information or not Samsung
            console.log(`Skipping item ${itemId} due to insufficient data or not a Samsung device.`);
            return;
        }
        
        console.log(`Saving data for item ${itemId}`);
        const deviceData = JSON.stringify(deviceInfo, null, 2);
        fs.writeFileSync(path.join(devicesDir, `device_${itemId}.json`), deviceData);
        fs.appendFileSync(outputFile, deviceData + ',\n');
    } catch (error) {
        console.error(`Error fetching data for item ${itemId}:`, error);
    }
}

async function crawlRange(start, end) {
    for (let itemId = start; itemId >= end; itemId--) {
        await crawlDeviceInfo(itemId);
    }
    console.log(`Crawling completed from ${start} to ${end}`);
}

crawlRange(96182, 13000);
