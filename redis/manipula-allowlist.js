import {promisify} from "util"
import allowlist from "./allowlist.js";


export async function adicionaChave (chave, valor, dataExpiracao) {
    await allowlist.set(chave, valor)
    await allowlist.expireAt(chave, dataExpiracao)
}

export async function buscarChave(chave) {
    const valorBuscado = await allowlist.get(chave)
    return valorBuscado
}

export async function contemChave(chave) {
    const result = await allowlist.exists(tokenHash);
    if (!result) {
        return false;
    } else {
        return true;
    }
}

export async function deletarChave(chave) {
    await allowlist.del(chave)
}