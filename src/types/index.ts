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

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: string[];
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

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}