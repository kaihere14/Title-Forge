import { Redis } from "ioredis";
import "dotenv/config";
interface RedisConfig {
  host: string | undefined;
  port: number | undefined;
  password: string | undefined;
}
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
} as RedisConfig);
