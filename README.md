# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Проектная работа "Веб-ларёк" является примером интернет-магазина для веб-разработчиков, который позволяет просматривать каталог товаров, добавлять товары в корзину и делать заказы.

## Описание интерфейса

Интерфейс можно условно разделить на 3 процесса:
1. Просмотр каталога
2. Выбор товара
3. Оформление заказа

## Архитектура проекта (MVC)

### Model

#### Класс Api

Осуществляет GET и POST запросы к API. Принимает базовый адрес и опционально - настройки.

* Метод get возвращает список товаров в формате JSON.
* Метод post отправляет заказ и получает ответ в формате JSON.

#### Класс ProductListAPI

Является дочерним классом Api. Дополнительно принимает адрес CDN для загрузки статических данных .

* getProductList принимает список товаров, дополняя адреса загрузки изображений адресом CDN.
* makeOrder отправляет данные о заказе и получает ответ в формате JSON.

#### Класс Model

Абстрактный класс с дженерик типом. Получает объект и инстанс интерфейса IEvents, присваивает свойства получаемого объекта. Метод emitChanges подписывает на событие и передает данные.

#### Класс Components

Абстрактный класс с дженериком типом. Предоставляет методы модификации DOM-элементов.

#### Класс Product

Принимает информацию о товаре и записывает в соответствующие поля: id, description, image, title, category, price.

#### Класс AppState

Основной класс хранения данных приложения. Имеет поля: 
* catalog - содержит весь каталог карточек;
* basket - коллекция из содержимого корзины;
* order - содержит данные для оформления заказа, полученные от пользователя;
* formErrors - объект с ошибками ввода;
* total - общая стоимость заказа в корзине;

Данный класс отвечает за изменения основных данных приложения с помощью методов:

* loadCatalog - записывает инстансы класса Product в поле catalog;
* items - предоставляет список id товаров в корзине;
* loadBasketState - сохраняет id товаров в виде ключей объекта и сами товары в значения ключей;
* loadPreview - подписывает на событие изменения превью и передает данные;
* getTotal - записывает в поле total общую стоимость заказа;
* loadBasketCounter - возвращает количество элементов в корзине для счетчика количества товаров в корзине на главном экране;
* clearBasket - очищает полe basket;
* setOrderField - записывает данные от пользователя в поле order и запускает валидацию;
* validateOrder - проверяет заполненность полей заказа, записывает данные об ошибке для показа пользователю под формой и возвращает статус валидации;

### View

#### Класс CardCatalog

Содержит поля всех необходимых для карточки товара DOM-элементов. Поле с объектом _categoryColor предоставляет список цветов тегов категорий и соответствующих им селекторов. Подключает слушатель на элемент кнопки добавления в корзину. Поля с DOM-элементами модифицируются сеттерами с помощью наследуемых от класса Components методов.

#### Класс Page

Основной класса представления. Содержит поля каталога товаров, упаковки страницы, счетчика количества товаров в корзине и значка корзины. Также в конструкторе вашается слушатель на значок корзины вызывающий событие открытия модального окна корзины.

* cеттер Catalog перезаписывает верстку получаемым списком товаров;
* counter - меняет значение счетчика количества товаров корзины;
* locked - блокирует прокрутку страницы при открытом модальном окне добавлением специального класса упаковке _wrapper;

#### Класс Modal

Отвечает за показ модального окна. Подключается слушатели для закрытия окна по нажатия на соответствующую кнопку или вне окна и запрещает 'всплытие' события от модального окна. Имеет методы закрытия и открытия.

#### Класс Basket

Окно корзины. Имеет поля элементов списка, счетчика суммы и кнопки. Слушатель кнопки открывает следующее состояние модального окна - оформление заказа.
Сеттеры:

* items - получает список элементов корзины и подменяет верстку. В случае отсутствия элементов меняет текст на "Корзина пуста";
* selected - в случае пустого списка блокирует кнопку методом setDisabled от наследуемого класса Components;
* total - меняет значение счетчика суммы заказа;

#### Класс Order

Окно оформления заказа. Имеет поле с кнопками выбора типа оплаты и с сохраненным классом активной кнопки. Принимает контейнер заказа и находит нужные кнопки. Соответствующие сеттеры сбрасывают значения полей.

* метод buttonListener получает колбэк для слушателей кнопок, которые переключают класс активной кнопки и активируют событие нажатия конкретной кнопки для последующей записи;

* метод button используется для переключения активной кнопки и её сброса после оформления заказа.

#### Класс Success

Отвечает за показ окна успешного оформления заказа. Имеет поля с кнопкой завершения и счетчиком суммы. Метод total меняет строку с информацией о списании в корректном виде.

### Controller

#### Класс EventEmitter

Основной класс, отвечающий за подписку на события и их активацию в приложении. Имеет одно поле - _events. Это коллекция в которую записываются названия и ссылки на функции, которые будут вызываться при событиях. Методы:

* on - добавляет колбэк к событию, добавляет событие в коллекцию, если оно отсутствует;
* off - удаляет колбэк события, удаляет событие из коллекции, если список подписчиков пуст;
* emit - вызывает событие из коллекции;
* onAll - регистрирует колбэк для всех подписчиков;
* offAll - удаляет все события и колбэки из коллекции;
* trigger - возвращает функцию, которая вызывает событие и принимает колбэк с контекстом и переданными данными;


### Соединение модели и представления

Соединение происходит через файл index.ts. Взаимодействие слоев осуществляется через брокер событий. Сначала создаются экземпляры классов с необходимыми данными. Список всех прописанных событий:

* 'items:changed' - происходит при изменении каталога и осуществляет его изначальную загрузку;
* 'card:select' - происходит при выборе карточки в каталоге и открывает превью товара;
* 'basket:add' - добавляет товар в корзину, создавая мини-карточки товаров в корзине;
* 'basket:remove' - удаляет товар из корзины;
* 'basket:changed' - обновляет состояние корзины;
* 'basket:open' - открывает модальное окно корзины;
* 'order:open' - отображает модальное окно оформления заказа;
* 'order:submit' - меняет состояние модального окна оформления заказа на форму с контактами;
* /^order\..*|^contacts\..*:change/ - осуществляет запись данных получаемых от пользователя из обеих форм и запускает валидацию строк;
* 'formErrors:change' - производит валидацию и отображает ошибки под формами;
* 'contacts:submit' - отправляет все необходимые данные о заказе на сервер и, в случае успеха, отображает окно завершения оформления заказа, очищает корзину и показывает сообщение о потраченной сумме.
* 'modal:open' - открывает модальное окно;
* 'modal:close' - закрывает модальное окно;



![Image alt](https://github.com/ozalexander/web-larek-frontend/blob/main/src/images/Web-ларёк.jpg)