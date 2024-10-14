import { compareData } from "./js/compareData.js";
import { readXlsxFile } from "./js/readXLSX.js";
import { createXlsxFile } from "./js/createXLSX.js";
import { downloadFile } from "./js/download.js";

document.getElementById('compareForm').addEventListener('submit', handleCompare);

async function handleCompare(event) {
    event.preventDefault();
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];
    const sheet1 = parseInt(document.getElementById('sheet1').value) - 1;
    const sheet2 = parseInt(document.getElementById('sheet2').value) - 1;
    const column1 = parseInt(document.getElementById('column1').value) - 1;
    const column2 = parseInt(document.getElementById('column2').value) - 1;

    if (!file1 || !file2) {
        alert("Будь ласка, виберіть обидва файли.");
        return;
    }
    

    const data1 = await readXlsxFile(file1, sheet1 || 0);
    const data2 = await readXlsxFile(file2, sheet2 || 0);
    const result = compareData(data1, data2, column1 || 3, column2 || 3);
    const blob = createXlsxFile(result);
    downloadFile(blob, 'result.xlsx');
}