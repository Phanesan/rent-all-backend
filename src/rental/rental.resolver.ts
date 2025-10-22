import { Resolver } from '@nestjs/graphql';
import { Rental } from './entities/rental.entity';
import { RentalService } from './rental.service';

@Resolver(() => Rental)
export class RentalResolver {
  constructor(private readonly rentalService: RentalService) {}

  // GraphQL queries and mutations for Rental can be added here later
}
