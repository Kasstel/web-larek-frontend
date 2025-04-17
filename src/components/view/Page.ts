import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IActions, IPage } from '../../types';

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _basket: HTMLButtonElement;
	protected _counter: HTMLElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IActions) {
		super(container);
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._basket = document.querySelector(
			'.header__basket'
		) as HTMLButtonElement;
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

		if (events?.onClick) {
			if (this._basket) {
				this._basket.addEventListener('click', events.onClick);
			} else {
				container.addEventListener('click', events.onClick);
			}
		}
	}
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set counter(addedItems: number) {
		this.setText(this._counter, addedItems);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
