import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private userService: UsersService,
  ) {}

  async create(user: User, createCategoryDto: CreateCategoryDto) {
    try {
      const getUser = await this.userService.findOne(user.id);
      const new_category = await this.categoryRepository.create({
        ...createCategoryDto,
        owner: getUser['data'],
      });
      const save = await this.categoryRepository.save(new_category);
      return ResponseHelper.success('Category created successfully.', save);
    } catch (error) {
      return ResponseHelper.error('Category creation failed.', error);
    }
  }

  async findAll(user: User) {
    try {
      const all_categories = await this.categoryRepository.find({
        relations: ['owner'],
        where: { owner: { id: user.id } },
      });
      return ResponseHelper.success('Fetched all categories', all_categories);
    } catch (error) {
      return ResponseHelper.error('Category creation failed.', error);
    }
  }

  async findOne(id: string, user: User) {
    try {
      const category = await this.categoryRepository.find({
        relations: ['owner'],
        where: { id , owner: { id: user.id } },
      });
      return ResponseHelper.success('Category found.', category);
    } catch (error) {
      return ResponseHelper.error('Category not found.', error);
    }
  }

  async update(id: string, user: User, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOneOrFail({
        relations: ['owner'],
        where: { id , owner: { id: user.id } },
      });
      const update_category = await this.categoryRepository.update(id, {
        ...category,
        ...updateCategoryDto
      });
      return ResponseHelper.success('Category updated.', update_category);
    } catch (error) {
      return ResponseHelper.error('Category not updated.', error);
    }
  }

  async remove(id: string, user: User) {
    try {
      const category = await this.categoryRepository.findOneOrFail({
        relations: ['owner'],
        where: { id , owner: { id: user.id } },
      });
      const category_removed = await this.categoryRepository.remove(category);
      return ResponseHelper.success('Category removed.', category_removed);
    } catch (error) {
      return ResponseHelper.error('Failed to remove cateogry', error);
    }
  }
}
