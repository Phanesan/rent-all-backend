import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { BadRequestException } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { name: 'registerUser', description: 'Registers a new user in the system.' })
  async register(
    @Args('createUserInput', { description: 'Data for the new user.' }) createUserInput: CreateUserInput
  ): Promise<User> {
    
    return this.userService.create(createUserInput);

  }

  @Query(() => User, { name: 'user', nullable: true, description: 'Finds a single user by ID or email.' })
  async findOne(
    @Args('id', { type: () => ID, nullable: true, description: 'The unique identifier of the user.' }) id?: string,
    @Args('email', { type: () => String, nullable: true, description: 'The email address of the user.' }) email?: string,
  ): Promise<User> {

    if (id) {
      return this.userService.findOneById(id);
    } else if (email) {
      return this.userService.findOneByEmail(email);
    }
    throw new BadRequestException('You must provide either an ID or an email to find a user.');

  }

  @Query(() => User, { name: 'login', description: 'Validates user credentials and returns the user if valid.' })
  async login(
    @Args('loginUserInput', { description: 'User login credentials.' }) loginUserInput: LoginUserInput
  ): Promise<User> {

    return this.userService.validateUser(loginUserInput);

  }

}
