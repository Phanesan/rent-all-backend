import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { BadRequestException } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';
import { DeleteResponse } from './dto/delete-response.output';

/**
 * Resolver para las operaciones GraphQL relacionadas con los usuarios.
 * Maneja las consultas (queries) y mutaciones (mutations) para la entidad User.
 */
@Resolver(() => User)
export class UserResolver {
  /**
   * Inyecta una instancia de UserService para interactuar con la lógica de negocio de usuarios.
   * @param userService El servicio que gestiona los datos de los usuarios.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Mutación para registrar un nuevo usuario en el sistema.
   * @param createUserInput Datos de entrada para la creación del nuevo usuario.
   * @returns El usuario recién creado.
   */
  @Mutation(() => User, { name: 'registerUser', description: 'Registers a new user in the system.' })
  async register(
    @Args('createUserInput', { description: 'Data for the new user.' }) createUserInput: CreateUserInput
  ): Promise<User> {
    
    return this.userService.create(createUserInput);

  }

  /**
   * Consulta para encontrar un único usuario por su ID o su email.
   * @param id El identificador único del usuario (opcional).
   * @param email El correo electrónico del usuario (opcional).
   * @returns El usuario encontrado o null si no existe.
   * @throws BadRequestException si no se proporciona ni el ID ni el email.
   */
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

  /**
   * Consulta para validar las credenciales de un usuario y realizar el login.
   * @param loginUserInput Credenciales de login del usuario (email y contraseña).
   * @returns El usuario si las credenciales son válidas.
   */
  @Query(() => User, { name: 'login', description: 'Validates user credentials and returns the user if valid.' })
  async login(
    @Args('loginUserInput', { description: 'User login credentials.' }) loginUserInput: LoginUserInput
  ): Promise<User> {

    return this.userService.validateUser(loginUserInput);

  }

  /**
   * Mutación para actualizar la información de un usuario existente.
   * @param updateUserInput Datos para actualizar el usuario.
   * @returns El usuario con la información actualizada.
   */
  @Mutation(() => User, { name: 'updateUser', description: 'Updates an existing user\'s information.' })
  async update(
    @Args('updateUserInput', { description: 'Data for updating the user.' }) updateUserInput: UpdateUserInput
  ): Promise<User> {

    return this.userService.update(updateUserInput);

  }

  /**
   * Mutación para realizar un borrado lógico (soft delete) de un usuario por su ID.
   * @param id El identificador único del usuario a desactivar.
   * @returns Una respuesta indicando el éxito de la operación.
   */
  @Mutation(() => DeleteResponse, { name: 'softDeleteUser', description: 'Performs a soft delete on a user by ID.' })
  async softDelete(
    @Args('id', { type: () => ID, description: 'The unique identifier of the user to be soft deleted.' }) id: string
  ): Promise<DeleteResponse> {

    return this.userService.softDelete(id);

  }

  /**
   * Mutación para restaurar un usuario que ha sido borrado lógicamente (soft delete).
   * @param id El identificador único del usuario a restaurar.
   * @returns Una respuesta indicando el éxito de la operación.
   */
  @Mutation(() => DeleteResponse, { name: 'restoreUser', description: 'Restores a soft-deleted user by ID.' })
  async restore(
    @Args('id', { type: () => ID, description: 'The unique identifier of the user to be restored.' }) id: string
  ): Promise<DeleteResponse> {

    return this.userService.restore(id);

  }

  /**
   * Mutación para eliminar permanentemente un usuario de la base de datos.
   * @param id El identificador único del usuario a eliminar permanentemente.
   * @returns Una respuesta indicando el éxito de la operación.
   */
  @Mutation(() => DeleteResponse, { name: 'hardDeleteUser', description: 'Permanently deletes a user by ID.' })
  async hardDelete(
    @Args('id', { type: () => ID, description: 'The unique identifier of the user to be permanently deleted.' }) id: string
  ): Promise<DeleteResponse> {

    return this.userService.hardDelete(id);

  }

}
