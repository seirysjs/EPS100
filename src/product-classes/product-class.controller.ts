import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductClass } from './product-class.entity';
import { ProductClassService } from './product-class.service';

@Controller('product-classes')
export class ProductClassController {
  constructor(private readonly productClassService: ProductClassService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async create(@Body() productClass: ProductClass): Promise<object> {
    if (!productClass.name || productClass.name.split(" ").length == 0) 
    return {
      errors: [
        {
          property: 'name',
          constraints: {
            empty: `name must be filled!`,
          },
        },
      ],
    };

    const checkName = await this.productClassService.findByName(productClass.name);
    if (checkName && (checkName?.length != 0))
    return {
      errors: [
        {
          property: 'name',
          constraints: {
            duplicate: `name DUPLICATE! Product Class ${productClass.name} already exists`,
          },
        },
      ],
    };

    await this.productClassService.create(productClass);
    return { errors: [] };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ProductClass[]> {
    return await this.productClassService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProductClass> {
    return await this.productClassService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-name/:name')
  async findByName(@Param('name') name: string): Promise<ProductClass[]> {
    return await this.productClassService.findByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.productClassService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(@Body() productClass: ProductClass, @Param('id') id: number): Promise<ProductClass> {
    return await this.productClassService.update(id, productClass);
  }
}
