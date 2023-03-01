const XLSX = require('xlsx');

const productBook = XLSX.readFile('scores.xlsx');
const productSheet = productBook.Sheets[""]