import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const ratelimit = new Ratelimit({
    redis : Redis.fromEnv(),   
    limiter : Ratelimit.slidingWindow(10, "5 s") // rate limit of 10 requests for every 5 seconds
});

export default ratelimit;