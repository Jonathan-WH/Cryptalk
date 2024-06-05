import { environment } from "./src/environment/environment";

export const config = {
  production: false,
  coingeckoApiKey: environment.coingeckoApiKey,
  NEWS_API_KEY: environment.NEWS_API_KEY
};
