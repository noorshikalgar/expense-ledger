import { Injectable } from '@nestjs/common';
import { CreateEmiDto } from './dto/create-emi.dto';
import { UpdateEmiDto } from './dto/update-emi.dto';

@Injectable()
export class EmisService {
  create(createEmiDto: CreateEmiDto) {
    return 'This action adds a new emi';
  }

  findAll() {
    return `This action returns all emis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emi`;
  }

  update(id: number, updateEmiDto: UpdateEmiDto) {
    return `This action updates a #${id} emi`;
  }

  remove(id: number) {
    return `This action removes a #${id} emi`;
  }
}
