import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { FuelType } from '@src/rates/domain/fuel-type';
import { CreateFuelTypeDto } from '@src/rates/dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from '@src/rates/dto/update-fuel-type.dto';
import { FuelTypeService } from '@src/rates/fuel-type.service';
import { NullableType } from '@src/utils/types/nullable.type';

@ApiTags('Fuel Types')
@Controller({
  path: 'fuel-types',
  version: '1',
})
export class FuelTypeController {
  constructor(private readonly fuelTypeService: FuelTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fuel type' })
  @ApiResponse({ status: 201, description: 'Fuel type created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createFuelTypeDto: CreateFuelTypeDto,
  ): Promise<FuelType> {
    return this.fuelTypeService.create(createFuelTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fuel types' })
  @ApiResponse({
    status: 200,
    description: 'Fuel types retrieved successfully',
  })
  async findAll(): Promise<FuelType[]> {
    return this.fuelTypeService.findAll();
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get fuel type by code' })
  @ApiResponse({ status: 200, description: 'Fuel type retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Fuel type not found' })
  async findByCode(@Param('code') code: string): Promise<FuelType | null> {
    return this.fuelTypeService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fuel type by ID' })
  @ApiResponse({ status: 200, description: 'Fuel type retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Fuel type not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NullableType<FuelType>> {
    return this.fuelTypeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update fuel type' })
  @ApiResponse({ status: 200, description: 'Fuel type updated successfully' })
  @ApiResponse({ status: 404, description: 'Fuel type not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFuelTypeDto: UpdateFuelTypeDto,
  ): Promise<FuelType> {
    return this.fuelTypeService.update(id, updateFuelTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete fuel type' })
  @ApiResponse({ status: 204, description: 'Fuel type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Fuel type not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.fuelTypeService.remove(id);
  }
}
