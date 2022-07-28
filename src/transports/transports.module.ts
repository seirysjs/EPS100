import { TransportsController } from './transports.controller';
import { TransportsService } from './transports.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from './transport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transport])],
  controllers: [TransportsController],
  providers: [TransportsService],
  exports: [TypeOrmModule],
})
export class TransportsModule {}
