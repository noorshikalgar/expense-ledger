import { PartialType } from '@nestjs/swagger';
import { CreateEmiDto } from './create-emi.dto';

export class UpdateEmiDto extends PartialType(CreateEmiDto) {}
