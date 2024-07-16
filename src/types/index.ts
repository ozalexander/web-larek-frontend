export interface IProduct<T> {
  id: T;
  description: T;
  image: T;
  title: T;
  category: T;
  price: number | null;
}

export interface ItemList extends IProduct<string> {
  loadCatalog(list: IProduct<string>[]): HTMLElement;
  loadBasketState(count: number): number;
}

export interface IBasket<T> {
  items: Map<string, number>;
  orderDetails: {
    paymentMethod: T;
    address: T;
    email: T;
    phone: T;
  };
  add(id:T): void;
  remove(id:T): void;
}
export type Delivery = {
  payment: HTMLSelectElement;
  address: string;
}

export type PersonalData = {
  email: string;
  phone: string;
}

export interface IEventEmitter {
  emit: (event: string, data: unknown) => void;
}

export interface ISuccessfulOrder {
  id: string;
  total: number;
}

export type Error = string;