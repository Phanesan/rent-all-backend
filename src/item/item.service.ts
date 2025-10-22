import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {

    const newItem = this.itemRepository.create({
      ...createItemInput,
    });
    return this.itemRepository.save(newItem);

  }

  async findAll(): Promise<Item[]> {

    return this.itemRepository.find();

  }

  async findOne(id: string): Promise<Item> {

    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
    return item;

  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {

    await this.itemRepository.update(id, updateItemInput);
    const updatedItem = await this.itemRepository.findOneBy({ id });
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
    return updatedItem;

  }

  async remove(id: string): Promise<void> {

    const result = await this.itemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
    
  }
}
