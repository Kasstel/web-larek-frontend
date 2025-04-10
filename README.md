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

## 1. Краткое описание проекта

"WEB Larek" - это веб-приложение для управления интернет-ларьком, предоставляющее пользователям возможность просмотра товаров, оформления заказов и управления корзиной. Проект реализован с использованием объектно-ориентированного подхода на TypeScript.

## 2. Используемый архитектурный паттерн

Приложение построено на основе MVP (Model-View-Presenter) и использует Event-Driven архитектуру для управления событиями. Данные представлены в виде моделей (Model), интерфейс реализован через слой представления (View), а управление взаимодействием осуществляется через Presenter.

## 3. Базовые классы и их предназначение

Базовые классы включают классы, которые можно переиспользовать в любом проекте без изменений. Они обеспечивают фундаментальную функциональность для остальных частей приложения.

### 3.1. Класс EventEmitter

Описание:
Этот класс реализует брокер событий и позволяет подписываться на события, инициировать их и управлять подписками.

Методы:

on<T extends object>(event: EventName, callback: (data: T) => void): void; — подписка на событие.

emit<T extends object>(event: string, data?: T): void; — вызов обработчиков при возникновении события.

trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void; - создаёт функцию-триггер, которая при вызове будет генерировать событие event и объединять данные data с context

off(event: EventName, callback: Function): отписка от события

onAll(callback: Function): подписка на все события

offAll(): удаление всех обработчиков

### 3.2. Абстрактный класс Component<T>

Описание:
Родительский класс для всех классов слоя VIEW. Предоставляет базовые методы работы с DOM.

Свойства:

protected readonly container: HTMLElement - корневой DOM-элемент

Конструктор:

protected constructor(protected readonly container: HTMLElement)

Методы:

toggleClass(element: HTMLElement, className: string, force?: boolean): переключить класс

protected setText(element: HTMLElement, value: unknown): установить текстовое содержимое

setDisabled(element: HTMLElement, state: boolean): сменить статус блокировки

protected setHidden(element: HTMLElement): скрыть элемент

protected setVisible(element: HTMLElement): показать элемент

protected setImage(element: HTMLImageElement, src: string, alt?: string): установить изображение

render(data?: Partial<T>): HTMLElement: вернуть корневой DOM-элемент

 ### 3.3. Абстрактный класс Model<T>

Описание:
Родительский класс для всех моделей данных. Обеспечивает управление состоянием и валидацию данных.

Свойства:

protected events: IEvents - объект для работы с событиями

Конструктор:

constructor(data: Partial<T>, protected events: IEvents): инициализирует модель на основе переданных данных

Методы:

emitChanges(event: string, payload?: object): отправляет событие об изменении модели

## 4. MODEL

Модели данных, наследуемые от Model<T>:

### 4.1 AppState - класс отследующий состояния приложения
  clearCart() -очистка корзины после оформления заказа

  getTotal() - расчитываем итоговую цену

  setCatalog(items: IProduct[]) - для обновления состояния каталога

  setPreview(item: IProduct) - для обновления состояния информации о товаре

  setCart(item: CartItemView[]) - обновления состояния корзины

  setOrderField(field: keyof IOrderForm, value: string) - для обновления поля заказа

  validateOrder() - для валидации заказа

## 5. View

Классы слоя представления, наследуемые от Component<T>:

### 5.1 CardViewModel extends Component<ProductView> - отображение данных товара 

Свойства:
protected _id: HTMLElement;
protected _title: HTMLElement;
protected _price: HTMLElement;
protected _image: HTMLImageElement;
protected _category: HTMLElement;
protected _button: HTMLButtonElement

