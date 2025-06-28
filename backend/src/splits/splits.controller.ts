import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SplitsService } from './splits.service';
import { CreateSplitDto } from './dto/create-split.dto';
import { UpdateSplitDto } from './dto/update-split.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Splits')
@Controller('splits')
export class SplitsController {
  constructor(private readonly splitsService: SplitsService) {}

  @Post()
  create(@Body() createSplitDto: CreateSplitDto) {
    return this.splitsService.create(createSplitDto);
  }

  @Get()
  findAll() {
    return this.splitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.splitsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSplitDto: UpdateSplitDto) {
    return this.splitsService.update(+id, updateSplitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.splitsService.remove(+id);
  }
}
