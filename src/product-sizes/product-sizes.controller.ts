import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductSize } from './product-size.entity';
import { ProductSizesService } from './product-sizes.service';

@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async create(@Body() productSize: ProductSize): Promise<object> {
    const errors = [];

    if (!productSize.x_mm || productSize.x_mm == 0) 
    errors.push({
      property: 'x_mm',
      constraints: {
        empty: `x_mm must be filled!`,
      },
    });

    if (!productSize.y_mm || productSize.y_mm == 0)
    errors.push({
      property: 'y_mm',
      constraints: {
        empty: `y_mm must be filled!`,
      },
    });

    if (!productSize.z_mm || productSize.z_mm == 0) 
    errors.push({
      property: 'z_mm',
      constraints: {
        empty: `z_mm must be filled!`,
      },
    });

    if (errors.length > 0) 
    return { errors: errors };

    const checkSize = await this.productSizesService.findBySize(productSize);
    if (checkSize && (checkSize?.length != 0))
    return {
      errors: [
        {
          property: 'x_mm',
          constraints: {
            duplicate: `size DUPLICATE! Product Size ${productSize.x_mm}x${productSize.y_mm}x${productSize.z_mm} already exists`,
          },
        },
        {
          property: 'y_mm',
          constraints: {
            duplicate: `size DUPLICATE! Product Size ${productSize.x_mm}x${productSize.y_mm}x${productSize.z_mm} already exists`,
          },
        },
        {
          property: 'z_mm',
          constraints: {
            duplicate: `size DUPLICATE! Product Size ${productSize.x_mm}x${productSize.y_mm}x${productSize.z_mm} already exists`,
          },
        },
      ],
    };

    await this.productSizesService.create(productSize);
    return { errors: [] };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ProductSize[]> {
    return await this.productSizesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProductSize> {
    return await this.productSizesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async update(@Body() productSize: ProductSize, @Param('id') id: number): Promise<ProductSize> {
    return await this.productSizesService.update(id, productSize);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.productSizesService.remove(id);
  }
}
