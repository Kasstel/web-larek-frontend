import { IBasketView } from '../../types/index';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;

	protected _total: HTMLElement;

	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this._button.addEventListener('click', () => {
			this.events.emit('order:open');
		});

		this.productList = [];
	}

	set productList(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set totalAmount(total: number) {
		this.setText(this._total, total + ` синапсов`);
	}

	render(data: Partial<IBasketView>): HTMLElement {
		Object.assign(this as object, data);
		return this.container;
	}
}
