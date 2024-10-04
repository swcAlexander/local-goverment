document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu_toggle');
  const menuToggleClose = document.getElementById('menu_toggle_close');
  const mobileMenu = document.getElementById('mobile_menu');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('is_open');
    menuToggle.classList.add('hidden'); // Додаємо клас прихованої кнопки
    menuToggleClose.classList.remove('hidden'); // Відкриваємо кнопку закриття меню
  });

  menuToggleClose.addEventListener('click', () => {
    mobileMenu.classList.remove('is_open');
    menuToggle.classList.remove('hidden'); // Показуємо кнопку відкриття меню
    menuToggleClose.classList.add('hidden'); // Приховуємо кнопку закриття меню
  });
});
