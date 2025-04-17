import {
	IProduct,
	IOrder,
	IOrderStepTwo,
	IAppState,
	FormError,
	PaymentMethod,
} from '../../types';
import { Model } from '../base/Model';

export class AppState extends Model<IAppState> {
	protected catalog: IProduct[] = [];
	protected preview: IProduct | null;
	order: IOrder = {
		email: '',
		phone: '',
		payment: 'card',
		total: 0,
		address: '',
		items: [],
	};
	formErrors: FormError = {};

	removeFromBasket(id: string) {
		this.order.items = this.order.items.filter((item) => item.id !== id);
		this.emitChanges('basket:open');
		this.emitChanges('items:changed');
	}

	setPaymentMethod(method: string) {
		this.order.payment = method as PaymentMethod;
		this.validateDelivery();
	}

	setOrderDeliveryField(value: string) {
		this.order.address = value;
		this.validateDelivery();
	}

	validateDelivery(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('deliveryFormError:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContact(): boolean {
		const errors: typeof this.formErrors = {};

		// Регулярные выражения
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex =
			/^(\+7|8)?[\s-]?(\(?\d{3}\)?)[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

		// Проверка email
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!emailRegex.test(this.order.email)) {
			errors.email = 'Некорректный email';
		}

		// Проверка телефона
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!phoneRegex.test(this.order.phone)) {
			errors.phone = 'Некорректный формат телефона';
		}

		this.formErrors = errors;
		this.events.emit('contactFormError:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	setOrderContactField(field: keyof IOrderStepTwo, value: string) {
		this.order[field] = value;
		this.validateContact();
	}

	getTotal() {
		return this.order.items.length;
	}

	getCatalog(): IProduct[] {
		return this.catalog;
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed');
	}

	setPreview(item: IProduct) {
		this.preview = item;
		this.emitChanges('preview:changed', item);
	}

	getPreview(): IProduct {
		return this.preview;
	}

	addToBasket(orderItem: IProduct) {
		if (!this.isInBasket(orderItem.id)) {
			this.order.items.push(orderItem);
		}
		this.emitChanges('preview:changed');
		this.emitChanges('items:changed');
	}

	isInBasket(id: string) {
		return this.order.items.some((item) => item.id === id);
	}

	getBasketItems() {
		return this.order.items;
	}

	getTotalAmount() {
		return this.order.items.reduce((sum, item) => sum + item.price, 0);
	}

	clearBasket() {
		this.order.items = [];
		this.emitChanges('items:changed');
		this.emitChanges('preview:changed');
	}

	clearOrder() {
		this.order = {
			payment: 'card',
			items: [],
			total: 0,
			email: '',
			phone: '',
			address: '',
		};
	}
}
