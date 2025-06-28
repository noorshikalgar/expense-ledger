import { Module } from '@nestjs/common';
import { UpisService } from './upis.service';
import { UpisController } from './upis.controller';
import { Upi } from './entities/upi.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upi, Account, User])],
  controllers: [UpisController],
  providers: [UpisService, AccountsService, UsersService],
})
export class UpisModule {}
