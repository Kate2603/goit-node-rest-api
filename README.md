# Інструкція для перевірки ДЗ: REST API (Тема 7)

## Як запустити проєкт

npm install

### Як перевірити роботу API + РЕЗУЛЬТАТ

## Запускаємо сервер

npm start

або в режимі розробки (якщо додав nodemon):

npm run dev

Структура проекту

![alt text](img/1.jpg)

### Ендпоінти для перевірки

## Відкрий інший термінал і зроби кілька запитів

# Перевірка API через Postman (зручніше для перевірки)

Відкрий Postman

Імпортуй колекцію contacts_api.postman_collection.json

Там є готові запити:

GET /api/contacts

![alt text](img/2.jpg)

GET /api/contacts/:id

![alt text](img/3.jpg)

POST /api/contacts

![alt text](img/4.jpg)

PUT /api/contacts/:id

![alt text](img/5.jpg)

PATCH /api/contacts/:id/favorite

![alt text](img/6.jpg)

DELETE /api/contacts/:id

![alt text](img/7.jpg)

Запускай по черзі і дивись у відповідь (Response).

## Postman-запити для Auth API

# Реєстрація (Register)

POST http://localhost:3000/api/auth/register
Content-Type: application/json

![alt text](img/8.jpg)

# Логін (Login)

POST http://localhost:3000/api/auth/login
Content-Type: application/json

![alt text](img/9.jpg)

# Поточний користувач (Current User)

GET http://localhost:3000/api/auth/current
Authorization: Bearer JWT_TOKEN

![alt text](img/10.jpg)

# Логаут (Logout)

POST http://localhost:3000/api/auth/logout
Authorization: Bearer JWT_TOKEN

![alt text](img/11.jpg)

# Додатково: Оновлення підписки (Update Subscription)

PATCH http://localhost:3000/api/auth/subscription
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

![alt text](img/12.jpg)
