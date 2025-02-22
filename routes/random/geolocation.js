const axios = require('axios');
const fs = require('fs');

// Function to fetch geolocation data
async function fetchGeolocation(ipAddress) {
  try {
    const geoURL = `https://freeipapi.com/api/json/${ipAddress}`;
    console.log(geoURL);
    const response = await axios.get(geoURL);
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Failed to fetch geolocation data");
    }
  } catch (error) {
    console.error("Error fetching geolocation:", error.message);
    return null;
  }
}

// Function to write geolocation data to a file
async function generateGeolocationFile(ipAddress, outputPath) {
  const geoData = await fetchGeolocation(ipAddress);

  if (geoData) {
    fs.writeFile(outputPath, JSON.stringify(geoData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err.message);
      } else {
        console.log(`Geolocation data written to ${outputPath}`);
      }
    });
  }
}

module.exports = fetchGeolocation;