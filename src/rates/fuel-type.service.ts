import { Injectable } from '@nestjs/common';

import { FuelType } from '@src/rates/domain/fuel-type';
import { CreateFuelTypeDto } from '@src/rates/dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from '@src/rates/dto/update-fuel-type.dto';
import { RatesAbstractRepository } from '@src/rates/infrastructure/persistence/rates.abstract.repository';
import { NullableType } from '@src/utils/types/nullable.type';

@Injectable()
export class FuelTypeService {
  constructor(private readonly ratesRepository: RatesAbstractRepository) {}

  async create(createFuelTypeDto: CreateFuelTypeDto): Promise<FuelType> {
    const fuelType = new FuelType();
    Object.assign(fuelType, createFuelTypeDto);

    return this.ratesRepository.createFuelType(fuelType);
  }

  async findAll(): Promise<FuelType[]> {
    return this.ratesRepository.findAllFuelTypes();
  }

  async findOne(id: number): Promise<NullableType<FuelType>> {
    return this.ratesRepository.findFuelTypeById(id);
  }

  async findByCode(code: string): Promise<NullableType<FuelType>> {
    return this.ratesRepository.findFuelTypeByCode(code);
  }

  async update(
    id: number,
    updateFuelTypeDto: UpdateFuelTypeDto,
  ): Promise<FuelType> {
    const fuelType = new FuelType();
    Object.assign(fuelType, updateFuelTypeDto);

    return this.ratesRepository.updateFuelType(id, fuelType);
  }

  async remove(id: number): Promise<void> {
    await this.ratesRepository.deleteFuelType(id);
  }
}
