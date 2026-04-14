import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern({ cmd: 'get_products' })
  findAllMicro() {
    return this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create({
      name: dto.name,
      brand: dto.brand,
      price: String(dto.price),
      stock: dto.stock ?? 0,
      description: dto.description,
    });
  }

  @MessagePattern({ cmd: 'create_product' })
  createMicro(dto: CreateProductDto) {
    return this.productsService.create({
      name: dto.name,
      brand: dto.brand,
      price: String(dto.price) as any,
      stock: dto.stock ?? 0,
      description: dto.description,
    });
  }
}
