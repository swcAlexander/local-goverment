import { s2ab } from "./s2ab.js";

/* Створення  exel файлу */
export const createXlsxFile =(data)=> {
    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Results');
    const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'binary' });
    return new Blob([s2ab(wbout)], { type: "application/octet-stream" });
}
