import { Module } from '@nestjs/common';
import { EmisService } from './emis.service';
import { EmisController } from './emis.controller';
import { Emi } from './entities/emi.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Emi])],
  controllers: [EmisController],
  providers: [EmisService],
})
export class EmisModule {}
