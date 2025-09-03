import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { retailTariffs } from '@src/retail-tariffs/domain/retail-tariffs';
import { retailTariffsEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/retail-tariffs.entity';
import { retailTariffsMapper } from '@src/retail-tariffs/infrastructure/persistence/relational/mappers/retail-tariffs.mapper';
import { retailTariffsAbstractRepository } from '@src/retail-tariffs/infrastructure/persistence/retail-tariffs.abstract.repository';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class retailTariffsRelationalRepository
  implements retailTariffsAbstractRepository
{
  constructor(
    @InjectRepository(retailTariffsEntity)
    private readonly retailTariffsRepository: Repository<retailTariffsEntity>,
  ) {}

  async create(data: retailTariffs): Promise<retailTariffs> {
    const persistenceModel = retailTariffsMapper.toPersistence(data);
    const newEntity = await this.retailTariffsRepository.save(
      this.retailTariffsRepository.create(persistenceModel),
    );
    return retailTariffsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<retailTariffs[]> {
    const entities = await this.retailTariffsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => retailTariffsMapper.toDomain(entity));
  }

  async findById(
    id: retailTariffs['id'],
  ): Promise<NullableType<retailTariffs>> {
    const entity = await this.retailTariffsRepository.findOne({
      where: { retail_tariff_id: id },
    });

    return entity ? retailTariffsMapper.toDomain(entity) : null;
  }

  async update(
    id: retailTariffs['id'],
    payload: Partial<retailTariffs>,
  ): Promise<retailTariffs | null> {
    const entity = await this.retailTariffsRepository.findOne({
      where: { retail_tariff_id: id },
    });

    if (!entity) return null;

    const updatedEntity = await this.retailTariffsRepository.save(
      this.retailTariffsRepository.create(
        retailTariffsMapper.toPersistence({
          ...retailTariffsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return retailTariffsMapper.toDomain(updatedEntity);
  }

  async remove(id: retailTariffs['id']): Promise<void> {
    await this.retailTariffsRepository.delete(id);
  }
}
