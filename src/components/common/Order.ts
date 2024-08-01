import { Form } from "../common/Form";
import { IOrder, ISuccessActions } from "../../types";
import { IEvents } from "../base/events";

export class Order<T> extends Form<IOrder<T>> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;
    protected _activeButton = 'button_alt-active';

    constructor(container: HTMLFormElement, events: IEvents, actions?: ISuccessActions) {
        super(container, events);

        this._card = this.container.elements.namedItem('card') as HTMLButtonElement;
        this._cash = this.container.elements.namedItem('cash') as HTMLButtonElement;

        if (actions?.onClick) {
            this.container.addEventListener('submit', actions.onClick);
        }
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    buttonListener(event: Function){
        this._card.addEventListener('click', () => {
            this.button('card');
            event('card');
        })
        this._cash.addEventListener('click', () => {
            this.button('cash');
            event('cash');
        })
    }

    button(value: string): void {
        if (value === 'card') {
            this._card.classList.add(this._activeButton);
            this._cash.classList.remove(this._activeButton);
        } else if (value === 'cash') {
            this._card.classList.remove(this._activeButton);
            this._cash.classList.add(this._activeButton);
        } else {
            this._card.classList.remove(this._activeButton);
            this._cash.classList.remove(this._activeButton);
        }
    }
}