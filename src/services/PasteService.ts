import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Paste } from '../entities/Paste';

const pasteExpiry = parseInt(process.env.PASTE_EXPIRY) || 30;

@Service()
export class PasteService {
  @OrmRepository(Paste)
  private pasteRepository: Repository<Paste>;

  async byId(id: number) {
    return await this.pasteRepository.findOne(id);
  }

  async add(data: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + pasteExpiry);

    const paste = new Paste();
    paste.data = data;
    paste.expiresAt = expiresAt;
    await this.pasteRepository.save(paste);
  }

  async remove(paste: Paste) {
    await this.pasteRepository.remove(paste);
  }
}