Конструктор: 
constructor(protected blockName: string, container: HTMLElement, events?: EventEmitter){
    super(container)
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}`);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`,container);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`,container);
        - инициализируем название, фото товара, кнопку для открытия превью и  категорию
}

Методы:
set id(value: string):void	- Устанавливает id товара в соответствующий HTML-элемент.

get id():string	- Получает id товара из HTML-элемента.

set title(value: string):	void	 - Устанавливает заголовок товара.

get title():string	- Возвращает название товара.

set price(value: string):void	 - Устанавливает цену товара в HTML-элемент.

get price():string	- Возвращает цену товара.

set image(value: string):void	- Устанавливает URL изображения товара.

get category():string

События:
events.emit(AppEvent.PRODUCT_CHANGED)
events.emit(AppEvent.PRODUCT_ADDED)
events.emit(AppEvent.PRODUCT_REMOVED)

### 5.2  класс Form<T> - это View, специализированный компонент для ввода и отправки данных, не знающий о модели и логике приложения.

Он взаимодействует с остальной системой через события, используя IEvents, что полностью соответствует MVP-подходу.

Model по-прежнему не знает ничего о Form<T> — она только обновляется в ответ на события.

Presenter подписывается на эти события и связывает Form<T> с Model

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}

### 5.3 класс OrderStepOne

export class OrderStepOne extends Form<OrderStepOne> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    container.querySelectorAll('[name=paymentMethod]').forEach((el) => {
      el.addEventListener("click", (e) => {
        const target = e.target as HTMLInputElement;
        this.onInputChange("paymentMethod", target.value as "card" | "cash");
      });
    });
  }
  set paymentMethod(method: 'cash' | 'online'| null) 
  set address(value: string) - сеттер для адреса
}




 ### 5.4  export class OrderStepTwo extends Form<OrderStepTwo> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

  }
  set paymentMethod(method: 'cash' | 'online'| null) 
  set address(value: string) - сеттер для адреса
}

    

 ### 5.5 CartView extends Component<ICartView>- представление корзины

Описание:
Компонент корзины, который управляет списком товаров, отображением итоговой суммы и обработкой событий.

Свойства:

protected _list: HTMLElement - контейнер для товаров

protected _total: HTMLElement - отображение итоговой суммы

protected _button: HTMLElement - кнопка оформления заказа

Конструктор:

constructor(container: HTMLElement, protected events: EventEmitter){
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
инициализируем лист , тотал и кнопку оформления заказа
}

Методы:

set items(items: HTMLElement[]): обновление списка товаров

set total(total: number): обновление итоговой суммы

Генерируемые события:

events.emit(AppEvent.ORDER_SUBMITTED) - отправка заказа

events.emit(AppEvent.CART_UPDATED) - обновление корзины

### 5.6 CardPreview extends CardViewModel- представление подробностей о товаре

protected _text: HTMLElement;
protected _button: HTMLButtonElement


 constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);
          this._button = ensureElement<HTMLButtonElement>(`.button`, container);
          this._text = ensureElement<HTMLElement>(`.${blockName}__text`, container);
          ...                инициализирую описание и кнопку "Добавить в корзину" в конструкторе

 }
set id(value: string):void	- Устанавливает id товара в соответствующий HTML-элемент.

get id():string	- Получает id товара из HTML-элемента.

## 6 Класс Modal
Назначение:
Управление модальными окнами на всех страницах приложения.

Функции:

open(content: Component): void — открытие модального окна с заданным контентом.

close(): void — закрытие окна (реагирует как на клик вне окна, так и на нажатие на иконку закрытия).

Обработка событий закрытия окна.

## 7 ApiClient

export interface IApiClient {
	getProducts(): Promise<IProduct[]>; // Получение списка товаров
	getProduct(id: string): Promise<IProduct>; //Получение товара
  placeOrder<T>(orderData: any): Promise<T>; // Оформление заказа
}

## 8 Список событий
Компоненты обмениваются сообщениями через EventEmitter, например, при добавлении товара в корзину, изменении состояния заказа или закрытии модальных окон.

export enum AppEvent {
	PRODUCT_ADDED = 'PRODUCT_ADDED',
	PRODUCT_REMOVED = 'PRODUCT_REMOVED',
	PRODUCT_CHANGED = 'PRODUCT_CHANGED',
	CART_UPDATED = 'CART_UPDATED',
	ORDER_SUBMITTED = 'ORDER_SUBMITTED',
	MODAL_OPENED = 'MODAL_OPENED',
	MODAL_CLOSED = 'MODAL_CLOSED',
	PREVIEW = 'CARD_PREVIEW'
}

## Presenter не вынесен в отдельный класс (логика будет реализована в index.ts)

## 9. Пример взаимодействия 
Пользотатель нажимает на кнопку товара чтобы посмотреть подробности  (Preview товара)
1. View реагирует на действие пользователя и генерирует событие (при помощи emit)

2. Presenter обрабатывает событие и вызывает метод модели (или API) (в моем случае в index.ts будет прописана конструкция типа: events.on<(AppEvent.PREVIEW, callback>) )

3. Модель вызывает состояние setPreview и генерирует событие: App.Event.MODAL_OPENED

4. Presenter обрабатывает событие и вызывает рендер View (CardPreview)

