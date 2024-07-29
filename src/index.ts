import './scss/styles.scss';
import { ProductListAPI } from './components/ProductListAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { CardCatalog } from './components/Card';
import { ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent} from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { IProduct, IOrder, IMakeOrder, ISuccessfulOrder } from './types';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new ProductListAPI(CDN_URL, API_URL)

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
const order = new Order(cloneTemplate(orderTemplate), events)
const orderContacts = new Order(cloneTemplate(contactsTemplate), events)

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
          events.emit('basket:add', item);
          modal.close();
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

events.on('basket:add', (item: IProduct<string>) => {
  appData.loadBasketState(item);
  const listArray = Array.from(appData.basket.values()).map(product => {
    const card = new CardCatalog(cloneTemplate(cardBasketTemplate));
    card.button.addEventListener('click', () => {
        events.emit('basket:remove', product);
        newCard.remove();
    })
    const newCard = card.render({
      title: product.title,
      price: product.price,
  });
  return newCard;
  })
  basket.items = listArray
})

events.on('basket:changed', () => {
  basket.total = appData.getTotal();
  page.counter = appData.loadBasketCounter();
  basket.selected = appData.basket;
  if (appData.getTotal()===0) {
    basket.items = []
  }
})

events.on('basket:remove', (item: IProduct<string>) => {
  appData.basket.delete(item.id);
  events.emit('basket:changed');
})

events.on('basket:open', (item: IProduct<string>) => {
  modal.render({
    content: basket.render()
  })
  basket.selected = appData.basket;
  basket.total = appData.getTotal();
})

events.on('order:open', () => {
  const valid = () => events.emit(`order.button:change`, {
    field : 'paymentMethod',
    value : 'active'
  })

  order.card.addEventListener('click', () => {
    order.cash.classList.remove('button_alt-active');
    order.card.classList.toggle('button_alt-active');
    appData.payment = 'card';
    valid();
  })
  order.cash.addEventListener('click', () => {
    order.card.classList.remove('button_alt-active');
    order.cash.classList.toggle('button_alt-active');
    appData.payment = 'cash';
    valid();
  })
  modal.render({
    content: order.render({
      payment: '',
      address: '',
      valid: false,
      errors: [],
    })
  })
  
})

events.on('order:submit', () => {
  document.body.classList.remove('button_alt-active');
  modal.render({
    content: orderContacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: [],
  })
})
})

events.on(/^order\..*|^contacts\..*:change/, (data: { field: keyof IOrder<string>, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

events.on('contacts:submit', () => {
  const postOrder: IMakeOrder = {
    ...appData.order,
    total: appData.total,
    items: appData.items(),
  }
  console.log(postOrder);
  api.makeOrder(postOrder)
  .then((res: ISuccessfulOrder) => {
    const orderSuccess = new Success(cloneTemplate(successTemplate), {
      onClick: () => {
        modal.close();
        appData.clearBasket();
        events.emit('basket:changed');
      }
    })
    modal.render({
      content: orderSuccess.render()
    })
    orderSuccess.total = res.total;
  })
  .catch(err => console.error(err))
})

events.on('formErrors:change', (errors: Partial<IOrder<string>>) => {
  if (order) {
    const { payment, address } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
  } 
  if (orderContacts) {
    const { email, phone } = errors;
    orderContacts.valid = !email && !phone;
    orderContacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
  }
});

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
