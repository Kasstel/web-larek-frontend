import { IActions } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';

export class CardPreview extends Card {
	protected _addButton: HTMLButtonElement;
	protected _text: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);
		this._addButton = container.querySelector(
			`.card__button`
		) as HTMLButtonElement;
		this._text = ensureElement<HTMLElement>(`.card__text`);

		if (actions?.onClick) {
			if (this._addButton) {
				this._addButton.addEventListener('click', actions.onClick);
			}
		}
	}

	priceDisabled(value: number | null) {
		if (!value && this._addButton) {
			this.setDisabled(this._addButton, true);
		}
	}

	set description(value: string) {
		this.setText(this._text, value);
	}

	set added(value: boolean) {
		this.setDisabled(this._addButton, value);
	}
}
