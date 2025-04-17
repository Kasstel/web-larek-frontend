import { IActions, OrderResponse } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";


export class Success extends Component<OrderResponse> {
  protected _close: HTMLElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, actions: IActions) {
    super(container);

    // Находим элементы сообщения в контейнере
    this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

    // Обработчик события клика на кнопку закрытия
    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }


  set total(total: string) {
    this.setText(this._total, `Списано ${total} синапсов`);
  }
}