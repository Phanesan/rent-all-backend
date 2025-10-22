import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => Item)
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
  ): Promise<Item> {
    return this.itemService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  findAll() {
    return this.itemService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Item> {
    return this.itemService.findOne(id);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Item> {
    return this.itemService.update(id, updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => ID }) id: string): Promise<void> {
    return this.itemService.remove(id);
  }
}
