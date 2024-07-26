import './scss/styles.scss';
import { ProductListAPI } from './components/ProductListAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { CardCatalog } from './components/Card';
import { ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent, Product } from './components/AppData';
import { Page } from './components/Page';
import { Error } from './types';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { IProduct } from './types';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';

const events = new EventEmitter();
const api = new ProductListAPI(CDN_URL, API_URL)

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const appData = new AppState({}, events)

const page = new Page(document.body, events)
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)

const basket = new Basket(cloneTemplate(basketTemplate), events)

events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
      const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit('card:select', item)
      })
      return card.render({
          title: item.title,
          image: item.image,
          category: item.category,
          price: item.price,
      });
  });
  page.counter = appData.loadBasketCounter();
});

events.on('card:select', (item: IProduct<string>) => {
  const showItem = (item: IProduct<string>) => {
      const card = new CardCatalog(cloneTemplate(cardPreviewTemplate));
      card.button.addEventListener('click', () => {
          events.emit('basket:add', [item.id, item.title, item.price]);
      })
      modal.render({
          content: card.render({
              title: item.title,
              image: item.image,
              description: item.description,
              price: item.price,
              category: item.category,
              })
          })
      }
  showItem(item);
});

events.on('basket:add', (item: string[]) => {
  const card = new CardCatalog(cloneTemplate(cardBasketTemplate));
  // basket.items([card.render({
  //   title: item[1],
  //   price: item[2],
  // })]);
})

events.on('basket:open', (item: IProduct<string>) => {
  modal.render({
    content: basket.render({})
  })
})

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

api.getProductList()
    .then(appData.loadCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });
