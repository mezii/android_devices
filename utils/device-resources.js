const Device = require("../models/Device");
allDevices = [];
async function loadAllDevices() {
  allDevices = await Device.find();
}

function getAllDevices() {
  return allDevices;
}

module.exports = {
  loadAllDevices,
  getAllDevices,
};
