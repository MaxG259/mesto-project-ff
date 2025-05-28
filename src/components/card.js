import { likeCardApi, unlikeCardApi } from "./api.js";

// Функция создания карточки
function createCard(cardData, deleteCard, openImagePopup, handleLikeClick, cardTemplate, userId, openDeletePopup) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Проверяем, лайкнул ли пользователь карточку
  if (cardData.likes && cardData.likes.some(like => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Скрываем кнопку удаления для чужих карточек
  if (cardData.owner && cardData.owner._id !== userId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', () => deleteCard(cardData._id, cardElement, openDeletePopup));
  }

  // Обработчики кликов
  cardImage.addEventListener('click', () => openImagePopup(cardData));
  likeButton.addEventListener('click', () => handleLikeClick(cardData._id, likeButton, likeCount));

  return cardElement;
}

// Функция удаления карточки
function deleteCard(cardId, cardElement, openDeletePopup) {
  // Открываем попап подтверждения удаления
  openDeletePopup(cardId, cardElement);
}

// Функция обработки лайка
function handleLikeClick(cardId, likeButton, likeCount) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  // Отправляем запрос на лайк или снятие лайка
  (isLiked ? unlikeCardApi(cardId) : likeCardApi(cardId))
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch((err) => {
      console.error('Ошибка обработки лайка:', err);
    });
}

export { createCard, deleteCard, handleLikeClick };