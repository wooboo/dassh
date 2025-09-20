export const config = {
  appName: "DASSH",
  version: "0.1.0",
  environment: process.env.NODE_ENV || "development",
  database: {
    url: process.env.DATABASE_URL || "",
  },
  auth: {
    kinde: {
      domain: process.env.KINDE_DOMAIN || "",
      clientId: process.env.KINDE_CLIENT_ID || "",
      clientSecret: process.env.KINDE_CLIENT_SECRET || "",
      redirectUri: process.env.KINDE_REDIRECT_URI || "",
      logoutUri: process.env.KINDE_LOGOUT_URI || "",
    },
  },
  websocket: {
    port: parseInt(process.env.WS_PORT || "8080"),
  },
} as const;

export type Config = typeof config;