import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ResponseHelper } from 'src/common/helpers/response.helper';

@ApiTags('Cards')
@Controller('cards')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiBody({
    type: CreateCardDto,
    description: 'Create a new card',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Card created successfully',
    type: ResponseHelper.success,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong while creating the card',
    type: ResponseHelper.error,
  })
  @Post()
  create(@Body() createCardDto: CreateCardDto, @GetUser() user: User) {
    return this.cardsService.create(createCardDto, user);
  }

  @ApiParam({
    name: 'accountId',
    description: 'Unique identifier of the account to which the card belongs',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'All Cards fetched successfully',
    type: ResponseHelper.success,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong while fetching all the cards',
    type: ResponseHelper.error,
  })
  @Get(':accountId')
  findAll(@Param('accountId') accountId: string) {
    return this.cardsService.findAll(accountId);
  }

  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the card to be deleted',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'accountId',
    description: 'Unique identifier of the account to which the card belongs',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'Card fetched successfully',
    type: ResponseHelper.success,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong while fetching the card',
    type: ResponseHelper.error,
  })
  @Get(':accountId/:id')
  findOne(@Param('id') id: string, @Param('accountId') accountId: string) {
    return this.cardsService.findOne(id, accountId);
  }

  @ApiBody({
    type: UpdateCardDto,
    description: 'Update card details',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the card to be deleted',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'accountId',
    description: 'Unique identifier of the account to which the card belongs',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'Card updated successfully',
    type: ResponseHelper.success,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong while updating the card',
    type: ResponseHelper.error,
  })
  @Patch(':accountId/:id')
  update(
    @Param('id') id: string,
    @Param('accountId') accountId: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(id, updateCardDto, accountId);
  }

  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the card to be deleted',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'accountId',
    description: 'Unique identifier of the account to which the card belongs',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'Card deleted successfully',
    type: ResponseHelper.success,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong while deleting the card',
    type: ResponseHelper.error,
  })
  @Delete(':accountId/:id')
  remove(@Param('id') id: string, @Param('accountId') accountId: string) {
    return this.cardsService.remove(id, accountId);
  }
}
