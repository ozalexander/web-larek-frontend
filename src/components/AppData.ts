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

  basket: string[];

  order: IOrder<string>;

  error: Error;

  loadCatalog(items: IProduct<string>[]): void {
    this.catalog = items.map(item => new Product(item));;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }
  loadBasketState(): void {
    this.basket
  }

  loadPreview(item: IProduct<string>): void {
    this.emitChanges('preview:changed', item);
  }

  loadBasketCounter(): number {
    return this.basket.length
  }
}