import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Categories')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBody({
    required: true,
    type: CreateCategoryDto
  })
  @Post()
  create(@GetUser() user: User, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(user,createCategoryDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.categoriesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.categoriesService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @GetUser() user: User, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, user, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.categoriesService.remove(id, user);
  }
}
