import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Paste } from '../entities/Paste';
import { hashids } from '../hashids';

const pasteExpiry = parseInt(process.env.PASTE_EXPIRY) || 30;

@Service()
export class PasteService {
  @OrmRepository(Paste)
  private pasteRepository: Repository<Paste>;

  async byId(id: number | string) {
    return await this.pasteRepository.findOne(
      typeof id === 'string' ? (hashids.decode(id)[0] as number) : id
    );
  }

  async add(data: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + pasteExpiry);

    const paste = new Paste();
    paste.data = data;
    paste.expiresAt = expiresAt;
    await this.pasteRepository.save(paste);

    if (!paste) {
      throw new Error('Creation failure.');
    }

    return { id: hashids.encode(paste.id) };
  }

  async remove(paste: Paste) {
    await this.pasteRepository.remove(paste);
  }
}
