import { CDP_CLIENT_KEY, CDP_POINT_OF_SALE, CDP_TARGET_URL, engage } from '../engage';
import { CDP_CHANNEL, CDP_CURRENCY, CDP_LANGUAGE } from '../helpers/constants';

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

export const sendIdentityEvent = async (inputEmail, inputPage) => {
  const eventData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    language: CDP_LANGUAGE,
    page: inputPage,
    email: inputEmail,
    identifiers: [
      {
        id: inputEmail,
        provider: 'email',
      },
    ],
  };

  // Send IDENTITY event to Sitecore CDP
  const response = await engage.identity(eventData);

  if (response) {
    console.log('Sitecore Engage SDK ::: Identity Event. bid: ', engage.getBrowserId());
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

export const handlePersonalization = async (experienceFriendlyId) => {
  const personalizationData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    friendlyId: experienceFriendlyId,
  };

  const response = await engage.personalize(personalizationData);
  console.log('Personalized Reponse : ', response);
};

export const handlePersonalizationManual = async (experienceFriendlyId) => {
  // Make a CORS request using the fetch API

  let output = null;

  const personalizationData = {
    clientKey: CDP_CLIENT_KEY,
    channel: CDP_CHANNEL,
    language: CDP_LANGUAGE,
    currencyCode: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    friendlyId: experienceFriendlyId,
    browserId: engage.getBrowserId(),
  };

  const url = `${CDP_TARGET_URL}/v2/callFlows`;

  await fetch(url, {
    method: 'POST',
    headers: {
      'Origin': 'http://localhost:3000',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(personalizationData),
  })
    .then((response) => {
      output = response.json();
    })
    .catch((error) => {
      // Handle the error
      console.log('Personalizeation error: ', error);
    });

  return output;
};

export const handleClickConfirmEvent = async (page, itemList) => {
  const productList = [];

  itemList.forEach((element) => {
    productList.push({ item_id: element });
  });

  const eventData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    language: CDP_LANGUAGE,
    page,
    product: productList,
  };

  const extensionData = {};

  const response = await engage.event('CONFIRM', eventData, extensionData);

  if (response) {
    console.log('Sitecore Engage SDK ::: Confirm Event. bid: ', engage.getBrowserId());
  }
};

export const handleClickCheckoutEvent = async (page, orderReference) => {
  const eventData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    language: CDP_LANGUAGE,
    page,
    reference_id: orderReference,
    status: 'PURCHASED',
  };

  const extensionData = {};

  const response = await engage.event('CHECKOUT', eventData, extensionData);

  if (response) {
    console.log('Sitecore Engage SDK ::: Checkout Event. bid: ', engage.getBrowserId());
  }
};

export default { sendPageViewEvent };
