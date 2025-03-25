// 2. Интерфейс API-клиента
export interface IApiClient {
	get<T>(url: string): Promise<T>;
	post<T>(url: string, data: any): Promise<T>;
	put<T>(url: string, data: any): Promise<T>;
	delete<T>(url: string): Promise<T>;
}

// 3. Интерфейсы модели данных (объекты из API)
export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	imageUrl: string;
}

export interface Order {
	products: Product[];
	paymentMethod: string;
	deliveryAddress: string;
	email: string;
	phone: string;
}

// 4. Интерфейсы отображений (View Models)
export interface ProductViewModel {
	id: string;
	title: string;
	formattedPrice: string;
	image: string;
}

export interface OrderViewModel {
	orderId: string;
	productList: ProductViewModel[];
	totalAmount: string;
}

//5. Базовые классы
export interface IModal {
	open(content: any): void;
	close(): void;
}

export interface ICartService {
	addProduct(product: Product): void;
	removeProduct(productId: string): void;
	getProducts(): Product[];
	clearCart(): void;
}

export interface IOrderController {
	validateStepOne(paymentMethod: string, address: string): boolean;
	validateStepTwo(email: string, phone: string): boolean;
	submitOrder(orderData: Order): Promise<void>;
}

//7. Классы событий
export enum AppEvent {
	PRODUCT_ADDED = 'PRODUCT_ADDED',
	PRODUCT_REMOVED = 'PRODUCT_REMOVED',
	CART_UPDATED = 'CART_UPDATED',
	ORDER_SUBMITTED = 'ORDER_SUBMITTED',
	MODAL_OPENED = 'MODAL_OPENED',
	MODAL_CLOSED = 'MODAL_CLOSED',
}

export interface ProductAddedEvent {
	eventName: AppEvent.PRODUCT_ADDED;
	data: Product;
}

export interface ProductRemovedEvent {
	eventName: AppEvent.PRODUCT_REMOVED;
	data: { productId: string };
}

export interface CartUpdatedEvent {
	eventName: AppEvent.CART_UPDATED;
	data: Product[];
}

export interface OrderSubmittedEvent {
	eventName: AppEvent.ORDER_SUBMITTED;
	data: Order;
}

export interface ModalOpenedEvent {
	eventName: AppEvent.MODAL_OPENED;
	data: any;
}

export interface ModalClosedEvent {
	eventName: AppEvent.MODAL_CLOSED;
	data?: any;
}
