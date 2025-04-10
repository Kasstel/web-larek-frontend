import { IModal, IProduct } from "../types";
import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";


interface ICardActions {
  onClick: (event: MouseEvent) => void;
}


export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(container);

      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
      this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
      this._button = container.querySelector(`.button`);
      this._description = container.querySelector(`.${blockName}__text`);

      if (actions?.onClick) {
          if (this._button) {
              this._button.addEventListener('click', actions.onClick);
          } else {
              container.addEventListener('click', actions.onClick);
          }
      }
  }

}

