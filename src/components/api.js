// Конфигурация API
const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-39',
  headers: {
    authorization: '3d17c145-6b85-4545-ba4d-64970048e50b',
    'Content-Type': 'application/json'
  }
};

// Функция для обработки ответа сервера
function handleResponse(res) {
  if (res.ok) {
    return res.json(); // Если ответ успешный, возвращаем данные в формате JSON
  }
  return Promise.reject(`Ошибка: ${res.status}`); // Если ошибка, отклоняем промис
}

// Функция для получения данных пользователя
function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
    .then(handleResponse); // Обрабатываем ответ
}

// Функция для получения карточек
function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
    .then(handleResponse); // Обрабатываем ответ
}

// Функция для обновления данных пользователя
function updateUserInfo(name, about) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  })
    .then(handleResponse); // Обрабатываем ответ
}

// Функция для добавления новой карточки
function addNewCard(name, link) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link
    })
  })
    .then(handleResponse); // Обрабатываем ответ
}

// Функция для удаления карточки
function deleteCardApi(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(handleResponse); // Обрабатываем ответ
}

// Функция для постановки лайка
function likeCardApi(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  })
    .then(handleResponse); // Обрабатываем ответ
}

// Функция для снятия лайка
function unlikeCardApi(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(handleResponse); // Обрабатываем ответ
}

// Функция для обновления аватара
function updateAvatarApi(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl
    })
  })
    .then(handleResponse); // Обрабатываем ответ
}

export { getUserInfo, getInitialCards, updateUserInfo, addNewCard, deleteCardApi, likeCardApi, unlikeCardApi, updateAvatarApi, config };