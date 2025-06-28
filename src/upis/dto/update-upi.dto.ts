import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUpiDto } from './create-upi.dto';

export class UpdateUpiDto extends PartialType(
  PickType(CreateUpiDto, ['upi', 'is_delete']),
) {}
