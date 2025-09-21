# Інструкція для перевірки ДЗ: REST API(4), PostgresSQL та Sequelize(6), Аутентифікація та авторизація(7), Робота з файлами та тестування додатків(9), Websockets(11)

## Як запустити проєкт

npm install

### Як перевірити роботу API + РЕЗУЛЬТАТ

## Запускаємо сервер

npm start

або в режимі розробки (якщо додав nodemon):

npm run dev

### Якщо сервер працює коректно, тоді запускємо тести

npm test

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

# Оновлення підписки (Update Subscription)

PATCH http://localhost:3000/api/auth/subscription
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

![alt text](img/12.jpg)

### Тестування Auth + Avatar API через Postman

1. Реєстрація користувача
   POST `http://localhost:3000/api/auth/register`  
   Content-Type: application/json

   ![alt text](img/13.jpg)

2. Логін користувача
   POST http://localhost:3000/api/auth/login
   Content-Type: application/json

   ![alt text](img/14.jpg)

3. Отримання поточного користувача
   GET http://localhost:3000/api/auth/current

   ![alt text](img/15.jpg)

4. Оновлення аватарки
   PATCH http://localhost:3000/api/auth/avatars

   ![alt text](img/16.jpg)

### Email verification + REST API

Зміна БД, додалося 2 колонки

![alt text](img/24.jpg)

### Email verification flow

![alt text](img/23.jpg)

1. POST /api/auth/register — створення користувача, генерується verificationToken, надсилається лист з посиланням.

POST http://localhost:3000/api/auth/register
Content-Type: application/json

![alt text](img/19.jpg)

2. GET /api/auth/verify/:verificationToken — верифікація email

GET http://localhost:3000/api/auth/verify/{{verificationToken}}

![alt text](img/20.jpg)

3. POST /api/auth/verify — повторна відправка листа з токеном
   POST http://localhost:3000/api/auth/verify
   Content-Type: application/json
   Якщо вже верифіковано → 400 Bad Request { "message": "Verification has already been passed" }

   ![alt text](img/21.jpg)

4. POST /api/auth/login — логін тільки після верифікації

POST http://localhost:3000/api/auth/login
Content-Type: application/json

![alt text](img/22.jpg)

# Тести (**tests**/auth.test.js) проходять

Написані unit-тести (Jest) для контролера логіна.

Усі тести проходять успішно

![alt text](img/17.jpg)

![alt text](img/18.jpg)
