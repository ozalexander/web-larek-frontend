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
  loadBasketState(item: IProduct<string>): void;
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
  payment: T;
  address: T;
  email: T;
  phone: T;
}

export interface IMakeOrder extends IOrder<string> {
  total: number;
  items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder<string>, string>>;

export interface ISuccessfulOrder {
  id: string;
  total: number;
}

export interface IModal {
  content: HTMLElement;
}