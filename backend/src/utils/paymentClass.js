import { StandardCheckoutClient, Env } from "pg-sdk-node";
import "dotenv/config";

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const clientVersion = process.env.clientVersion;
const env = Env.SANDBOX; //change to Env.PRODUCTION when you go live

export const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);
