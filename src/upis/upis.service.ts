import { Injectable, Logger } from '@nestjs/common';
import { CreateUpiDto } from './dto/create-upi.dto';
import { UpdateUpiDto } from './dto/update-upi.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Upi } from './entities/upi.entity';
import { Repository } from 'typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { User } from 'src/users/entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UpisService {
  logger = new Logger(UpisService.name);
  constructor(
    @InjectRepository(Upi)
    private readonly upiRepository: Repository<Upi>,
    private accountService: AccountsService,
  ) {}

  async create(createUpiDto: CreateUpiDto, user: User) {
    try {
      const account = await this.accountService.findOne(
        createUpiDto.account_id,
        user,
      );
      const newUpi = {
        upi: createUpiDto.upi,
        account: account['data'],
      };
      const createUpi = await this.upiRepository.create(newUpi);
      const result = await this.upiRepository.save(createUpi);
      return ResponseHelper.success('Upi id successfully created.', instanceToPlain(result));
    } catch (error) {
      this.logger.error(error);
      return ResponseHelper.error('Failed to create Upi id.', error);
    }
  }

  async findAll(accountId: string) {
    try {
      let result = await this.upiRepository.find({
        relations: ['account'],
        where: { account: { id: accountId } },
      });
      return ResponseHelper.success(
        'Fetched all Upis successfully',
        instanceToPlain(result),
      );
    } catch (error) {
      return ResponseHelper.error('Failed to fetch Upis', error);
    }
  }

  async findOne(accountId: string, id: string) {
    try {
      const result = await this.upiRepository.findOneOrFail({
        relations: ['account'],
        where: { id, account: { id: accountId } },
      });
      return ResponseHelper.success('Fetched the Upi successfully', instanceToPlain(result));
    } catch (error) {
      return ResponseHelper.error('Failed to fetch the Upi', error);
    }
  }

  async update(accountId: string, id: string, updateUpiDto: UpdateUpiDto) {
    try {
      const result = await this.upiRepository.findOneOrFail({
        relations: ['account'],
        where: { id, account: { id: accountId }, is_deleted: false },
      });
      if (!result) {
        return ResponseHelper.error('Invalid account or upi');
      }
      const updateUpi = await this.upiRepository.update(id, {
        ...updateUpiDto,
      });
      return ResponseHelper.success('Updated the Upi successfully', result);
    } catch (error) {
      return ResponseHelper.error('Failed to update the Upi', error);
    }
  }

  async remove(accountId: string, id: string) {
    try {
      const result = await this.upiRepository.findOneOrFail({
        relations: ['account'],
        where: { id, account: { id: accountId }, is_deleted: false },
      });
      if (!result) {
        return ResponseHelper.error('Invalid account or upi');  
      }
      const updateUpi = await this.upiRepository.update(id, {
        is_deleted: true,
      });
      return ResponseHelper.success('Upi removed successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to remove the Upi');
    }
  }
}
