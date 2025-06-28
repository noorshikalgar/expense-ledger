import { Injectable, Logger } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import { AccountsService } from 'src/accounts/accounts.service';
import { CardsService } from 'src/cards/cards.service';
import { Category } from 'src/categories/entities/category.entity';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UpisService } from 'src/upis/upis.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class TransactionsService {
  logger = new Logger(TransactionsService.name);
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private usersService: UsersService,
    private cardsService: CardsService,
    private accountsService: AccountsService,
    private upisService: UpisService,
  ) {}
  @ApiBody({
    required: true,
    type: CreateTransactionDto,
  })
  async create(createTransactionDto: CreateTransactionDto, user: User) {
    const cleanDTO = this.cleanTransactionsDTO(createTransactionDto);
    try {
      const getUserResponse = await this.usersService.findOne(user.id);
      const getUser: User = getUserResponse['data'];
      const account = getUser.accounts.find(
        (account) => account.id === createTransactionDto.account_id,
      );
      if (!account) {
        return ResponseHelper.error('Account not found for the user', []);
      }

      const category = getUser.categories.find(
        (category: Category) =>
          category.id === createTransactionDto.category_id,
      );
      if (!category) {
        return ResponseHelper.error('Category not found for the user', []);
      }

      const { description, nature, type, amount, is_paid, transaction_date } =
        cleanDTO;
      const newTransactionObject = {
        description,
        nature,
        type,
        is_paid,
        amount,
        transaction_date,
        owner: getUser,
        account,
        category,
      };
      // Fetch card if card is present
      if (cleanDTO.card_id) {
        const card = await this.cardsService.findOne(
          cleanDTO.card_id,
          account.id,
        );
        newTransactionObject['card'] = card['data'];
      }
      // Fetch Upi if upi_id is present
      if (cleanDTO.upi_id) {
        // TODO: Handle fetching UPI after UPI service is properly created
        const upi = await this.upisService.findOne(account.id, cleanDTO.upi_id);
        newTransactionObject['upi'] = upi['data'];
      }
      const newTransaction =
        await this.transactionRepository.create(newTransactionObject);
      this.logger.log(
        'Instance to Plain (Transaction): ',
        instanceToPlain(newTransaction),
      );
      const result = await this.transactionRepository.save(newTransaction);
      // After transaction reduce or increase the amount in respective account automatically
      await this.updateCreditCardAmount(newTransaction);
      await this.updateAccountAmount(newTransaction);
      return ResponseHelper.success('Transaction created successfully', result);
    } catch (error) {
      this.logger.error(error);
      return ResponseHelper.error('Error creating transaction', error);
    }

    // return 'This action adds a new transaction';
  }

  async findAll(user: User) {
    try {
      const allTransactions = await this.transactionRepository.find({
        relations: [
          'category',
          'account',
          'card',
          'upi',
          'split_users',
          'files',
          'comments',
        ],
        where: { owner: { id: user.id } },
      });
      return ResponseHelper.success(
        'Fetched all transactions.',
        instanceToPlain(allTransactions),
      );
    } catch (error) {
      return ResponseHelper.error('Fail to fetch all transactions.', error);
    }
  }

  async findOne(id: string, user: User) {
    try {
      const transaction = await this.transactionRepository.find({
        relations: [
          'category',
          'account',
          'card',
          'upi',
          'split_users',
          'files',
          'comments',
        ],
        where: { id, owner: { id: user.id } },
      });
      return ResponseHelper.success(
        'Fetched the transaction.',
        instanceToPlain(transaction),
      );
    } catch (error) {
      return ResponseHelper.error('Fail to fetch the transaction.', error);
    }
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    user: User,
  ) {
    try {
      const transaction = await this.transactionRepository.findOneOrFail({
        relations: [
          'category',
          'account',
          'card',
          'upi',
          'split_users',
          'files',
          'comments',
        ],
        where: { id, owner: { id: user.id } },
      });
      const cleanUpdateDTO = this.cleanTransactionsDTO(updateTransactionDto);
      const changeValues = this.checkForChangedFields(
        cleanUpdateDTO,
        transaction,
      );
      this.logger.debug('cleanUpdateDto: ', changeValues);

      // if anything which is relation specific it gets changes, fetch that and upadte
      const updateTransaction = await this.transactionRepository.update(
        id,
        changeValues,
      );
      this.logger.debug('Updayed transaction: ', updateTransaction);
      return ResponseHelper.success('Fetched all transactions.');
    } catch (error) {
      this.logger.error('Error: ', error);
      return ResponseHelper.error('Fail to fetch all transactions', error);
    }
  }

  async remove(id: string, user: User) {
    try {
      const allTransactions = await this.transactionRepository.find({
        relations: [
          'category',
          'account',
          'card',
          'upi',
          'split_users',
          'files',
          'comments',
        ],
        where: { owner: { id: user.id } },
      });
      return ResponseHelper.success(
        'Fetched all transactions.',
        instanceToPlain(allTransactions),
      );
    } catch (error) {
      return ResponseHelper.error('Fail to fetch all transactions', error);
    }
  }

  private cleanTransactionsDTO(
    dto: CreateTransactionDto | Partial<CreateTransactionDto>,
  ): Partial<CreateTransactionDto> {
    const cleanDTOKeys = Object.keys(dto).filter(
      (key: string) => !isEmpty(dto[key]),
    );
    const cleanDto: CreateTransactionDto = {} as CreateTransactionDto;
    cleanDTOKeys.forEach((key: string) => (cleanDto[key] = dto[key]));
    this.logger.log('Clean DTO : ', JSON.stringify(cleanDto));
    return cleanDto;
  }

  private async updateCreditCardAmount(transaction: Transaction) {
    if (
      transaction?.is_paid === true &&
      transaction?.['card'] &&
      transaction?.['card']['type'] === 'credit'
    ) {
      let newAmount = 0;
      if (transaction.type === 'expense') {
        newAmount =
          Number(transaction?.['card']?.['balance']) -
          Number(transaction.amount ?? 0);
      } else if (transaction.type === 'income') {
        newAmount =
          Number(transaction?.['card']?.['balance']) +
          Number(transaction.amount ?? 0);
      }
      const updateCreditCardBalance = await this.cardsService.update(
        transaction['card']['id'],
        {
          balance: newAmount,
        },
        transaction.account.id,
      );
      this.logger.log(
        `Credit Card Balance updated : ${JSON.stringify(updateCreditCardBalance)}`,
      );
    }
  }

  private async updateAccountAmount(transaction: Transaction) {
    if (transaction?.is_paid === true) {
      let newAmount = 0;
      if (transaction.type === 'expense') {
        newAmount =
          Number(transaction.account.balance) - Number(transaction.amount ?? 0);
      } else if (transaction.type === 'income') {
        newAmount =
          Number(transaction.account.balance) + Number(transaction.amount ?? 0);
      }
      this.logger.log(`Account new amount: ${newAmount}`);
      const updateAccount = await this.accountsService.update(
        transaction.account.id,
        {
          balance: newAmount,
        },
        transaction.owner,
      );
      this.logger.log(`Account updated : ${JSON.stringify(updateAccount)}`);
    }
  }

  private checkForChangedFields(
    updateDto: UpdateTransactionDto,
    transaction: Transaction,
  ) {
    const changedFields: any = {};

    // Iterate over the incoming DTO and compare with the existing product
    for (const key in updateDto) {
      if (updateDto.hasOwnProperty(key) && transaction.hasOwnProperty(key)) {
        // Perform a deep comparison if properties are objects, otherwise a direct comparison
        if (
          JSON.stringify(transaction[key]) !== JSON.stringify(updateDto[key])
        ) {
          changedFields[key] = updateDto[key];
        }
      }
    }
    if (
      updateDto?.category_id &&
      updateDto.category_id !== transaction.category.id
    ) {
      changedFields['category'] = changedFields['category']
        ? changedFields['category']
        : {};
      changedFields['category']['id'] = updateDto?.category_id;
    }

    if (
      updateDto?.account_id &&
      updateDto.account_id !== transaction.account.id
    ) {
      changedFields['account'] = changedFields['account']
        ? changedFields['account']
        : {};
      changedFields.account.id = updateDto?.account_id;
    }

    if (updateDto?.card_id && updateDto.card_id !== transaction.card.id) {
      changedFields['card'] = changedFields['card']
        ? changedFields['card']
        : {};
      changedFields.card.id = updateDto?.card_id;
    }

    if (updateDto?.upi_id && updateDto.upi_id !== transaction.upi.id) {
      changedFields['upi'] = changedFields['upi'] ? changedFields['upi'] : {};
      changedFields.upi.id = updateDto?.upi_id;
    }

    if (
      updateDto?.split_users &&
      JSON.stringify(updateDto.split_users ?? []) !==
        JSON.stringify(
          transaction.split_users.map((split: any) => split.id) ?? [],
        )
    ) {
      changedFields.split_users = updateDto?.split_users;
    }

    //   if (
    //     updateDto?.comments &&
    //     JSON.stringify(updateDto.comments) !==
    //       JSON.stringify(transaction.comments.map((comment: any) => comment.id))
    //   ) {
    //     changedFields.comments = updateDto?.comments;
    //   }

    //   if (
    //     updateDto?.files &&
    //     JSON.stringify(updateDto.files) !==
    //       JSON.stringify(transaction.files.map((file: any) => file.id))
    //   ) {
    //     changedFields.files = updateDto?.files;
    //   }
    return changedFields;
  }
}
