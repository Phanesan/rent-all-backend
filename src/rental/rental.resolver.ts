import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Rental } from './entities/rental.entity';
import { RentalService } from './rental.service';
import { AvailabilityResponse } from './dto/availability-response.output';

@Resolver(() => Rental)
export class RentalResolver {
  constructor(private readonly rentalService: RentalService) {}

  @Query(() => AvailabilityResponse)
  async checkAvailability(
    @Args('itemId', { type: () => ID })
    itemId: string,
    @Args('startDate', { type: () => Date })
    startDate: Date,
    @Args('endDate', { type: () => Date })
    endDate: Date,
  ): Promise<{ available: boolean }> {
    return this.rentalService.checkAvailability(itemId, startDate, endDate);
  }
}
