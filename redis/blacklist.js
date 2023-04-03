import redis from 'redis';

const redisCheck = redis.createClient({ prefix: "blacklist:" });
await redisCheck.connect();

export default redisCheck;