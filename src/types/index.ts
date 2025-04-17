
// 2. Интерфейс API-клиента и общих классов (модалки и формы)
export interface IApiClient {
	getProducts(): Promise<IProduct[]>; // Получение списка товаров
	placeOrder(orderData: IOrderPost): Promise<OrderResponse>; // Оформление заказа
}

export interface IModalData {
	content: HTMLElement;
}

export type FormError = Partial<Record<keyof IOrder, string>>;

export interface IFormState {
	valid: boolean;
	errors: string[];
}

// 3. Интерфейсы модели данных (объекты из API)
export interface IAppState {
	catalog: IProduct[];
	preview: IProduct | null;
}

export interface IProduct {
	id: string;
	title: string;
	description?: string;
	price: number | null;
	image?: string;
	category: string;
}

export interface IOrder {
	items: IProduct[];
	payment: 'cash' | 'card';
	address: string;
	email: string;
	phone: string;
	total: number;
}

export interface OrderResponse {
	total: number;
}


export interface IOrderPost {
  email: string;
  phone: string;
  payment: 'cash' | 'card';
  total: number;
  address: string;
  items: string[];
}

// 4. Интерфейсы отображений (View Models) и типы

export type PaymentMethod = 'card' | 'cash';

export interface IOrderStepOne {
	paymentMethod: 'card' | 'cash';
	address: string;
}

export interface IOrderStepTwo {
	email: string;
	phone: string;
}

export interface IBasketView {
	productList: HTMLElement[];
	totalAmount: string;
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface IPage {
	catalog: HTMLElement[];
	counter: number;
}
