import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Accounts')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiBody({
    type: CreateAccountDto,
    required: true,
  })
  @Post()
  create(@Body() createAccountDto: CreateAccountDto, @GetUser() user: User) {
    return this.accountsService.create(createAccountDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.accountsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.accountsService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto, @GetUser() user: User) {
    return this.accountsService.update(id, updateAccountDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.accountsService.remove(id, user);
  }
}
