import { faker } from '@faker-js/faker';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing_user = await this.userRepository.findOne({
      where: [{ email: dto.email }, { mobile: dto.mobile }],
    });

    if (existing_user) {
      throw new ConflictException('Email or mobile already exists');
    }

    const new_username = await this.checkUsernameAndReturn();

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({
      ...dto,
      username: new_username,
      password: hashedPassword,
    });

    try{
      const new_user = await this.userRepository.save(user);
      return ResponseHelper.success('User created successfully.', new_user);
    } catch (error) {
      return ResponseHelper.error('User not created.', [{ error }]);
    }
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOneOrFail({
        relations: ['accounts', 'transactions', 'categories'],
        where: { id } });
      return ResponseHelper.success('User found successfully.', user);
    } catch (error) {
      return ResponseHelper.error('User not found.', [{ error }]);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    try {
      await this.userRepository.update(id, updateUserDto);
      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      return ResponseHelper.error('User not found.', [{ error }]);
    }
  }

  async remove(id: string) {
    const remove_user = {
      is_deleted: true,
    };
    try {
      await this.userRepository.update(id, remove_user);
      await this.userRepository.findOneOrFail({ where: { id } });
      return ResponseHelper.success('User removed successfully,', { id });
    } catch (error) {
      return ResponseHelper.error('User not removed.', [{ error }]);
    }
  }

  private generateRandomUsername(): string {
    const word1 = faker.word.adjective(); // or faker.color.human()
    const word2 = faker.animal.type(); // or faker.word.noun()
    return `${word1}-${word2}`.toLowerCase();
  }

  private async checkUsernameAndReturn(): Promise<string> {
    let new_username = this.generateRandomUsername();
    const existing_username = await this.userRepository.findOne({
      where: [{ username: new_username }],
    });

    if (!existing_username) {
      return Promise.resolve(new_username);
    } else {
      return this.checkUsernameAndReturn();
    }
  }
}
