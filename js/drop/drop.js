const addButton = document.getElementById('item-1');
const block1 = document.getElementById('list-1');
const block2 = document.getElementById('list-2');

// Функція для створення нового елемента списку
function createListItem(content) {
    const newItem = document.createElement('li');
    newItem.classList.add('item-drop');
    newItem.draggable = true; // Робимо елемент перетягуваним
    newItem.id = `item-${Date.now()}`; // Призначаємо унікальний ID

    // Додаємо контент елементу
    const itemContent = document.createElement('span');
    itemContent.textContent = content;

    // Додаємо іконку смітника
    const trashIcon = document.createElement('span');
    trashIcon.innerHTML = '🗑️';
    trashIcon.classList.add('trash-icon');

    // Додаємо подію видалення на кнопку смітника
    trashIcon.addEventListener('click', () => {
        const confirmDelete = confirm('Ви впевнені, що хочете видалити цей елемент?');
        if (confirmDelete) {
            newItem.remove(); // Видаляємо елемент, якщо підтверджено
        }
    });

    // Додаємо елементи в новий елемент списку
    newItem.appendChild(itemContent);
    newItem.appendChild(trashIcon);

    // Обробляємо події перетягування
    newItem.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
    });

    return newItem;
}

// Додаємо подію при кліку на "+"
addButton.addEventListener('click', () => {
    // Створюємо інпут для введення
    const input = document.createElement('input');
    input.className = "input-drop";
    input.type = 'text';
    input.placeholder = 'Введіть текст';

    // Додаємо поле вводу у список
    block1.insertBefore(input, addButton);

    // Обробляємо натискання Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const content = input.value.trim();
            if (content) {
                // Створюємо новий елемент списку
                const newItem = createListItem(content);
                block1.insertBefore(newItem, addButton); // Додаємо перед кнопкою "+"

                // Очищуємо інпут та видаляємо його після введення
                input.remove();
            }
        }
    });

    // Втрата фокусу на інпуті також видаляє поле вводу
    input.addEventListener('blur', () => {
        input.remove();
    });

    // Фокус на інпуті для зручності
    input.focus();
});

// Дозволяємо перетягування між блоками
const blocks = [block1, block2];

blocks.forEach(block => {
    block.addEventListener('dragover', (e) => {
        e.preventDefault(); // Дозволяємо drop
    });

    block.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const item = document.getElementById(id);
        if (item) {
            block.appendChild(item); // Додаємо перетягнутий елемент у новий блок
        }
    });
});