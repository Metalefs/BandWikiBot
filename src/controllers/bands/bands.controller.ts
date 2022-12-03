import { Controller, Delete, Get, Param, Put, Post, Req } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BandsService } from './bands.service';


@Controller('bands')
export class BandsController {
  constructor(private readonly service: BandsService) { }

  @Get('/')
  async list(@Req() req) {
    return this.service.list(req)
  }
  
  @Get('/type/:type')
  findByType(@Param() params, @Req() req) {
    return this.service.findByType(params.type);
  }

  @Get(':id')
  findById(@Param() params, @Req() req) {
    return this.service.findOne(params.id);
  }

  @Post()
  create(@Req() post) {
    post.body.userId = new ObjectId(post.user);
    return this.service.insert(post.body)
  }

  @Put(':id')
  update(@Param('id') id: string, @Req() request: Request) {
    return this.service.update(id, request.body);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.service.delete(id);
  }
}
