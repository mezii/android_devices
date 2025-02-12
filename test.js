const xlsx = require("xlsx");
const fs = require("fs");

// Step 1: Read the Excel file
const workbook = xlsx.readFile("./tac.xlsx"); // Replace 'input.xlsx' with your file path
const sheetName = workbook.SheetNames[0]; // Get the first sheet (adjust if necessary)
const worksheet = workbook.Sheets[sheetName];

// // Step 2: Convert the sheet to JSON
const data = xlsx.utils.sheet_to_json(worksheet);

// // Step 3: Filter rows based on condition
const filteredData = data.filter(row => {
  const manufacturer = row["UE Manifacturer"]; 
  console.log(manufacturer)// Adjust column header name
  return manufacturer && manufacturer.includes("Samsung");
});
console.log(filteredData);
// // Step 4: Save filtered data to a JSON file
fs.writeFileSync("output.json", JSON.stringify(filteredData, null, 2));

// console.log("Filtered data has been saved to output.json");
