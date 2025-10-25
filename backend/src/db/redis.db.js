import {Redis} from "ioredis"

import "dotenv/config"
export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
})

