import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BandRepository } from '../../repository/band.repository';


@Injectable()
export class BandsService {
  constructor(protected repo: BandRepository) {

  }

  async list(req) {
    const list = await this.repo.find({ userId: new ObjectId(req.user) });
    return list.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  async findOne(id) {
    return this.repo.findOne({ _id: new ObjectId(id)})
  }

  async findByType(type) {
    return this.repo.find({ type })
  }

  async insert(band) {
    const result = await this.repo.insert(band);
    return this.findOne(result.insertedId) as any;
  }

  async update(id, band) {
    return this.repo.update({ _id: new ObjectId(id) }, band);
  }

  async delete(id) {
   return this.repo.removeByFilter({ _id: new ObjectId(id) });
  }

  async getAll() {
    return await this.repo.find({});
  }
}
