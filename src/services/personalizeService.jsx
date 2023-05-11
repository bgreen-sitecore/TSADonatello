import { engage } from '../engage';
import { CDP_CHANNEL, CDP_CURRENCY, CDP_LANGUAGE, CDP_POINT_OF_SALE } from '../helpers/constants';

export const sendPageViewEvent = async (pageType, pageContext) => {
  const eventData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
  };

  const extensionData = pageContext.page;
  extensionData.discoverUUID = pageContext.user.uuid;

  const response = await engage.pageView(eventData, extensionData);

  if (response) {
    console.log('Sitecore Engage SDK ::: pageView. bid: ', engage.getBrowserId());
  }
};

export const clickAddEvent = async (product, inputQuantity) => {
  const eventData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    language: CDP_LANGUAGE,
    page: product.url,
    product: {
      name: product.name,
      type: product.category_names[0],
      item_id: product.sku,
      productId: product.prod_id,
      referenceId: product.sku,
      orderedAt: new Date().toISOString(),
      quantity: inputQuantity,
      price: product.final_price,
      currency: CDP_CURRENCY,
    },
  };

  const extensionData = {
    brand: product.brand,
    categoies: product.category_names,
    colors: product.colors,
    gender: product.gender,
    sale_flag: product.sale_flag,
    size: product.size,
  };

  await engage.event('ADD', eventData, extensionData);
};

export default { sendPageViewEvent };
