import { auth } from '../../environments/environment';

const {
  domain,
  clientId,
  authorizationParams: { audience },
  appUri,
  apiUri,
  errorPath,
} = auth as {
  domain: string;
  clientId: string;
  authorizationParams: {
    audience?: string;
  };
  appUri: string;
  apiUri: string;
  errorPath: string;
};

export const authConfig = {
  production: false,
  auth: {
    domain,
    clientId,
    authorizationParams: {
      ...(audience && audience !== 'YOUR_API_IDENTIFIER' ? { audience } : null),
      redirect_uri: auth.appUri,
    },
    errorPath,
  },
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
};
