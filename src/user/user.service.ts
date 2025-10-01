import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
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

}
