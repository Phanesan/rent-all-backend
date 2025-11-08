import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
  ) {}

  async checkAvailability(
    itemId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ available: boolean }> {
    const rentals = await this.rentalRepository.find({
      where: { item: { id: itemId } },
    });

    const isOverlap = rentals.some(
      (rental) =>
        startDate < rental.endDate && endDate > rental.startDate,
    );

    return { available: !isOverlap };
  }
}
