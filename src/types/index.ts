export interface IProduct<T> {
  id: T;
  description?: T;
  image: T;
  title: T;
  category: T;
  price: number | null;
}

export interface IProductList {
  catalog: IProduct<string>[];
  loadCatalog(data: IProduct<string>[]): void;
  loadBasketState(): void;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface IBasket<T> {
  items: Map<string, number>;
  add(id:T): void;
  remove(id:T): void;
}

export interface IOrder<T> {
  paymentMethod?: T;
  address?: T;
  email?: T;
  phone?: T;
}
export type Delivery = {
  payment: HTMLSelectElement;
  address: string;
}
export type PersonalData = {
  email: string;
  phone: string;
}

export interface ISuccessfulOrder {
  id: string;
  total: number;
}

export type Error = string;

export interface IModal {
  content: HTMLElement;
}