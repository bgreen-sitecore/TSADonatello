import { init } from '@sitecore/engage';
// eslint-disable-next-line import/no-mutable-exports
let engage;

export const CDP_CLIENT_KEY = process.env.REACT_APP_CDP_API_KEY;
export const CDP_POINT_OF_SALE = process.env.REACT_APP_CPD_POINT_OF_SALE;
export const CDP_COOKIE_DOMAIN = process.env.REACT_APP_CPD_COOKIE_DOMAIN;
export const CDP_TARGET_URL = process.env.REACT_APP_CDP_API_TARGET_ENDPOINT;

const loadEngage = async () => {
  console.log('loading engage : ', CDP_CLIENT_KEY, ' ', CDP_POINT_OF_SALE, ' ', CDP_COOKIE_DOMAIN, ' ', CDP_TARGET_URL);
  engage = await init({
    clientKey: CDP_CLIENT_KEY,
    targetURL: CDP_TARGET_URL,
    pointOfSale: CDP_POINT_OF_SALE,
    cookieDomain: CDP_COOKIE_DOMAIN,
    cookieExpiryDays: 365,
    forceServerCookieMode: false,
    includeUTMParameters: true,
    webPersonalization: true,
  });
};

loadEngage();
export { engage };
