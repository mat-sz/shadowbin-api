import Hashids from 'hashids';

if (!process.env.HASHIDS_SALT) {
  throw new Error('Hashids salt is not specified.');
}

export const hashids = new Hashids(process.env.HASHIDS_SALT);
