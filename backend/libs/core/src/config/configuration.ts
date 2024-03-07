export const configuration = () => ({
  // For this env value =  https://stackoverflow.com/a/59805161/4332049
  environment: process.env['NODE' + '_ENV'] ?? 'production',

  // ====================== MICROSERVICE TRANSPORT
  transport: {
    port: process.env.TRANSPORT_REDIS_PORT,
    host: process.env.TRANSPORT_REDIS_HOST,
    db: process.env.TRANSPORT_REDIS_DATABASE || undefined,
    password: process.env.TRANSPORT_REDIS_PASSWORD || undefined,
    retryAttempts: parseInt(process.env.TRANSPORT_REDIS_RETRY_ATTEMPT) || 20,
    retryDelay: parseInt(process.env.TRANSPORT_REDIS_RETRY_DELAY) || 3000
  },

  // ====================== BULL
  bull: {
    redis: {
      port: process.env.REDIS_BULL_PORT || 6379,
      host: process.env.REDIS_BULL_HOST || 'localhost',
      db: process.env.REDIS_BULL_DATABASE || undefined,
      password: process.env.REDIS_BULL_PASSWORD || undefined
    },
    defaultJobOptions: {
      backoff: process.env.REDIS_BULL_BACK_OFF || 5000,
      attempts: process.env.REDIS_BULL_ATTEMPTS || 5
    }
  },

  // ====================== ENV
  service: {
    port: parseInt(process.env.IDENTITY_SERVICE_PORT || '3334', 10),
    // JWT
    jwt: {
      secret: process.env.JWT_SECRET_KEY,
      tokenExpiration: process.env.JWT_EXPIRATION_TIME,
      refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
    },
    timeTokenExpiration: parseInt(process.env.OTP_EXPIRATION_TIME || '15', 10),
    securedTokenExpiration: parseInt(
      process.env.TOKEN_EXPIRATION_TIME || '60',
      10
    ),
    graphql: {
      context: ({ req, res }) => ({ req, res }),
      playground: 'true',
      autoSchemaFile: 'schema.gql'
    },
    sendgrid: {
      apiKey: process.env.SEND_GRID_KEY,
      sender: process.env.SEND_GRID_SENDER
    },

    // DATABASE
    database: {
      type: process.env.DB_CONNECTION,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      logging: process.env.DB_DEBUG === 'true'
      // ssl: process.env.IDENTITY_SERVICE_DB_SSL_CERT,
    },

    // GRAPHQL
    graphqlPlayground: process.env.GRAPHQL_PLAYGROUND === 'true',
    graphqlSubscription: process.env.GRAPHQL_SUBSCRIPTIONS === 'true',

    // REDIS
    redis: {
      max: process.env.MAX_ITEM_IN_CACHE,
      host: process.env.REDIS_CACHE_HOST,
      port: process.env.REDIS_CACHE_PORT,
      auth_pass: process.env.REDIS_CACHE_PASSWORD
    }
  }
});
