import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserInput } from './dto/login-user.input';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
/**
 * Servicio encargado de gestionar las operaciones relacionadas con los usuarios.
 *
 * Proporciona métodos para crear, buscar, actualizar, eliminar (borrado lógico y físico) y restaurar usuarios en la base de datos.
 * Incluye validaciones para evitar duplicidad de correos electrónicos, encriptación de contraseñas y manejo de excepciones
 * para los diferentes escenarios de error (usuario no encontrado, credenciales inválidas, correo ya registrado, etc.).
 *
 * Métodos principales:
 * - `create`: Crea un nuevo usuario, validando que el correo no exista y encriptando la contraseña.
 * - `findOneById`: Busca un usuario por su ID, lanzando excepción si no existe.
 * - `findOneByEmail`: Busca un usuario por su correo electrónico, lanzando excepción si no existe.
 * - `validateUser`: Valida las credenciales de inicio de sesión de un usuario.
 * - `update`: Actualiza los datos de un usuario, validando unicidad de correo y encriptando la nueva contraseña si se proporciona.
 * - `softDelete`: Realiza un borrado lógico del usuario (soft delete).
 * - `restore`: Restaura un usuario previamente eliminado lógicamente.
 * - `hardDelete`: Elimina físicamente un usuario de la base de datos.
 *
 * Todas las operaciones devuelven promesas y manejan las excepciones correspondientes para garantizar la integridad de los datos.
 */
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * 
   * Este método verifica primero si el correo electrónico proporcionado ya existe en la base de datos.
   * Si el correo ya está registrado, lanza una excepción de conflicto. Si no existe, encripta la contraseña
   * del usuario antes de guardar el nuevo usuario en la base de datos.
   * 
   * @param createUserInput - Objeto que contiene los datos necesarios para crear un usuario, incluyendo el correo y la contraseña.
   * @returns Una promesa que resuelve con el usuario creado.
   * @throws ConflictException Si el correo electrónico ya está registrado en la base de datos.
   */
  async create(createUserInput: CreateUserInput): Promise<User> {
    
    // verifica si el correo ya existe en la base de datos
    const userExists = await this.userRepository.findOneBy({ email: createUserInput.email });

    if (userExists) {
      throw new ConflictException('Email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    const newUser = this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });
    
    return this.userRepository.save(newUser);

  }

  /**
   * Busca un usuario por su ID en la base de datos.
   * 
   * Este método intenta encontrar un usuario utilizando el ID proporcionado.
   * Si el usuario no existe, lanza una excepción de no encontrado.
   * 
   * @param id - El identificador único del usuario a buscar.
   * @returns Una promesa que resuelve con el usuario encontrado.
   * @throws NotFoundException Si no se encuentra un usuario con el ID proporcionado.
   */
  async findOneById(id: string): Promise<User> {
    
    const user = await this.userRepository.findOneBy({ id });

    if(!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;

  }

  /**
   * Busca y retorna un usuario por su correo electrónico.
   *
   * @param email - El correo electrónico del usuario a buscar.
   * @returns Una promesa que resuelve con el usuario encontrado.
   * @throws NotFoundException Si no se encuentra un usuario con el correo proporcionado.
   */
  async findOneByEmail(email: string): Promise<User> {
    
    const user = await this.userRepository.findOneBy({ email });

    if(!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;

  }

  /**
   * Retorna una lista paginada de usuarios del sistema.
   * @param limit - El número de usuarios a retornar por página.
   * @param page - El número de página a retornar.
   * @returns Una promesa que resuelve con una lista de usuarios.
   */
  async findAll(limit: number, page: number): Promise<User[]> {

    return this.userRepository.find({
      take: limit,
      skip: (page - 1) * limit,
    });

  }


  /**
   * Valida las credenciales de un usuario durante el proceso de inicio de sesión.
   *
   * @param loginUserInput - Objeto que contiene el correo electrónico y la contraseña del usuario.
   * @returns Una promesa que resuelve con el usuario autenticado si las credenciales son válidas.
   * @throws {UnauthorizedException} Si el usuario no existe o la contraseña es incorrecta.
   */
  async validateUser(loginUserInput: LoginUserInput): Promise<User> {

    const {  email, password } = loginUserInput;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;

  }

  /**
   * Actualiza la información de un usuario existente.
   *
   * @param updateUserInput - Objeto que contiene los datos a actualizar del usuario, incluyendo el ID.
   * @returns Una promesa que resuelve con el usuario actualizado.
   * @throws NotFoundException Si no se encuentra un usuario con el ID proporcionado.
   * @throws BadRequestException Si el correo electrónico proporcionado ya está en uso por otro usuario.
   *
   * Este método primero intenta precargar el usuario a actualizar. Si se proporciona una nueva contraseña,
   * la encripta antes de guardarla. También verifica que el nuevo correo electrónico no esté en uso por otro usuario.
   */
  async update(updateUserInput: UpdateUserInput): Promise<User> {

    const { id, ...updateData } = updateUserInput;

    const userToUpdate = await this.userRepository.preload({
      id,
      ...updateData,
    });

    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
      userToUpdate.password = updateData.password;
    }

    if(updateData.email) {
      const emailExists = await this.userRepository.findOneBy({ email: updateData.email });
      if(emailExists && emailExists.id !== id) {
        throw new BadRequestException('Email already in use by another user');
      }
    }

    return this.userRepository.save(userToUpdate);

  }

  /**
   * Elimina lógicamente un usuario por su ID.
   * 
   * Esta función realiza un borrado suave (soft delete) del usuario especificado,
   * marcándolo como eliminado sin eliminar físicamente el registro de la base de datos.
   * 
   * @param id - El identificador único del usuario a eliminar lógicamente.
   * @returns Un objeto que indica si la operación fue exitosa.
   * @throws NotFoundException Si no se encuentra un usuario con el ID proporcionado.
   */
  async softDelete(id: string): Promise<{success: boolean; message: string}> {

    const result: DeleteResult = await this.userRepository.softDelete(id);

    if(result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { success: true, message: `User with ID ${id} has been soft deleted` };

  }

  /**
   * Restaura un usuario previamente eliminado (soft delete) por su ID.
   *
   * @param id - El identificador único del usuario a restaurar.
   * @returns Un objeto que indica si la operación fue exitosa.
   * @throws NotFoundException Si el usuario con el ID proporcionado no existe o no está eliminado.
   */
  async restore(id: string): Promise<{success: boolean; message: string}> {

    const result: DeleteResult = await this.userRepository.restore(id);

    if(result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found or is not deleted`);
    }

    return { success: true, message: `User with ID ${id} has been restored` };

  }

  /**
   * Elimina de forma permanente un usuario de la base de datos según su ID.
   *
   * @param id - El identificador único del usuario a eliminar.
   * @returns Un objeto que indica si la operación fue exitosa.
   * @throws NotFoundException Si no se encuentra un usuario con el ID proporcionado.
   */
  async hardDelete(id: string): Promise<{success: boolean; message: string}> {

    const user = await this.userRepository.findOneBy({ id });

    if(!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);

    return { success: true, message: `User with ID ${id} has been hard deleted` };

  }

}
