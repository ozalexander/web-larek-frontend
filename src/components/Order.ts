import { Form } from "./common/Form";
import { IOrder, ICardActions } from "../types";
import { IEvents } from "./base/events";

export class Order<T> extends Form<IOrder<T>> {
    card = this.container.elements.namedItem('card') as HTMLSelectElement;
    cash = this.container.elements.namedItem('cash') as HTMLSelectElement;

    constructor(container: HTMLFormElement,events: IEvents) {
        super(container, events);
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
}