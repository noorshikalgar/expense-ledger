import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private userService: UsersService,
  ) {}

  async create(createAccountDto: CreateAccountDto, user: User) {
    try {
      const owner = await this.userService.findOne(user.id);
      const new_account = await this.accountRepository.create({
        ...createAccountDto,
        owner: owner['data'],
      });
      const save = await this.accountRepository.save(new_account);
      return ResponseHelper.success('Account created successfully.', save);
    } catch (error) {
      return ResponseHelper.error('Account creation failed.', error);
    }
  }

  async findAll(user: User) {
    try {
      const all_accounts = await this.accountRepository.find({
        relations: ['owner', 'cards', 'upis', 'transactions'],
        where: { owner: { id: user.id }, is_deleted: false },
      });
      return ResponseHelper.success('Found all accounts.', all_accounts);
    } catch (error) {
      return ResponseHelper.error('Accounts not found.', error);
    }
  }

  async findOne(id: string, user: User) {
    try {
      const account = await this.accountRepository.findOneOrFail({
        relations: ['owner', 'cards', 'upis', 'transactions'],
        where: { id: id, owner: { id: user.id }, is_deleted: false },
      });
      return ResponseHelper.success('Found a single account.', account);
    } catch (error) {
      return ResponseHelper.error('Account with given id not found.', error);
    }
  }

  async update(id: string, updateAccountDto: UpdateAccountDto, user: User) {
    try {
      const account = await this.accountRepository.findOneOrFail({
        relations: ['owner'],
        where: { id: id, owner: { id: user.id }, is_deleted: false },
      });
      const update_account = { ...account, ...updateAccountDto };
      const save_updated = await this.accountRepository.update(
        id,
        update_account,
      );
      return ResponseHelper.success('Account updated.', save_updated);
    } catch (error) {
      console.log(`Error : ${error}`)
      return ResponseHelper.error('Account update failed.', error);
    }
    // return `This action updates a #${id} account`;
  }

  async remove(id: string, user: User) {
    try {
      const account = await this.accountRepository.findOneOrFail({
        relations: ['owner', 'cards', 'upis', 'transactions'],
        where: { id: id, owner: { id: user.id }, is_deleted: false },
      });
      const update_account = { ...account, is_deleted: true };
      const save_updated = await this.accountRepository.update(
        id,
        update_account,
      );
      return ResponseHelper.success('Account removed.', save_updated);
    } catch (error) {
      return ResponseHelper.error('Failed to remove account.', error);
    }
  }
}
