import { init } from '@sitecore/engage';
// eslint-disable-next-line import/no-mutable-exports
let engage;

export const CDP_CLIENT_KEY = 'pqsSIOPAxhMC9zJLJSZNFURPNqALIFwd';

const loadEngage = async () => {
  engage = await init({
    clientKey: CDP_CLIENT_KEY,
    targetURL: 'https://api-engage-eu.sitecorecloud.io',
    pointOfSale: 'donatello-delta',
    cookieDomain: '.donatello-beta.vercel.app',
    cookieExpiryDays: 365,
    forceServerCookieMode: false,
    includeUTMParameters: true,
    webPersonalization: true,
  });
};

loadEngage();
export { engage };
