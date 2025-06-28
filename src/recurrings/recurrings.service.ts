import { Injectable } from '@nestjs/common';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';

@Injectable()
export class RecurringsService {
  create(createRecurringDto: CreateRecurringDto) {
    return 'This action adds a new recurring';
  }

  findAll() {
    return `This action returns all recurrings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recurring`;
  }

  update(id: number, updateRecurringDto: UpdateRecurringDto) {
    return `This action updates a #${id} recurring`;
  }

  remove(id: number) {
    return `This action removes a #${id} recurring`;
  }
}
