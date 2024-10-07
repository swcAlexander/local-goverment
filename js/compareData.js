import { sendViberMessage } from "./sendViberMessage";

export const compareData =(data1, data2, col1Index, col2Index) => {
    const result = [];
    if (data1.length > 0) {
        result.push([...data1[0], "Phone"]); 
    }

    data1.forEach(row1 => {
        const cell1 = Number(row1[col1Index]);
        if (!cell1) return;

        data2.forEach(row2 => {
          const cell2 = Number(row2[col2Index]);
          const phone = row2[col2Index + 1];
          
          if (!cell2) return;

          if (cell1 === cell2) {
            const rowWithPhone = [...row1, phone];
            result.push(rowWithPhone);


            sendViberMessage(phone, "У вас є неоплачені податкові зобов'язання. За деталями зверніться до старости старостинського округу.");
          }
        });
    });

    return result;
}