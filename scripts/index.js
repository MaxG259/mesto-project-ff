//Темплейт карточки
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;
//DOM узлы



//Функция создания карточки
function createCard(cardData, deleteCard) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  cardElement.querySelector('.card__image').src = cardData.link;
  cardElement.querySelector('.card__image').alt = cardData.name;
  cardElement.querySelector('.card__title').textContent = cardData.name;
  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', function() {
    deleteCard(cardElement);
  });
  return cardElement;
}



//Функция удаления карточки
function deleteCard(card) {
  card.remove();
}



//Вывести карточки на страницу
initialCards.forEach(function(cardData) {
  const newCard = createCard(cardData, deleteCard);
  placesList.append(newCard);
});
