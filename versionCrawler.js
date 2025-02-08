const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://source.android.com/docs/setup/reference/build-numbers';

const versionCrawler = async () => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const versions = [];

        // Select the table containing the build numbers
        $('table').each((index, table) => {
            $(table).find('tbody tr').each((i, row) => {
                const cells = $(row).find('td');
                if (cells.length > 0) {
                    const version = {
                        id: $(cells[0]).text().trim(), // Build ID
                        androidVersion: $(cells[1]).text().trim(), // Build number
                        buildNumber: $(cells[1]).text().trim(), // Build number
                        releaseType: $(cells[2]).text().trim().replace(/Android/g, ''), // Remove "Android" from release type
                        releaseDate: $(cells[4]).text().trim() // Device name or notes
                    };
                    versions.push(version);
                }
            });
        });

        // Write the versions to versions.json
        fs.writeFileSync('versions.json', JSON.stringify(versions, null, 2));
        console.log('Versions data has been crawled and saved to versions.json');
    } catch (error) {
        console.error('Error crawling versions:', error);
    }
};

versionCrawler();