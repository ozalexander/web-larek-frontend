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

export interface IBasket {
  items: Map<string, number>;
  add(id:string): void;
  remove(id:string): void;
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