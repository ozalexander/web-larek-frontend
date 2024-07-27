import { IProductList, IProduct, IBasket, Delivery, PersonalData, IOrder, Error } from '../types/index';
import { Model } from './base/Model';

export type CatalogChangeEvent = {
  catalog: Product[]
};

export class Product implements IProduct<string> {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: number | null;

  constructor(data: IProduct<string>) {
    this.id = data.id;
    this.description = data.description;
    this.image = data.image;
    this.title = data.title;
    this.category = data.category;
    this.price = data.price;
  }
}

export class AppState extends Model<AppState> implements IProductList {

  catalog: IProduct<string>[];

  basket: Map<string, Product> = new Map();

  order: Partial<IOrder<string>> = {
    paymentMethod: '',
    address: '',
    phone: '',
    email: '',
  };

  formErrors: Partial<IOrder<string>>;

  total: number;

  loadCatalog(items: IProduct<string>[]): void {
    this.catalog = items.map(item => new Product(item));;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }
  loadBasketState(item: Product): void {
    this.basket.set(item.id, item);
    this.emitChanges('basket:changed', this.basket);
  }
  loadPreview(item: IProduct<string>): void {
    this.emitChanges('preview:changed', item);
  }

  getTotal(): number {
    this.total = 0;
    this.basket.forEach(item => {
      this.total += item.price;
    })
    return this.total
  }

  loadBasketCounter(): number {
    return this.basket ? this.basket.size : 0
  }

  clearBasket() {
    this.basket.clear();
  };

  setOrderField(field: keyof IOrder<string>, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
        this.events.emit('order:ready', this.order);
    }
}

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
}
}