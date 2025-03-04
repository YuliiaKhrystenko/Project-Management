# Проект "Управління проектами і завданнями" - README

Цей проект є односторінковим додатком (SPA) для управління проектами і завданнями всередині них. Він побудований за допомогою Vue.js 3, TypeScript, Pinia/Vuex, Axios та SCSS.

## Зміст

- [Опис проекту](#опис-проекту)
- [Технічні вимоги](#технічні-вимоги)
- [Інсталяція та запуск](#інсталяція-і-запуск)
- [Структура проекту](#структура-проекту)
- [API](#api)
- [Менеджер стану](#менеджер-стану)
- [Використовувані бібліотеки](#використовувані-бібліотеки)

---

## Опис проекту

Проект надає функціональність для управління проектами та завданнями через інтерфейс SPA. Користувач може додавати нові проекти, редагувати їх, а також додавати та управляти завданнями всередині проектів. Для зручності додаток підтримує сортування та фільтрацію таблиць, drag-and-drop для зміни порядку завдань та зміни їх статусу.

### Основні функціональні можливості:

- **Таблиця проектів:**
  - Сортування за колонками (ID, Назва, Кількість завдань, Статус, Дата створення).
  - Фільтрація за назвою та статусом.
  - Зміна ширини колонок.
  - Кнопка "Додати проект" для створення нового проекту.
- **Сторінка проекту:**

  - Відображення списку завдань з можливістю drag-and-drop для зміни порядку та зміни статусу завдань (To Do, In Progress, Done).
  - Сортування за терміном виконання і статусом.
  - Фільтрація за ім'ям виконавця та статусом.
  - Кнопка "Додати завдання" для створення нових завдань.

- **Типізація:** Сувора типізація всіх даних (проекти і завдання).

- **Збереження стану:** Використання LocalStorage для збереження стану між перезавантаженнями сторінки.

---

## Технічні вимоги

- **Фреймворк:** Vue.js 3 (Composition API).
- **Менеджер стану:** Pinia.
- **Мова:** TypeScript.
- **HTTP-запити:** Axios для взаємодії з сервером.
- **Стилізація:** CSS/SCSS.
- **Drag-and-Drop:** VueDraggable.
- **Таблиці:** Можливість сортування, фільтрації та зміни ширини колонок.
- **Збереження стану:** Використання LocalStorage для збереження стану між перезавантаженнями.

---

## Інсталяція та запуск

1. **Клонування репозиторію:**

   ```bash
   git clone https://github.com/your-username/project-management-app.git
   cd project-management-app
   ```

2. **Встановлення залежностей:**

   Для того, щоб інсталювати всі необхідні залежності, використовуйте команду:

   ```bash
   npm install
   ```

3. **Запуск додатку:**

   Для запуску додатку на локальному сервері використовуйте команду:

   ```bash
   npm run json-server
   ```

   ```bash
   npm run dev
   ```

4. **Відкриття в браузері:**

   Перейдіть за адресою `http://localhost:5173` для доступу до додатку.

---

## Структура проекту

### Опис директорій та файлів:

- **/assets**: Тут зберігаються файли стилів.
- **/components**: Містить окремі компоненти для відображення різних частин інтерфейсу.

- **/store**: Тут зберігаються файли для менеджменту стану через Pinia. Включає модулі для управління проектами та завданнями.

- **/views**: Містить компоненти, що відповідають за конкретні сторінки додатку.

- **/router**: Включає конфігурацію маршрутизації для визначення шляхів додатку та зв'язку їх з відповідними компонентами.

- **/services**: Логіка для виконання HTTP запитів через Axios.

- **/types**: Визначення типів та інтерфейсів для TypeScript, які забезпечують строго типізований код. Включає типи для проектів, завдань.

## API

API для роботи з проектами та завданнями побудовано за допомогою [JSON Server](https://github.com/typicode/json-server) або аналогічного інструменту. Ось основні ендпоінти:

- **/projects:**

  - `GET /projects` - отримати список всіх проектів.
  - `POST /projects` - створити новий проект.
  - `PUT /projects/:id` - оновити проект за ID.
  - `DELETE /projects/:id` - видалити проект за ID.

- **/tasks:**
  - `GET /tasks` - отримати список всіх завдань.
  - `POST /tasks` - створити нове завдання.
  - `PUT /tasks/:id` - оновити завдання за ID.
  - `DELETE /tasks/:id` - видалити завдання за ID.

---

## Менеджер стану

Менеджмент стану реалізований через **Pinia** для зберігання проектів і завдань. Дані синхронізуються з **LocalStorage**, що дозволяє зберігати стан між перезавантаженнями.

### Основні модулі:

- **projects:** Для зберігання проектів.
- **tasks:** Для зберігання завдань.

Екшени для CRUD-операцій дозволяють взаємодіяти з API та синхронізувати дані з локальним сховищем.

---

## Використовувані бібліотеки

- **Vue 3** - фреймворк для побудови односторінкових додатків (SPA). Використовує Composition API для організації логіки компонентів.

- **TypeScript** - мова програмування, що забезпечує строгий контроль типів, покращує якість коду та забезпечує більш безпечне і зручне розроблення.

- **Pinia** - бібліотеки для менеджменту стану у додатках Vue.js. Pinia є більш новим рішенням, яке пропонує простішу API та кращу інтеграцію з Vue 3.

- **Axios** - бібліотека для виконання HTTP запитів. Використовується для взаємодії з бекендом або моковим API.

- **VueDraggable** - компонент для реалізації drag-and-drop функціоналу у Vue.js. Дозволяє переміщати елементи в межах списків або таблиць.

- **JSON Server** - інструмент для створення фейкового API. Використовується для мокового бекенду під час розробки.

---

## Останні оновлення

- 🛠 **Виправлено баг:** TaskCount тепер правильно зберігає значення.
- 🔍 **Рефакторинг:** Декомпозиція `TaskDetailsView`.
- 🏠 **Рефакторинг:** Декомпозиція `HomeView`.
- 🎨 **Оновлено стилі**.
- 📌 **Збереження фільтрів і сортувань**.
- 🔔 **Додано Toast-сповіщення** при додаванні/видаленні проектів.
- 🖱 **Додано підказки при наведенні** на заголовки таблиці проектів.
- ❌ **Додано кнопку видалення проектів**.
- 🔙 **Кнопка "Назад"** на сторінці деталей проекту.

---

## Примітки

**❗ Для успішного видалення проекту потрібно перезапустити сервер після його додавання до бази даних:**

```bash
npm run json-server
```
