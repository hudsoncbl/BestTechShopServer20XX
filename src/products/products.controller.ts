import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ ЗАЛИШАЄМО HTTP (щоб фронт працював)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // 🔥 МІКРОСЕРВІС (для внутрішніх викликів)
  @MessagePattern({ cmd: 'get_products' })
  findAllMicro() {
    return this.productsService.findAll();
  }

  // ===============================

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create({
      name: dto.name,
      brand: dto.brand,
      price: String(dto.price) as any,
      stock: dto.stock ?? 0,
      description: dto.description,
    });
  }

  // 🔥 МІКРОСЕРВІС створення товару
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
