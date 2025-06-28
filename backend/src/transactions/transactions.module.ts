import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { CardsService } from 'src/cards/cards.service';
import { Account } from 'src/accounts/entities/account.entity';
import { Card } from 'src/cards/entities/card.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { UpisService } from 'src/upis/upis.service';
import { Upi } from 'src/upis/entities/upi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, Account, Card, Upi])],
  controllers: [TransactionsController],
  providers: [TransactionsService, UsersService, AccountsService, CardsService, UpisService],
})
export class TransactionsModule {}
