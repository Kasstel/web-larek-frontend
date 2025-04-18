import { IActions, IProduct } from '../../../types';
import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { settings } from "../../../utils/constants";


export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _price: HTMLElement;

	

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`) as HTMLImageElement;
		this._button = container.querySelector(
			`.gallery__item`
		) as HTMLButtonElement;
		this._category = container.querySelector(`.card__category`) as HTMLElement;
		this._price = ensureElement<HTMLElement>(`.card__price`, container);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: keyof typeof settings.categoryKey) {
		if (!this._category) return; // Защита от ошибки
		this.setText(this._category, value);
		const category = this._category.classList[0];
	this._category.className = '';
	this.toggleClass(this._category, category, true);
	this.toggleClass(this._category, `${category}${settings.categoryKey[value]}`, true);
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}

	set price(value: number) {
		this.setText(this._price, value + ` синапсов`);
	}

	render(data: Partial<IProduct>): HTMLElement {
		Object.assign(this as object, data);
		return this.container;
	}
}
