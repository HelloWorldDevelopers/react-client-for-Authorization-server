import CryptoJS from 'crypto-js';

export const encrypt = (value, keys) => {
    let key = CryptoJS.enc.Utf8.parse(keys);
    let iv = CryptoJS.enc.Utf8.parse(keys);
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value?.toString()), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
 
    return encrypted?.toString();
}
 
//The get method is use for decrypt the value.
export const decryptData = (value, keys) => {
    let key = CryptoJS.enc.Utf8.parse(keys);
    let iv = CryptoJS.enc.Utf8.parse(keys);
    let decrypted = CryptoJS.AES.decrypt(value || {}, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
 
    return decrypted?.toString(CryptoJS.enc.Utf8);
}
let SecretKey = 'ThisIsASecretKey';
export const decryptResponseToken = (encryptedToken) => {
    try {
        const key = CryptoJS.enc.Utf8.parse(SecretKey);
        if (Array.isArray(encryptedToken)) {
            return encryptedToken.map(token => {
                const bytes = CryptoJS.AES.decrypt(token, key, {
                    keySize: 128 / 8,
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return bytes.toString(CryptoJS.enc.Utf8);
            });
        }
        const bytes = CryptoJS.AES.decrypt(encryptedToken, key, {
            keySize: 128 / 8,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    } catch (error) {
        console.error('Error decrypting token:', error);
        return null;
    }
};
 