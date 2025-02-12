const os = require('os');
const routerAddresses = require("./routerAddreses");

// Generate BSSID (Random MAC Address)
function generateBSSID() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
}

// Get Device LAN Address
function getDeviceLANAddress(routerAddress) {
    const baseAddress = routerAddress.split('.').slice(0, 3).join('.'); // Get the first three parts of the IP
    const randomLastNumber = Math.floor(Math.random() * (255 - 2 + 1)) + 2; // Random number between 2 and 255
    return `${baseAddress}.${randomLastNumber}`;
}


function generateRouterAddress() {
    const randomIndex = Math.floor(Math.random() * routerAddresses.length);
    return routerAddresses[randomIndex];
}
function getNetworkAddress() {
    const randomPart1 = Math.floor(Math.random() * 256); // Random number between 0-255
    const randomPart2 = Math.floor(Math.random() * 256); // Random number between 0-255
    const randomPart3 = Math.floor(Math.random() * 256); // Random number between 0-255
    return `${randomPart1}.${randomPart2}.${randomPart3}.1`; // Always end with .1
}

function getRandomWiFiName() {
    const adjectives = [
        "Fast", "Smart", "Secure", "Dynamic", "Bright", "Silent", "Friendly", 
        "Cool", "Strong", "Happy", "Blazing", "Invisible", "Reliable", "Stealthy", 
        "Hyper", "Turbo", "Elite", "NextGen", "Future", "Magic", "Quantum"
    ];

    const nouns = [
        "Network", "Connection", "Router", "Link", "Access", "WiFi", "Spot", 
        "Hub", "Gateway", "Node", "Mesh", "Grid", "Signal", "Spectrum", 
        "Stream", "Channel", "Net", "Cloud", "Web", "Bridge"
    ];

    const prefixes = [
        "Home", "Office", "Guest", "Public", "Private", "School", "Cafe", 
        "Library", "Hotel", "Airport", "Shop", "Studio", "Enterprise", 
        "Work", "Game", "Backup", "Family", "City", "Dynamic", "Secure"
    ];

    const suffixes = [
        "24/7", "Free", "Pro", "Ultra", "Max", "Zone", "Prime", "Plus", "Secure", 
        "Unlimited", "X", "HQ", "5G", "4G", "Broadband", "Express", "Net"
    ];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randomNumber = Math.floor(Math.random() * 1000); // Random number between 0 and 999

    // Randomly decide whether to include each part
    const includePrefix = Math.random() > 0.5; // 50% chance
    const includeAdjective = Math.random() > 0.5;
    const includeNoun = Math.random() > 0.5;
    const includeSuffix = Math.random() > 0.5;
    const includeNumber = Math.random() > 0.5;

    // Build the WiFi name based on inclusion flags
    const parts = [];
    if (includePrefix) parts.push(randomPrefix);
    if (includeAdjective) parts.push(randomAdjective);
    if (includeNoun) parts.push(randomNoun);
    if (includeSuffix) parts.push(randomSuffix);
    if (includeNumber) parts.push(randomNumber);

    return parts.join('_');
}
function networkAddresses() {
    const ssid = getRandomWiFiName();
    const bssid = generateBSSID();
    const networkAddress = getNetworkAddress();
    const routerAddress = generateRouterAddress(networkAddress);
    const lanAddress = getDeviceLANAddress(routerAddress);
    return {
       ssid,bssid,networkAddress,routerAddress,lanAddress
    }
    
}





module.exports = networkAddresses;