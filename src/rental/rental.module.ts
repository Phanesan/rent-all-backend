import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { RentalService } from './rental.service';
import { RentalResolver } from './rental.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Rental])],
  providers: [RentalResolver, RentalService],
  exports: [RentalService],
})
export class RentalModule {}
