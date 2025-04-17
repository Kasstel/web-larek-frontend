import './scss/styles.scss';
import { Modal } from './components/base/Modal';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { ApiClient } from './components/common/ApiClient';
import { AppState } from './components/model/AppData';
import {
	IOrderPost,
	IOrderStepOne,
	IOrderStepTwo,
	IProduct,
	PaymentMethod,
} from './types';
import { Card } from './components/view/CardView/Card';
import { CardOrderItem } from './components/view/CardView/CardOrderItem';
import { CardPreview } from './components/view/CardView/CardPreview';
import { Basket } from './components/view/Basket';
import { OrderStepOne } from './components/view/OrderView/OrderStepOne';
import { OrderStepTwo } from './components/view/OrderView/OrderStepTwo';
import { Page } from './components/view/Page';
import { Success } from './components/view/OrderView/Success';

const events = new EventEmitter();
const api = new ApiClient(CDN_URL, API_URL);
//все темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//обьекты классов
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const delivery = new OrderStepOne(cloneTemplate(deliveryTemplate), events);
const contact = new OrderStepTwo(cloneTemplate(contactsTemplate), events);
const page = new Page(ensureElement<HTMLElement>('.page__wrapper'), {
	onClick: () => events.emit('basket:open'),
});
const appData = new AppState({}, events);

//получение каталога товаров

api
	.getProducts()
	.then((data) => {
		appData.setCatalog(data);
	})
	.catch((err) => console.log(err));

//реализация событийного подхода
events.on('items:changed', () => {
	const arrayHTML = appData.getCatalog().map((item) =>
		new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:selected', item),
		}).render(item)
	);
	page.render({
		catalog: arrayHTML,
		counter: appData.getTotal(),
	});
});

events.on('card:selected', (item: IProduct) => {
	appData.setPreview(item);
});

events.on('product:add', (item: IProduct) => {
	appData.addToBasket(item);
});

events.on('preview:changed', () => {
	const previewData = appData.getPreview();
	const isAdded = appData.isInBasket(previewData.id);
	const previewCard = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('product:add', previewData),
	});

	previewCard.added = isAdded;
	previewCard.priceDisabled(previewData.price);

	modal.render({
		content: previewCard.render({
			title: previewData.title,
			price: previewData.price,
			description: previewData.description,
			image: previewData.image,
		}),
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

function renderBasket() {
	const basket = new Basket(cloneTemplate(basketTemplate), events);
	const basketItems = appData.getBasketItems().map((item, index: number) => {
		const card = new CardOrderItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('item:remove', item),
		});

		card.itemId = (index + 1).toString();
		return card.render(item);
	});

	const totalAmount = appData.getTotalAmount();

	appData.order.total = totalAmount;

	modal.render({
		content: basket.render({
			productList: basketItems,
			totalAmount: totalAmount.toString(),
		}),
	});
}

events.on('basket:open', () => {
	renderBasket();
});

events.on('item:remove', (item: IProduct) => {
	appData.removeFromBasket(item.id);
});

events.on('order:open', () => {
	appData.setPaymentMethod('card');
	delivery.setTogglePayment('card');
	modal.render({
		content: delivery.render({
			paymentMethod: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик переключения способов оплаты в доставке
events.on('order.payment:change', (data: { target: PaymentMethod }) => {
	appData.setPaymentMethod(data.target);
});

// Обработчик изменения поля доставки
events.on('order.address:change', (data: { value: string }) => {
	appData.setOrderDeliveryField(data.value);
});

// Обработчик валидации полей доставки
events.on('deliveryFormError:change', (errors: Partial<IOrderStepOne>) => {
	const { paymentMethod, address } = errors;
	delivery.valid = !paymentMethod && !address;
	delivery.errors = Object.values({ paymentMethod, address })
		.filter((i) => !!i)
		.join('; ');
});

// Обработчик открытия модального окна контактов
events.on('order:submit', () => {
	modal.render({
		content: contact.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик изменения полей контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderStepTwo; value: string }) => {
		appData.setOrderContactField(data.field, data.value);
	}
);

// Обработчик валидации полей контактов
events.on('contactFormError:change', (errors: Partial<IOrderStepTwo>) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Обработчик оформления заказа
events.on('contacts:submit', () => {
	const orderToSend: IOrderPost = {
		...appData.order,
		items: appData.order.items.map((item) => item.id), // тут вытаскиваем только id
	};

	//реализация post запроса и отображение модального окна удачной покупки
	api
		.placeOrder(orderToSend)
		.then((result) => {
			appData.clearBasket(); // Очистка корзины
			appData.clearOrder(); // Очистка данных заказа
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});
