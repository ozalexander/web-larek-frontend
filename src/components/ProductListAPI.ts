import { IProductList, IProduct } from '../types/index';
import { Api, ApiListResponse } from './base/api';

export class ProductListAPI extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }

  getProductList(): Promise<IProduct<string>[]> {
    return this.get('/product')
      .then((data: ApiListResponse<IProduct<string>>) => 
        data['items'].map((item) => ({
          ...item,
          image: this.cdn + item.image
      })))
  }
}

