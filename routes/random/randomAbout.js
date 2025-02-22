function generateSerialNumber() {
    const factoryCode = `R${Math.floor(Math.random() * (70 - 39 + 1) + 39)}`; // Random factory code between R39 and R70
    const year = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter for the year (A-Z)
    const week = String(Math.floor(Math.random() * 52) + 1).padStart(2, '0'); // Random week (01-52)
    const uniqueCode = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random alphanumeric characters

    return `${factoryCode}${year}${week}${uniqueCode}`;
}
function generateIMEI(tac) {
    if (tac.length !== 8 || !/^\d+$/.test(tac)) {
        throw new Error("Invalid TAC number. It must be exactly 8 numeric digits.");
    }

    // Generate 6 random digits for the rest of the IMEI, excluding the checksum
    const randomDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");

    // Combine TAC and random digits
    const partialIMEI = tac + randomDigits;

    // Calculate the Luhn checksum
    const checksum = calculateLuhnChecksum(partialIMEI);

    // Combine partial IMEI and checksum
    return partialIMEI + checksum;
}
function generateGAID() {
    // Generate a random UUID for GAID
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return template.replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === 'x' ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }

function calculateLuhnChecksum(imei) {
    let sum = 0;
    for (let i = 0; i < imei.length; i++) {
        let digit = parseInt(imei[i], 10);

        // Double every second digit (starting from the right)
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9; // Subtract 9 if the doubled value is greater than 9
            }
        }

        sum += digit;
    }

    // The checksum digit is the value needed to make the sum a multiple of 10
    return (10 - (sum % 10)) % 10;
}
function randomAbout(tac){
    const serialNumber = generateSerialNumber();
    const imei = generateIMEI(tac);
    const gaid = generateGAID();
    return {
        serialNumber,imei,gaid
    }
}

module.exports = randomAbout;






