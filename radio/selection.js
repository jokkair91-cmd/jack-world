const buttons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.grid article');
buttons.forEach(button => button.addEventListener('click', () => {
  buttons.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  cards.forEach(card => card.classList.toggle('hidden', filter !== 'all' && !card.dataset.tags.includes(filter)));
}));
