/* Функція для читання завантажених файлів */

export const  readXlsxFile =(file, sheetIndex) =>{
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
