// Данные берутся из опубликованной Google Таблицы в CSV-формате.
const GOOGLE_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQEXAMPLE/pub?output=csv';

const booksElement = document.querySelector('#books');
const loadingElement = document.querySelector('#loading');
const errorElement = document.querySelector('#error');
const actionButton = document.querySelector('#actionButton');
const buttonStatus = document.querySelector('#buttonStatus');

function parseCSV(csv) {
  return csv.trim().split(/\r?\n/).slice(1).map((row) => {
    const [title, author, year] = row.split(',').map((value) => value.trim().replace(/^"|"$/g, ''));
    return { title, author, year };
  }).filter((book) => book.title && book.author && book.year);
}

function renderBooks(books) {
  booksElement.innerHTML = books.map((book, index) => `
    <article class="book-card">
      <div><span class="book-number">0${index + 1} / BOOK</span><h3>${book.title}</h3><p>${book.author}</p></div>
      <p class="book-year">${book.year}</p>
    </article>`).join('');
}

async function loadBooks() {
  try {
    const response = await fetch(GOOGLE_CSV_URL);
    if (!response.ok) throw new Error(`Сервер ответил с кодом ${response.status}`);
    const books = parseCSV(await response.text());
    if (!books.length) throw new Error('В таблице не найдено корректных строк.');
    renderBooks(books);
  } catch (error) {
    // исправлено: добавлен try/catch и понятное сообщение вместо необработанного rejection.
    errorElement.hidden = false;
    errorElement.textContent = `Не удалось загрузить данные: ${error.message}. Проверьте публикацию таблицы и CSV-ссылку.`;
  } finally {
    loadingElement.hidden = true;
  }
}

actionButton.addEventListener('click', () => {
  console.log('Кнопка нажата');
  document.querySelector('#library').scrollIntoView({ behavior: 'smooth' });
  buttonStatus.textContent = 'Полка открыта — приятного чтения!';
});

loadBooks();
