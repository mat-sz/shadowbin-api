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

@JsonController('/v1/paste')
export class PasteController {
  @Inject()
  private pasteService: PasteService;

  @Get('/')
  async index() {}

  @Post('/')
  async create(@Body() request: PasteCreationRequest) {
    const result = await this.pasteService.add(request.data);

    return { success: true, id: result.id };
  }
}
