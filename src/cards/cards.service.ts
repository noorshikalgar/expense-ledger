import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { User } from 'src/users/entities/user.entity';
import { ResponseHelper } from 'src/common/helpers/response.helper';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private accountService: AccountsService,
  ) {}

  async create(createCardDto: CreateCardDto, user: User) {
    try {
      const acount = await this.accountService.findOne(
        createCardDto.accountId,
        user,
      );
      const newCard = this.cardRepository.create({
        ...createCardDto,
        account: acount['data'],
      });
      const result = await this.cardRepository.save(newCard);
      return ResponseHelper.success('Card created successfully.', result);
    } catch (error) {
      return ResponseHelper.error(
        'Failed to create card',
        error.message || 'Unknown error',
      );
    }
  }

  async findAll(accountId: string) {
    try {
      const allCards = await this.cardRepository.find({
        relations: ['account'],
        where: {
          account: { id: accountId, is_deleted: false },
          is_deleted: false,
        },
        order: { created_at: 'DESC' },
      });
      return ResponseHelper.success('Cards retrieved successfully.', allCards);
    } catch (error) {
      return ResponseHelper.error(
        'Failed to retrieve cards',
        error.message || 'Unknown error',
      );
    }
  }

  async findOne(id: string, accountId: string) {
    try {
      const card = await this.cardRepository.findOneOrFail({
        relations: ['account'],
        where: {
          id: id,
          account: { id: accountId, is_deleted: false },
          is_deleted: false,
        },
      });
      return ResponseHelper.success('Card retrieved successfully.', card);
    } catch (error) {
      return ResponseHelper.error(
        'Failed to retrieve card',
        error.message || 'Unknown error',
      );
    }
  }

  async update(id: string, updateCardDto: UpdateCardDto, accountId: string) {
    try {
      const card = await this.cardRepository.findOneOrFail({
        relations: ['account'],
        where: {
          id: id,
          account: { id: accountId, is_deleted: false },
          is_deleted: false,
        },
      });
      const updatedCard = { ...card, ...updateCardDto };
      const result = await this.cardRepository.save(updatedCard);
      return ResponseHelper.success('Card updated successfully.', result);
    } catch (error) {
      return ResponseHelper.error(
        'Failed to updated card',
        error.message || 'Unknown error',
      );
    }
  }

  async remove(id: string, accountId: string) {
       try {
      const card = await this.cardRepository.findOneOrFail({
        relations: ['account'],
        where: {
          id: id,
          account: { id: accountId, is_deleted: false },
          is_deleted: false,
        },
      });
      const updatedCard = { ...card, is_deleted: true };
      const result = await this.cardRepository.save(updatedCard);
      return ResponseHelper.success('Card deleted successfully.', result);
    } catch (error) {
      return ResponseHelper.error(
        'Failed to delete card',
        error.message || 'Unknown error',
      );
    }
  }
}
