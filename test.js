const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Connect to the SQLite database
const db = new sqlite3.Database('devices.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Function to fetch data and write to a JSON file
function exportDataToJson(tableName, outputFile) {
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            return;
        }

        // Convert data to JSON format
        const jsonData = JSON.stringify(rows, null, 2);

        // Write JSON data to a file
        fs.writeFile(outputFile, jsonData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
            } else {
                console.log(`Data successfully written to ${outputFile}`);
            }
        });
    });
}

// Call the function to export data
exportDataToJson('carrier', 'data.json');

// Close the database connection
db.close();
