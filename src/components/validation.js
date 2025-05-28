// Регулярное выражение для полей "Имя", "О себе", "Название"
const NAME_REGEX = /^[A-Za-zА-Яа-я\s-]+$/;

// Функция показа ошибки валидации
function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  if (errorElement) {
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
}

// Функция скрытия ошибки валидации
function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  if (errorElement) {
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
}

// Проверка, является ли URL действительным изображением
function isValidImageUrl(url) {
  return fetch(url, { method: 'HEAD' })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      return response.ok && contentType && contentType.startsWith('image/');
    })
    .catch(() => false);
}

// Проверка валидности поля ввода
function checkInputValidity(formElement, inputElement, config) {
  // Проверка полей "Имя", "О себе", "Название" через регулярное выражение
  if (inputElement.name === 'name' || inputElement.name === 'description') {
    if (!NAME_REGEX.test(inputElement.value)) {
      showInputError(formElement, inputElement, 'Только буквы, пробелы или дефисы', config);
      return;
    }
  }
  // Проверка встроенной валидации HTML
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
}

// Проверка, есть ли невалидные поля в форме
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    if (inputElement.name === 'name' || inputElement.name === 'description') {
      return !inputElement.validity.valid || !NAME_REGEX.test(inputElement.value);
    }
    return !inputElement.validity.valid;
  });
}

// Переключение состояния кнопки отправки формы
function toggleButtonState(inputList, buttonElement, config) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
}

// Установка обработчиков событий для полей формы
function setEventListeners(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  // Устанавливаем начальное состояние кнопки
  toggleButtonState(inputList, buttonElement, config);

  // Добавляем обработчики ввода
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
      // Проверка ссылки на изображение для аватара
      if (inputElement.type === 'url' && inputElement.name === 'avatar') {
        isValidImageUrl(inputElement.value).then((isImage) => {
          if (!isImage && inputElement.validity.valid) {
            showInputError(formElement, inputElement, 'Введите ссылку на изображение', config);
          }
        });
      }
    });
  });
}

// Включение валидации для всех форм на странице
function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
}

// Очистка ошибок валидации и сброс состояния кнопки
function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });
  toggleButtonState(inputList, buttonElement, config);
}

export { enableValidation, clearValidation };