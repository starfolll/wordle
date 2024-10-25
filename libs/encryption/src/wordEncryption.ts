import rabbit from 'crypto-js/rabbit'

export function encryptWord(word: string, secret: string) {
  return rabbit.encrypt(word, secret)
}

export function decryptWord(word: string, secret: string) {
  return rabbit.decrypt(word, secret)
}
