import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmisService } from './emis.service';
import { CreateEmiDto } from './dto/create-emi.dto';
import { UpdateEmiDto } from './dto/update-emi.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('EMIs')
@Controller('emis')
export class EmisController {
  constructor(private readonly emisService: EmisService) {}

  @Post()
  create(@Body() createEmiDto: CreateEmiDto) {
    return this.emisService.create(createEmiDto);
  }

  @Get()
  findAll() {
    return this.emisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmiDto: UpdateEmiDto) {
    return this.emisService.update(+id, updateEmiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emisService.remove(+id);
  }
}
