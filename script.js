document.addEventListener('DOMContentLoaded', () => {

  const CHECKBOX_SEL = '.card input[type=checkbox]';
  const STORAGE_SELECTED_ID = 'selectedItems';

  const toggleResetBtn = (state = false) => {
    document.querySelectorAll('[data-reset-btn]').forEach($el => {
      state
        ? $el.classList.remove('dn')
        : $el.classList.add('dn');
    });
  };

  const initViewPort = () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  initViewPort();
  // We listen to the resize event
  window.addEventListener('resize', initViewPort);

  const initCardIds = () => {
    document.querySelectorAll('.card').forEach($el => {
      const $title = $el.querySelector('.card__title');
      if (!$title) return;

      $el.setAttribute('data-card-id', $title.textContent);
    });
  };
  initCardIds();

  const storeCurrentState = () => {
    let selectedItems = [];
    document.querySelectorAll(CHECKBOX_SEL + ':checked').forEach($el => {
      if (!$el.checked) return;

      const $card = $el.closest('.card');
      if (!$card) return;

      const title = $card.dataset.cardId;
      if (!title) return;

      selectedItems.push(title);
    });

    toggleResetBtn(selectedItems && selectedItems.length);
    localStorage.setItem(STORAGE_SELECTED_ID, JSON.stringify(selectedItems));
  };

  const initCurrentState = () => {
    const selectedItems = JSON.parse(localStorage.getItem(STORAGE_SELECTED_ID) || '[]') || [];

    if (!Array.isArray(selectedItems) || !selectedItems.length) return;

    toggleResetBtn(true);
    selectedItems.forEach(selectedItem => {
      if (!selectedItem) return;

      const $card = document.querySelector(`.card[data-card-id="${selectedItem}"]`);
      if (!$card) return;

      const $input = $card.querySelector('input[type=checkbox]');
      if (!$input) return;

      $input.checked = true;
    });
  };
  initCurrentState();

  document.querySelectorAll(CHECKBOX_SEL).forEach(el => {
    el.addEventListener('change', event => {
      // event.currentTarget.checked
      storeCurrentState();
    });
  });

  const resetCurrentState = () => {
    localStorage.setItem(STORAGE_SELECTED_ID, '[]');
    document.querySelectorAll(CHECKBOX_SEL + ':checked').forEach($el => {
      $el.checked = false;
    });
    toggleResetBtn(false);
  };

  document.querySelectorAll('[data-reset-btn]').forEach($el => {
    $el.addEventListener('click', () => {
      resetCurrentState();
    })
  });
});
