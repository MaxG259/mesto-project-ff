import "./pages/index.css";
import { createCard, deleteCard, handleLikeClick } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, deleteCardApi, updateAvatarApi } from "./components/api.js";

// Объект настроек валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Инициализация валидации для всех форм
enableValidation(validationConfig);

// Темплейт карточки
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template')?.content;
if (!cardTemplate) console.error('Card template not found');

// Попап с картинкой
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup?.querySelector('.popup__image');
const popupCaption = imagePopup?.querySelector('.popup__caption');

// Элементы профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

// Попап редактирования профиля
const editPopup = document.querySelector('.popup_type_edit');
const editForm = editPopup?.querySelector('.popup__form');
const nameInput = editForm?.querySelector('.popup__input_type_name');
const jobInput = editForm?.querySelector('.popup__input_type_description');

// Попап добавления карточки
const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardForm = newCardPopup?.querySelector('.popup__form');
const placeNameInput = newCardForm?.querySelector('.popup__input_type_card-name');
const placeLinkInput = newCardForm?.querySelector('.popup__input_type_url');

// Попап удаления карточки
const deletePopup = document.querySelector('.popup_type_delete-card');
const deleteForm = deletePopup?.querySelector('.popup__form');

// Попап обновления аватара
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarForm = avatarPopup?.querySelector('.popup__form');
const avatarInput = avatarForm?.querySelector('.popup__input_type_url');

// Константы для текстов кнопок
const BUTTON_TEXT = {
  SAVE: 'Сохранить',
  CREATE: 'Создать',
  LOADING: 'Сохранение...'
};

// Функция открытия попапа с картинкой
function openImagePopup(cardData) {
  if (!popupImage || !popupCaption) return;
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

// Функция открытия попапа удаления
function openDeletePopup(cardId, cardElement) {
  currentCardId = cardId;
  currentCardElement = cardElement;
  openModal(deletePopup);
}

// Глобальный ID пользователя и текущей карточки
let userId;
let currentCardId;
let currentCardElement;

// Загрузка данных пользователя и карточек с сервера
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    if (!userData || !Array.isArray(cards)) {
      console.error('Invalid userData or cards:', userData, cards);
      return;
    }
    // Обновляем профиль
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
    // Сохраняем _id пользователя
    userId = userData._id;
    // Рендерим карточки
    cards.forEach((cardData) => {
      const cardElement = createCard(cardData, deleteCard, openImagePopup, handleLikeClick, cardTemplate, userId, openDeletePopup);
      if (cardElement) {
        placesList.append(cardElement);
      }
    });
  })
  .catch((err) => {
    console.error('Ошибка загрузки данных:', err);
  });

// Обработчик отправки формы удаления карточки
function handleDeleteFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = deleteForm.querySelector('.popup__button');
  submitButton.textContent = BUTTON_TEXT.LOADING;
  deleteCardApi(currentCardId)
    .then(() => {
      currentCardElement.remove();
      closeModal(deletePopup);
    })
    .catch((err) => {
      console.error('Ошибка удаления карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = BUTTON_TEXT.SAVE;
    });
}

// Прикрепляем обработчик к форме удаления
if (deleteForm) {
  deleteForm.addEventListener('submit', handleDeleteFormSubmit);
} else {
  console.error('Delete form not found');
}

// Обработчик отправки формы редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = editForm.querySelector('.popup__button');
  submitButton.textContent = BUTTON_TEXT.LOADING;
  updateUserInfo(nameInput.value, jobInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editPopup);
    })
    .catch((err) => {
      console.error('Ошибка обновления профиля:', err);
    })
    .finally(() => {
      submitButton.textContent = BUTTON_TEXT.SAVE;
    });
}

// Прикрепляем обработчик к форме редактирования
editForm?.addEventListener('submit', handleFormSubmit);

// Обработчик отправки формы добавления карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = newCardForm.querySelector('.popup__button');
  submitButton.textContent = BUTTON_TEXT.LOADING;
  addNewCard(placeNameInput.value, placeLinkInput.value)
    .then((cardData) => {
      const newCard = createCard(cardData, deleteCard, openImagePopup, handleLikeClick, cardTemplate, userId, openDeletePopup);
      placesList.prepend(newCard);
      newCardForm.reset();
      clearValidation(newCardForm, validationConfig);
      closeModal(newCardPopup);
    })
    .catch((err) => {
      console.error('Ошибка добавления карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = BUTTON_TEXT.CREATE;
    });
}

// Прикрепляем обработчик к форме добавления карточки
newCardForm?.addEventListener('submit', handleCardFormSubmit);

// Обработчик отправки формы обновления аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  if (!avatarInput) return;
  const submitButton = avatarForm.querySelector('.popup__button');
  submitButton.textContent = BUTTON_TEXT.LOADING;
  const avatarUrl = avatarInput.value;
  updateAvatarApi(avatarUrl)
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar || ''})`;
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
      closeModal(avatarPopup);
    })
    .catch((err) => {
      console.error('Ошибка обновления аватара:', err);
    })
    .finally(() => {
      submitButton.textContent = BUTTON_TEXT.SAVE;
    });
}

// Прикрепляем обработчик к форме аватара
if (avatarForm) {
  avatarForm.addEventListener('submit', handleAvatarFormSubmit);
} else {
  console.error('Avatar form not found');
}

// Попапы и кнопки
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__avatar-edit-button');
const closeButtons = document.querySelectorAll('.popup__close');

// Открытие попапа редактирования профиля
editButton?.addEventListener('click', () => {
  if (!nameInput || !jobInput || !editForm) {
    console.error('Edit form elements not found');
    return;
  }
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editForm, validationConfig);
  openModal(editPopup);
});

// Открытие попапа добавления карточки
addButton?.addEventListener('click', () => {
  if (!newCardForm) {
    console.error('New card form not found');
    return;
  }
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openModal(newCardPopup);
});

// Открытие попапа обновления аватара
avatarEditButton?.addEventListener('click', () => {
  if (!avatarForm) {
    console.error('Avatar form not found');
    return;
  }
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

// Закрытие попапов по крестику
closeButtons.forEach((button) => {
  const popup = button.closest('.popup');
  if (popup) {
    button.addEventListener('click', () => closeModal(popup));
  }
});

// Закрытие попапов по оверлею
document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});