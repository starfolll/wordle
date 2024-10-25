import cryptoUtf8 from 'crypto-js/enc-utf8'
import rabbit from 'crypto-js/rabbit'

export function encryptWord(word: string, secret: string) {
  return rabbit.encrypt(word, secret).toString()
}

export function decryptWord(word: string, secret: string) {
  return rabbit.decrypt(word, secret).toString(cryptoUtf8)
}
