import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
  Param,
  NotFoundError,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { PasteService } from '../services/PasteService';

@JsonController('/v1/paste')
export class PasteController {
  @Inject()
  private pasteService: PasteService;

  @Get('/')
  async index() {}

  @Post('/')
  async create() {}
}
