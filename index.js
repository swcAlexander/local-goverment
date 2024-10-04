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

    const data1 = await readXlsxFile(file1, sheet1);
    const data2 = await readXlsxFile(file2, sheet2);
    const result = compareData(data1, data2, column1, column2);
    const blob = createXlsxFile(result);
    downloadFile(blob, 'result.xlsx');
}

function readXlsxFile(file, sheetIndex) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
            const sheetNames = workbook.SheetNames;

            if (sheetIndex < 0 || sheetIndex >= sheetNames.length) {
                alert(`Sheet ${sheetIndex + 1} не знайдено у ${file.name}`);
                return resolve([]);
            }

            const sheet = workbook.Sheets[sheetNames[sheetIndex]];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            resolve(data);
        };
        reader.readAsArrayBuffer(file);
    });
}

function compareData(data1, data2, col1Index, col2Index) {
    const result = [];
    if (data1.length > 0) {
        result.push(data1[0]);
    }

    data1.forEach(row1 => {
        const cell1 = Number(row1[col1Index]);
        if (!cell1) return;

        data2.forEach(row2 => {
            const cell2 = Number(row2[col2Index]);
            if (!cell2) return;

            if (cell1 === cell2) {
                result.push(row1);
            }
        });
    });

    return result;
}

function createXlsxFile(data) {
    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Results');
    const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'binary' });
    return new Blob([s2ab(wbout)], { type: "application/octet-stream" });
}

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}

function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}