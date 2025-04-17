import { IActions } from '../../../types';
import { Card } from './Card';

export class CardOrderItem extends Card {
	protected _removeBtn: HTMLButtonElement;
	protected _basketId: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);
		this._removeBtn = container.querySelector(
			`.basket__item-delete`
		) as HTMLButtonElement;
		this._basketId = container.querySelector(
			`.basket__item-index`
		) as HTMLElement;

		if (actions?.onClick) {
			this._removeBtn.addEventListener('click', actions.onClick);
		}
	}

	set itemId(id: string) {
		this.setText(this._basketId, id);
	}

	get itemId(): string {
		return this._basketId.textContent || '';
	}
}
