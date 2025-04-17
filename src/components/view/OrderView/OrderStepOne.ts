import { IOrderStepOne } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/events';
import { Form } from '../../base/Form';

export class OrderStepOne extends Form<IOrderStepOne> {
	protected _paymentMethod: HTMLButtonElement[];
	protected _address: HTMLInputElement;
	protected _paymentContainer: HTMLDivElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Находим элементы формы в контейнере
		this._paymentContainer = ensureElement<HTMLDivElement>(
			'.order__buttons',
			this.container
		);
		this._paymentMethod = Array.from(
			this._paymentContainer.querySelectorAll('.button_alt')
		);
		this._address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		// Добавляем обработчик событий на контейнер кнопок оплаты
		this._paymentContainer.addEventListener('click', (e: MouseEvent) => {
			const target = e.target as HTMLButtonElement;
			this.setTogglePayment(target.name);
			events.emit(`order.payment:change`, { target: target.name });
		});
	}

	setTogglePayment(className: string) {
		this._paymentMethod.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === className);
		});
	}

	set address(value: string) {
		this._address.value = value;
	}
}
