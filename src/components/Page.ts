import { Component } from "./base/Components";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { IPage } from "../types";

export class Page extends Component<IPage> {
 
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _counter: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._wrapper = container.querySelector('.page__wrapper');
        this._catalog = container.querySelector(`.gallery`);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}