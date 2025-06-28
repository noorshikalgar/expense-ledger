import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Account } from 'src/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Account, User])],
  controllers: [CardsController],
  providers: [CardsService, AccountsService, UsersService],
})
export class CardsModule {}
