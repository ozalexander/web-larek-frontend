import { Component } from "./base/Components";
import { ICardActions } from "../types/index";
import { ensureElement, bem, createElement } from "../utils/utils";


export class CardCatalog<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  button?: HTMLElement;
  
  protected _categoryColor: { [key: string]: string } = {
    'софт-скил': '_soft',
    'хард-скил': '_hard',
    'другое': '_other',
    'дополнительное': '_additional',
    'кнопка': '_button',
  }

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = container.querySelector(`.card__title`);
    this._image = container.querySelector(`.card__image`);
    this._price = container.querySelector(`.card__price`);
    this._category = container.querySelector(`.card__category`);
    this._description = container.querySelector(`.card__text`);
    this.button = container.querySelector('.card__button');

    if (actions?.onClick) {
      if (this.container) {
          this.container.addEventListener('click', actions.onClick);
      }
  }
}
  set title(value: string) {
    this.setText(this._title, value);
  }
  get title(): string {
    return this._title.textContent || '';
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  set category(value: string) {
    this.setText(this._category, value);
    if (this._categoryColor[value]) {
      this._categoryColor[value]
    } else {
      this._categoryColor[value] = '_other';
    }
    this._category.className = `card__category card__category${this._categoryColor[value]}`
  }
  set price(value: string) {
    value === null 
    ? this.setText(this._price, 'Бесценно')
    : this.setText(this._price, value);
  }
  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

}
