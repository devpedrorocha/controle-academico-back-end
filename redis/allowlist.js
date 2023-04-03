import redis from 'redis';

const redisCheck = redis.createClient({ prefix: "allow-list:" });
await redisCheck.connect();

export default redisCheck;