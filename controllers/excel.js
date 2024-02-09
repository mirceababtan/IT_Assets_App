const excelJS = require('exceljs');
const path = require('path');
const Model = require(path.resolve(__dirname, '../models/models.js'));

const model = new Model();

//Write an export function that sends the data to a workbook and its passed to the response
async function exportAllDevices(req, res) {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Devices');

    worksheet.columns = [
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Tag', key: 'tag', width: 10 },
        { header: 'Name', key: 'name', width: 10 },
        { header: 'Type', key: 'type', width: 10 },
        { header: 'Service Tag/IMEI', key: 'service_tag', width: 10 },
        { header: 'Details', key: 'details', width: 24 },
    ];

    const devices = await model.getAll('devices');

    console.log(devices);

    devices.forEach(device => {
        worksheet.addRow(device);
    });

    return workbook.xlsx.writeBuffer()
}




module.exports = {
    exportAllDevices
}
