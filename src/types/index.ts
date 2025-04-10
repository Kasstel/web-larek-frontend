// 2. Интерфейс API-клиента
export interface IApiClient {
	getProducts(): Promise<IProduct[]>; // Получение списка товаров
	getProduct(id: string): Promise<IProduct>; //Получение товара
  placeOrder<T>(orderData: any): Promise<T>; // Оформление заказа
}

// 3. Интерфейсы модели данных (объекты из API)
export interface IProduct {
	id: string;
	title: string;
	description?: string;
	price: number|null;
	image?: string
	category: string
}

export interface IOrder {
	items: IProduct[];
	payment: 'cash' | 'online' | null;
	address: string;
	email: string;
	phone: string;
	total: string
}

export interface OrderResponse {
	orderId: string
	total: number
}

// 4. Интерфейсы отображений (View Models)
export interface ProductView {
	id: string;
	title: string;
	price: string;
	category: string;
	image: string
}

export interface CartItemView {
	title: string;
	price: string;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface OrderStepOne {
  paymentMethod: "card" | "cash" | null;
  address: string;
}

export interface OrderStepTwo {
  email: string;
	phone: string;
}

export interface ICartView {
	productList: ProductView[];
	totalAmount: string;
}

export interface IAppState {
	catalog: IProduct[];
	cart: string[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
}


//5. Базовые классы
export interface IModal {
	open(content: any): void;
	close(): void;
}


//7. Классы событий
export enum AppEvent {
	PRODUCT_ADDED = 'PRODUCT_ADDED',
	PRODUCT_REMOVED = 'PRODUCT_REMOVED',
	PRODUCT_CHANGED = 'PRODUCT_CHANGED',
	CART_UPDATED = 'CART_UPDATED',
	ORDER_SUBMITTED = 'ORDER_SUBMITTED',
	MODAL_OPENED = 'MODAL_OPENED',
	MODAL_CLOSED = 'MODAL_CLOSED',
	
}

export interface ProductAddedEvent {
	eventName: AppEvent.PRODUCT_ADDED;
	data: IProduct;
}


export interface ProductChangedEvent {
	eventName: AppEvent.PRODUCT_CHANGED;
	data: IProduct;
}

export interface ProductRemovedEvent {
	eventName: AppEvent.PRODUCT_REMOVED;
	data: { productId: string };
}

export interface CartUpdatedEvent {
	eventName: AppEvent.CART_UPDATED;
	data: IProduct[];
}

export interface OrderSubmittedEvent {
	eventName: AppEvent.ORDER_SUBMITTED;
	data: IOrder;
}

export interface ModalOpenedEvent {
	eventName: AppEvent.MODAL_OPENED;
	data: any;
}

export interface ModalClosedEvent {
	eventName: AppEvent.MODAL_CLOSED;
	data?: any;
}
