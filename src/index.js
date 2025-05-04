import "./pages/index.css";
import { initialCards } from "./components/cards.js";
import { createCard, deleteCard, handleLikeClick } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";

// Темплейт карточки
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

// Попап с картинкой
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// Элементы профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Попап редактирования профиля
const editPopup = document.querySelector('.popup_type_edit');
const editForm = editPopup.querySelector('.popup__form');
const nameInput = editForm.querySelector('.popup__input_type_name');
const jobInput = editForm.querySelector('.popup__input_type_description');

// Попап добавления карточки
const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardForm = newCardPopup.querySelector('.popup__form');
const placeNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = newCardForm.querySelector('.popup__input_type_url');

// Функция открытия попапа с картинкой
function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

// Вывести начальные карточки на страницу
initialCards.forEach((cardData) => {
  const newCard = createCard(cardData, deleteCard, openImagePopup, handleLikeClick, cardTemplate);
  placesList.append(newCard);
});

// Обработчик отправки формы добавления карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value
  };
  const newCard = createCard(newCardData, deleteCard, openImagePopup, handleLikeClick, cardTemplate);
  placesList.prepend(newCard);
  newCardForm.reset();
  closeModal(newCardPopup);
}

// Прикрепляем обработчик к форме добавления карточки
newCardForm.addEventListener('submit', handleCardFormSubmit);

// Попапы и кнопки
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const closeButtons = document.querySelectorAll('.popup__close');

// Открытие попапа редактирования с заполнением полей
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editPopup);
});

// Обработчик отправки формы редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editPopup);
}

// Прикрепляем обработчик к форме редактирования
editForm.addEventListener('submit', handleFormSubmit);

// Открытие попапа добавления карточки
addButton.addEventListener('click', () => {
  openModal(newCardPopup);
});

// Закрытие попапов по крестику
closeButtons.forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

// Закрытие попапов по оверлею
document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});