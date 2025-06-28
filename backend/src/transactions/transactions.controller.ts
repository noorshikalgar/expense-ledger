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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Transactions')
@Controller('transactions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard) // Assuming you have a guard for authentication
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiBody({
    type: CreateTransactionDto,
    description: 'Creates a new transaction',
  })
  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: User,
  ) {
    return this.transactionsService.create(createTransactionDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.transactionsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.transactionsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @GetUser() user: User,
  ) {
    return this.transactionsService.update(id, updateTransactionDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.transactionsService.remove(id, user);
  }
}
