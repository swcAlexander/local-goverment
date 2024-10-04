
export const downloadFile =(blob, filename) => {
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

/* window.URL.createObjectURL(blob) створює URL-адресу, яка вказує на об'єкт Blob. Це дозволяє браузеру знати, що існують дані, які можна завантажити.
Цей URL не є постійним і існує лише в межах сесії браузера.
const a = document.createElement('a');
Функція створює новий елемент <a> (гіперпосилання), який буде використовуватися для ініціювання завантаження.
a.style.display = 'none' приховує елемент, щоб він не з'являвся на сторінці.
a.href = url присвоює URL, створений раніше, як адресу, за якою буде завантажено файл.
a.download = filename вказує, що файл, який буде завантажено, має мати вказане ім'я.
document.body.appendChild(a);
Функція додає елемент <a> до тіла документа, щоб браузер міг взаємодіяти з ним.
a.click();
Викликається метод click(), який імітує клік миші на елементі <a>. Це запускає процес завантаження файлу.
window.URL.revokeObjectURL(url);
Після завантаження файлу, функція очищає URL, створений для Blob, щоб звільнити ресурси. Це важливо, оскільки вивільнення непотрібних URL допомагає запобігти витокам пам'яті.
document.body.removeChild(a);
Функція видаляє елемент <a> з документа, оскільки він більше не потрібен. */