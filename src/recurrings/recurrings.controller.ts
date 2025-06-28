import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecurringsService } from './recurrings.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Recurrings')
@Controller('recurrings')
export class RecurringsController {
  constructor(private readonly recurringsService: RecurringsService) {}

  @Post()
  create(@Body() createRecurringDto: CreateRecurringDto) {
    return this.recurringsService.create(createRecurringDto);
  }

  @Get()
  findAll() {
    return this.recurringsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recurringsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecurringDto: UpdateRecurringDto) {
    return this.recurringsService.update(+id, updateRecurringDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recurringsService.remove(+id);
  }
}
