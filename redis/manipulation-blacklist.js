import cache from "./blacklist.js";
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

function generatorTokenHash(token) {
    return createHash('sha256').update(token).digest("hex");
}

async function addTokenInBlacklist(token) {
    const tokenHash = generatorTokenHash(token);
    const timeToExpireToken = jwt.decode(token).exp;
    await cache.set(tokenHash, '');
    await cache.expireAt(tokenHash, timeToExpireToken);
}

async function verifyIfTokenExistsInBlacklist(token) {
    const tokenHash = generatorTokenHash(token);
    const result = await cache.exists(tokenHash); //return 1 or 0
    if (!result) {
        return false;
    } else {
        return true;
    }
}

const blacklistManipulation = {
    addTokenInBlacklist,
    verifyIfTokenExistsInBlacklist
}

export default blacklistManipulation;