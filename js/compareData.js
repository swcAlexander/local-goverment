/*  Функція для порівняння даних. */
export const compareData = (data1, data2, col1Index, col2Index) =>{
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
