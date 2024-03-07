export interface EnvironmentTypes {
  environment: 'development' | 'staging' | 'production';

  // ============== shared env for all apps
  // google cloud storage
  gcs: {
    bucket: string;
    projectId: string;
    keyFilename: string;
  };

  // mailgun configurations
  mailgun?: {
    apiKey: string;
    domain: string;
    sender: string;
  };

  // twilio configurations
  twillio?: {
    sid: string;
    token: string;
  };

  // lightship configuration
  lightship?: number;

  // payment configuration
  paymentContactFirstName: string;
  paymentContactLastName: string;
  paymentContactPhoneCode: string;
  paymentContactPhoneNumber: string;
  paymentContactEmail: string;

  // # ipay configurations
  ipay: {
    code: string;
    key: string;
    mode: string;
    backendHandler: string;
    responseUrl: string;
  };

  // ============== apps/backend ENV
  appsBackend: AppsEnvironmentTypes;
}

export type AppsEnvironmentTypes = {
  port: number;

  // JWT
  jwt: {
    secret: string;
    // 1 month expiry
    tokenExpiration: number;
    // 6 month expiration
    refreshTokenExpiration: number;
  };
  // database connection
  database: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl?: string;
  };

  // timed otp / secured token expiration
  timeOTPExpiration: number;
  securedTokenExpiration: number;

  // graphql
  graphqlPlayground: boolean;
  graphqlSubscription: boolean;

  // redis
  redis: {
    max: number;
    host: string;
    port: number;
    auth_pass?: string;
  };

  // bull
  bull: {
    redis: string;
    defaultJobOptions: {
      backoff: number;
      attempts: number;
    };
  };
};
