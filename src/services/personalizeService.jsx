import { Buffer } from 'buffer';
import { CDP_CLIENT_KEY, CDP_PASSWORD, CDP_POINT_OF_SALE, CDP_TARGET_URL, engage } from '../engage';
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

export const handleShownRecommendationsEvent = async (personalization) => {
  const eventData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    language: CDP_LANGUAGE,
    page: 'homepage',
  };

  const extensionData = personalization;

  const response = await engage.event('SHOWN_RECOMMENDATIONS', eventData, extensionData);

  if (response) {
    console.log('Sitecore Engage SDK ::: Shown Recommendations Event. bid: ', engage.getBrowserId());
  }
};

export const sendIdentityEvent = async (inputEmail, inputPage, firstName, lastName) => {
  const eventData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    language: CDP_LANGUAGE,
    page: inputPage,
    email: inputEmail,
    firstName,
    lastName,
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
    onSale: product.sale_flag === '1',
    size: product.size,
    productImage: product.image_url,
  };

  const response = await engage.event('ADD', eventData, extensionData);

  if (response) {
    console.log('Sitecore Engage SDK ::: Add Event. bid: ', engage.getBrowserId());
  }
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
  return response;
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

export const sendCheckoutEvent = async (page, orderReference, cartItems) => {
  console.log('cartItems : ', cartItems);

  const orderItems = [];
  let orderTotal = 0;
  let includesSale = false;
  let freeShippingOrder = false;

  cartItems.forEach((item) => {
    const itemType = item.data.category_names[0].replace(' ', '_').toUpperCase();
    orderTotal += parseInt(item.data.final_price, 10);

    if (!includesSale) includesSale = item.data.sale_flag === '1';
    if (!freeShippingOrder) freeShippingOrder = item.data.free_shipping === '1';

    orderItems.push({
      type: itemType,
      referenceId: item.data.sku,
      orderedAt: new Date().toISOString(),
      status: 'PURCHASED',
      currencyCode: CDP_CURRENCY,
      price: item.data.final_price,
      name: item.data.name,
      productId: item.data.prod_id,
      quantity: item.quantity,
      extensions: [
        {
          name: 'ext',
          key: 'default',
          brand: item.data.brand,
          color: item.data.colors[0],
          gender: item.data.gender,
          size: item.data.size,
          stock: item.stock_quantity,
          onSale: item.data.sale_flag === '1',
          freeShipping: item.data.free_shipping === '1',
        },
      ],
    });
  });

  const eventData = {
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    language: CDP_LANGUAGE,
    page,
    order: {
      referenceId: orderReference,
      orderedAt: new Date().toISOString(),
      status: 'PURCHASED',
      currencyCode: CDP_CURRENCY,
      price: orderTotal,
      paymentType: 'Card',
      cardType: 'Visa',
      extensions: [
        {
          name: 'ext',
          key: 'default',
          includesSale,
          freeShippingOrder,
        },
      ],
      orderItems,
    },
  };

  const response = await engage.event('ORDER_CHECKOUT', eventData);

  if (response) {
    console.log('Sitecore Engage SDK ::: Order Checkout Event. bid: ', engage.getBrowserId());
  }
};

export const handleClickProductEvent = async (sku, rfkid) => {
  const eventData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    language: CDP_LANGUAGE,
    page: 'homepage',
  };

  const extensionData = {
    sku,
    rfkid,
  };

  const response = await engage.event('PRODUCT_CLICK', eventData, extensionData);

  if (response) {
    console.log('Sitecore Engage SDK ::: Product Click Event. bid: ', engage.getBrowserId());
  }
};

// for debugging/demo purposes only, not production
export const closeSessionEvent = async () => {
  const eventData = {
    channel: CDP_CHANNEL,
    currency: CDP_CURRENCY,
    pointOfSale: CDP_POINT_OF_SALE,
    language: CDP_LANGUAGE,
    page: 'homepage',
  };

  const extensionData = {};

  const response = await engage.event('FORCE_CLOSE', eventData, extensionData);

  if (response) {
    console.log('Sitecore Engage SDK :::Force Close Event. bid: ', engage.getBrowserId());
  }
};

function setAffinityType(inputValues) {
  const values = inputValues.sort((a, b) => b.score - a.score);

  const affinityList = {};
  let maxScore = 0;
  let maxValue = '';

  for (let v = 0; v < Math.min(values.length, 5); v += 1) {
    const score = Number(values[v].score).toFixed(3);
    const { val } = values[v];
    affinityList[val] = score;

    if (score > maxScore) {
      maxScore = score;
      maxValue = val;
    }
  }
  return [JSON.stringify(affinityList), maxScore, maxValue];
}

export const updateAffinities = async (data, GuestRef) => {
  if (data) {
    const affinities = Object.entries(data);
    console.log(`Updating CDP profile for ${GuestRef}`);

    const jsonObj = {};
    jsonObj.key = 'default';

    if (affinities.length > 0) {
      for (let i = 0; i < affinities.length; i += 1) {
        const affinity = affinities[i];
        const values = affinity[1].affinityValues;

        switch (affinity[1].name) {
          case 'brand': {
            [jsonObj.brandAffinities, jsonObj.brandTopAffinityScore, jsonObj.brandTopAffinity] =
              setAffinityType(values);

            break;
          }
          case 'category_names': {
            [jsonObj.categoryAffinities, jsonObj.categoryTopAffinityScore, jsonObj.categoryTopAffinity] =
              setAffinityType(values);

            break;
          }
          case 'color': {
            [jsonObj.colorAffinities, jsonObj.colorTopAffinityScore, jsonObj.colorTopAffinity] =
              setAffinityType(values);

            break;
          }
          case 'genders': {
            [jsonObj.genderAffinities, jsonObj.genderTopAffinityScore, jsonObj.genderTopAffinity] =
              setAffinityType(values);

            break;
          }
          case 'size': {
            [jsonObj.sizeAffinities, jsonObj.sizeTopAffinityScore, jsonObj.sizeTopAffinity] = setAffinityType(values);

            break;
          }
          case 'activities_list': {
            [jsonObj.activitiesAffinities, jsonObj.activitiesTopAffinityScore, jsonObj.activitiesTopAffinity] =
              setAffinityType(values);

            break;
          }
          default: {
            break;
          }
        }
      }

      const myHeaders = new Headers();
      const base64Credentials = Buffer.from(`${CDP_CLIENT_KEY}:${CDP_PASSWORD}`).toString('base64');

      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Basic ${base64Credentials}`);
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(jsonObj),
        redirect: 'follow',
      };

      const url = `${CDP_TARGET_URL}/v2/guests/${GuestRef}/extext`;

      fetch(url, requestOptions);
    }
  }
};

export default { sendPageViewEvent };
