const CryptoJS = require('crypto-js');
const secretKey = process.env.REACT_APP_SECRET_KEY;

export const encryptString = (text: string) => {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return ciphertext;
};

export const decryptString = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  return originalText;
};
