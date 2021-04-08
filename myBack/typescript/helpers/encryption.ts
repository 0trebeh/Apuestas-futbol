import rsa from 'node-rsa';
import {logger} from '../helpers';

export default class Encryption {
  private key: rsa;
  constructor() {
    const private_key = process.env.PRIVATE_KEY;
    if (!private_key) {
      logger.logger.error('Key undefined');
      this.key = new rsa();
    } else {
      this.key = new rsa(private_key, 'pkcs1');
    }
  }

  public encrypt(data: string): string {
    return this.key.encryptPrivate(data, 'base64');
  }

  public decrypt(data: string): string {
    return this.key.decrypt(data, 'base64');
  }
}
