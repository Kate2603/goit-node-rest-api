### Як перевірити роботу API + РЕЗУЛЬТАТ

## Запускаємо сервер

npm start

або в режимі розробки (якщо додав nodemon):

npm run dev

![alt text](img/1.jpg)

## Відкрий інший термінал і зроби кілька запитів:

Отримати всі контакти
curl http://localhost:3000/api/contacts

![alt text](img/2.jpg)

Отримати контакт за id
curl http://localhost:3000/api/contacts/<id>

![alt text](img/3.jpg)

Створити новий контакт
curl -X POST http://localhost:3000/api/contacts \
-H "Content-Type: application/json" \
-d '{"name":"Alice","email":"alice@example.com","phone":"1234567"}'

![alt text](img/4.jpg)

Оновити контакт
curl -X PUT http://localhost:3000/api/contacts/<id> \
-H "Content-Type: application/json" \
-d '{"phone":"999-111"}'

![alt text](img/6.jpg)

Видалити контакт
curl -X DELETE http://localhost:3000/api/contacts/<id>

![alt text](img/5.jpg)

## Як імпортувати в Postman для перевірки запитів

Відкрий Postman.

У верхньому меню натисни Import.

Обери файл contacts-api.postman_collection.json.

Тепер у тебе з’явиться колекція Contacts REST API.

Для перевірки GET /:id, PUT /:id, DELETE /:id заміни значення змінної {{contactId}} на реальний id з бази.
