import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Blueprint } from './blueprint.entity';
import { BlueprintsService } from './blueprints.service';

@Controller('blueprints')
export class BlueprintsController {
  constructor(private readonly blueprintsService: BlueprintsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async create(@Body() blueprint: Blueprint): Promise<object> {
    const content = {
      errors: [],
    };
    if (!blueprint.product_class_id)
      content.errors.push({
        property: 'product_class_id',
        constraints: {
          'is-empty': `product_class_id must be selected`,
        },
      });
    if (!blueprint.product_size_id)
      content.errors.push({
        property: 'product_size_id',
        constraints: {
          'is-empty': `product_size_id must be selected`,
        },
      });
    if (!blueprint.product_class_id || !blueprint.product_size_id)
      return content;
    const checkUninque = await this.blueprintsService.findByProductClassAndSize(
      blueprint.product_class_id,
      blueprint.product_size_id,
    );
    if (checkUninque.length != 0) {
      content.errors.push({
        property: 'product_size_id',
        constraints: {
          duplicate: `product_size_id & product_class_id must be unique`,
        },
      });
      content.errors.push({
        property: 'product_class_id',
        constraints: {
          duplicate: `product_class_id & product_size_id must be unique`,
        },
      });
      return content;
    }
    await this.blueprintsService.create(blueprint);
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(
    @Body() blueprint: Blueprint,
    @Param('id') id: number,
  ): Promise<Blueprint> {
    await this.blueprintsService.updateBlueprint(id, blueprint);
    const result = await this.blueprintsService.findOne(id);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id')
  async findByProductClass(@Param('id') id: number): Promise<Blueprint[]> {
    const blueprints = await this.blueprintsService.findAllByProductClass(id);
    return blueprints;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-size/:id')
  async findByProductSize(@Param('id') id: number): Promise<Blueprint[]> {
    const blueprints = await this.blueprintsService.findAllByProductSize(id);
    return blueprints;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Blueprint[]> {
    const blueprints = await this.blueprintsService.findAll();
    return blueprints;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Blueprint> {
    return await this.blueprintsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.blueprintsService.remove(id);
  }
}
