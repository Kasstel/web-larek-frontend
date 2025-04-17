import { IOrderStepTwo } from '../../../types';
import { IEvents } from '../../base/events';
import { Form } from '../../base/Form';

export class OrderStepTwo extends Form<IOrderStepTwo> {
	protected _phone: HTMLInputElement;
	protected _email: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phone = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		this._email = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}
}
