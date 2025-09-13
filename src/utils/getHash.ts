import crypto from "crypto"

export const getHash = (string: string, phone: string): string => {
    return crypto.createHash("SHA512").update(JSON.stringify({
        string,
        salt: phone
    })).digest("hex")
}
