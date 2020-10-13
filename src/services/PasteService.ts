import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Paste } from '../entities/Paste';

@Service()
export class PasteService {
  @OrmRepository(Paste)
  private pasteRepository: Repository<Paste>;
}
