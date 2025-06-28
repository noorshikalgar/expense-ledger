import { Module } from '@nestjs/common';
import { RecurringsService } from './recurrings.service';
import { RecurringsController } from './recurrings.controller';
import { Recurring } from './entities/recurring.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Recurring])],
  controllers: [RecurringsController],
  providers: [RecurringsService],
})
export class RecurringsModule {}
