// Функция создания карточки
function createCard(cardData, deleteCard, openImagePopup, handleLikeClick, cardTemplate) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => deleteCard(cardElement));
  cardImage.addEventListener('click', () => openImagePopup(cardData));
  likeButton.addEventListener('click', () => handleLikeClick(likeButton));

  return cardElement;
}

// Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// Функция обработки лайка
function handleLikeClick(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, handleLikeClick };