import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
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

  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'itemsPerPage',
    required: false,
    type: Number,
    description: 'Number of items per page for pagination',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Number,
    description: 'Start date for filtering transactions',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Number,
    description: 'End date for filtering transactions',
  })
  @Get()
  findAll(
    @GetUser() user: User,
    @Query('page') page: number = 1,
    @Query('itemsPerPage') itemsPerPage: number = 10,
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    return this.transactionsService.findAll(user, {page, itemsPerPage, startDate, endDate});
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
