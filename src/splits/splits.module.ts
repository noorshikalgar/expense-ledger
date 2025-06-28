import { Module } from '@nestjs/common';
import { SplitsService } from './splits.service';
import { SplitsController } from './splits.controller';
import { Split } from './entities/split.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Split])],
  controllers: [SplitsController],
  providers: [SplitsService],
})
export class SplitsModule {}
