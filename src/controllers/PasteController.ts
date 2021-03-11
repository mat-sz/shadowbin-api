import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
  Param,
  NotFoundError,
  Body,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { PasteService } from '../services/PasteService';
import { PasteCreationRequest } from '../models/PasteCreationRequest';

const sizeLimit = parseInt(process.env.SIZE_LIMIT) || 5000;

@JsonController('/v1/paste')
export class PasteController {
  @Inject()
  private pasteService: PasteService;

  @Get('/')
  async index() {}

  @Post('/')
  async create(@Body() request: PasteCreationRequest) {
    if (request.data.length > sizeLimit) {
      throw new Error('Size limit exceeded.');
    }

    const result = await this.pasteService.add(request.data);
    return { success: true, id: result.id };
  }

  @Get('/:id/data')
  async data(@Param('id') id: string) {
    if (parseInt(id)) {
      throw new Error('Id must be a string.');
    }

    const paste = await this.pasteService.byId(id);
    return paste.data;
  }

  @Get('/:id')
  async paste(@Param('id') id: string) {
    if (parseInt(id)) {
      throw new Error('Id must be a string.');
    }

    const paste = await this.pasteService.byId(id);
    return { id: id, createdAt: paste.createdAt };
  }
}
