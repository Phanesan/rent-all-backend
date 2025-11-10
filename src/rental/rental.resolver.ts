import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { Rental } from './entities/rental.entity';
import { RentalService } from './rental.service';
import { AvailabilityResponse } from './dto/availability-response.output';
import { CreateRentalInput } from './dto/create-rental.input';

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

  @Mutation(() => Rental)
  async createRental(
    @Args('createRentalInput') createRentalInput: CreateRentalInput,
  ): Promise<Rental> {
    return this.rentalService.create(createRentalInput);
  }

  @Mutation(() => Boolean)
  async removeRental(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.rentalService.remove(id);
    return true;
  }
}
