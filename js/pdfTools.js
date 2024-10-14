document.getElementById('compressButton').addEventListener('click', () => {
  // const quality = parseFloat(
  //   document.getElementById("compressionQuality").value
  //   );
  // const scale = parseFloat(document.getElementById("scale").value);
  compressPDF(0.2, 4);
});
document
  .getElementById('compressMerge')
  .addEventListener('click', () => mergePDFs());
document
  .getElementById('compressSplit')
  .addEventListener('click', () => splitPDF());
document
  .getElementById('convertPDFToJPEG')
  .addEventListener('click', () => convertPDFToJPEG());
document
  .getElementById('convertJPEGToPDF')
  .addEventListener('click', () => convertJPEGToPDF());

// Зменшення PDF з кращою якістю

async function compressPDF(compressionQuality = 0.7, scale = 2) {
  if (typeof pdfjsLib === 'undefined') {
    throw new Error('PDF.js library is not loaded');
  }

  const fileInput = document.getElementById('compressPdfInput');
  const file = fileInput.files[0];

  if (!file) return;

  try {
    const originalName = file.name.split('.')[0];
    const newFileName = `${originalName}-compressed.pdf`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const newPdf = await PDFLib.PDFDocument.create();

    const totalPages = pdf.numPages;
    let processedPages = 0;

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: scale }); // Збільшуємо scale для кращої якості

      const canvas = document.createElement('canvas');
      // Використовуємо більшу роздільну здатність
      canvas.width = viewport.width * window.devicePixelRatio;
      canvas.height = viewport.height * window.devicePixelRatio;

      const context = canvas.getContext('2d', {
        alpha: false, // Вимикаємо прозорість для кращої якості
        willReadFrequently: true, // Оптимізація для частого читання даних
      });

      // Налаштування якості рендерингу
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';

      await page.render({
        canvasContext: context,
        viewport: viewport,
        background: 'white', // Встановлюємо білий фон
        enableWebGL: true, // Використовуємо WebGL якщо можливо
        renderInteractiveForms: true,
      }).promise;

      // Використовуємо PNG для тексту та векторної графіки
      const imageFormat = await page.getAnnotations().then((annotations) => {
        return annotations.length > 0 || page.getTextContent().length > 0
          ? 'image/png'
          : 'image/jpeg';
      });

      const compressedImage = await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          imageFormat,
          compressionQuality
        );
      });

      const compressedArrayBuffer = await compressedImage.arrayBuffer();

      // Вибираємо метод вбудовування залежно від формату
      const image = await ((await imageFormat) === 'image/png'
        ? newPdf.embedPng(compressedArrayBuffer)
        : newPdf.embedJpg(compressedArrayBuffer));

      const newPage = newPdf.addPage([
        viewport.width / scale,
        viewport.height / scale,
      ]);

      newPage.drawImage(image, {
        x: 0,
        y: 0,
        width: viewport.width / scale,
        height: viewport.height / scale,
        interpolate: true, // Покращує якість масштабування
      });

      processedPages++;
    }

    const compressedBytes = await newPdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
      useLinearization: true,
      compress: true,
      preserveGraphics: true, // Зберігаємо якість графіки
    });

    const blob = new Blob([compressedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    a.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error during compression:', error);
    alert('Помилка при стисненні PDF. Спробуйте інший файл.');
  }
}

// Об'єднання PDF
let selectedFiles = [];

document
  .getElementById('mergePdfInput')
  .addEventListener('change', function () {
    const fileInput = document.getElementById('mergePdfInput');
    const file = fileInput.files[0];

    if (file) {
      selectedFiles.push(file);
      const fileList = document.getElementById('fileList');

      const listItem = document.createElement('li');
      listItem.textContent = file.name;
      fileList.appendChild(listItem);

      fileInput.value = '';
    } else {
      alert('Будь ласка, виберіть файл.');
    }
  });

async function mergePDFs() {
  if (selectedFiles.length > 0) {
    const mergedPdfDoc = await PDFLib.PDFDocument.create();

    for (const file of selectedFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
      const pages = await mergedPdfDoc.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      pages.forEach((page) => mergedPdfDoc.addPage(page));
    }

    const mergedPdf = await mergedPdfDoc.save();
    const blob = new Blob([mergedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();

    selectedFiles = [];
    document.getElementById('fileList').innerHTML = '';
  } else {
    alert("Будь ласка, додайте файли для об'єднання.");
  }
}

// Роз'єднання PDF з архівацією
async function splitPDF() {
  const fileInput = document.getElementById('splitPdfInput');
  const file = fileInput.files[0];
  if (file) {
    const newFileName = createSafeFileName(file.name, 'split_pages.zip');
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const zip = new JSZip();

    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const newPdfDoc = await PDFLib.PDFDocument.create();
      const [page] = await newPdfDoc.copyPages(pdfDoc, [i]);
      newPdfDoc.addPage(page);

      const splitPdf = await newPdfDoc.save();
      zip.file(`split_page_${i + 1}.pdf`, splitPdf);
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = newFileName;
      a.click();
    });
  }
}

// Конвертація PDF в JPEG
async function convertPDFToJPEG() {
  const fileInput = document.getElementById('convertPdfToJpegInput');
  const file = fileInput.files[0];

  if (!file) {
    console.error('Файл не вибрано');
    return;
  }

  try {
    // Зчитуємо файл як ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Завантажуємо PDF документ
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    // Отримуємо першу сторінку
    const firstPage = pages[0];

    // Отримуємо розміри сторінки
    const { width, height } = firstPage.getSize();

    // Створюємо canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // Рендеримо PDF на canvas використовуючи pdf.js
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.0 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Конвертуємо canvas в JPEG
    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.8);

    // Створюємо посилання для завантаження
    const downloadLink = document.createElement('a');
    downloadLink.href = jpegDataUrl;
    downloadLink.download = 'converted-page.jpg';

    // Додаємо посилання на сторінку і емулюємо клік
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('Помилка при конвертації:', error);
  }
}

// Конвертація JPEG в PDF
async function convertJPEGToPDF() {
  const fileInput = document.getElementById('convertJpegToPdfInput');
  const file = fileInput.files[0];

  if (file) {
    const newFileName = createSafeFileName(file.name, 'converted.pdf');

    const reader = new FileReader();

    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target.result;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgWidth = img.width;
      const imgHeight = img.height;

      const pdfDoc = await PDFLib.PDFDocument.create();
      const page = pdfDoc.addPage([imgWidth, imgHeight]);

      const jpgImage = await pdfDoc.embedJpg(event.target.result);

      page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
      });

      const pdf = await pdfDoc.save();
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = newFileName;
      a.click();

      URL.revokeObjectURL(url);
    };

    reader.readAsDataURL(file);
  }
}
// Функція для створення безпечного імені файлу
const createSafeFileName = (originalName, suf) => {
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');

  const safeName = nameWithoutExt.replace(/[<>:"/\\|?*\x00-\x1F]/g, '-');
  return `${safeName}-${suf}`;
};
