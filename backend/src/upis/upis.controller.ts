import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UpisService } from './upis.service';
import { CreateUpiDto } from './dto/create-upi.dto';
import { UpdateUpiDto } from './dto/update-upi.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('UPIs')
@Controller('upis')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class UpisController {
  constructor(private readonly upisService: UpisService) {}

  @ApiBody({
    type: CreateUpiDto,
    description: "Create your UPI."
  })
  @Post()
  async create(@Body() createUpiDto: CreateUpiDto, @GetUser() user: User) {
    return await this.upisService.create(createUpiDto, user);
  }

  @Get(':accountId')
  async findAll(@Param('accountId') accountId: string) {
    return await this.upisService.findAll(accountId);
  }

  @Get(':accountId/:id')
  async findOne(@Param('accountId') accountId: string, @Param('id') id: string) {
    return await this.upisService.findOne(accountId, id);
  }

  @Patch(':accountId/:id')
  async update(@Param('accountId') accountId: string, @Param('id') id: string, @Body() updateUpiDto: UpdateUpiDto) {
    return await this.upisService.update(accountId, id, updateUpiDto);
  }

  @Delete(':accountId/:id')
  async remove(@Param('accountId') accountId: string, @Param('id') id: string) {
    return await this.upisService.remove(accountId, id);
  }
}
