import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { networkTarrif } from '@src/network-tarrifs/domain/network-tarrif';
import { networkTarrifAbstractRepository } from '@src/network-tarrifs/infrastructure/persistence/network-tarrif.abstract.repository';
import { networkTariffEntity } from '@src/network-tarrifs/infrastructure/persistence/relational/entities/network-tarrif.entity';
import { networkTarrifMapper } from '@src/network-tarrifs/infrastructure/persistence/relational/mappers/network-tarrif.mapper';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class networkTarrifRelationalRepository
  implements networkTarrifAbstractRepository
{
  constructor(
    @InjectRepository(networkTariffEntity)
    private readonly networkTarrifRepository: Repository<networkTariffEntity>,
  ) {}

  async create(data: networkTarrif): Promise<networkTarrif> {
    const persistenceModel = networkTarrifMapper.toPersistence(data);
    const newEntity = await this.networkTarrifRepository.save(
      this.networkTarrifRepository.create(persistenceModel),
    );
    return networkTarrifMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<networkTarrif[]> {
    const entities = await this.networkTarrifRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => networkTarrifMapper.toDomain(entity));
  }

  async findById(
    id: networkTarrif['id'],
  ): Promise<NullableType<networkTarrif>> {
    const entity = await this.networkTarrifRepository.findOne({
      where: { network_tariff_id: id },
    });

    return entity ? networkTarrifMapper.toDomain(entity) : null;
  }

  async update(
    id: networkTarrif['id'],
    payload: Partial<networkTarrif>,
  ): Promise<networkTarrif | null> {
    const entity = await this.networkTarrifRepository.findOne({
      where: { network_tariff_id: id },
    });

    if (!entity) return null;

    const updatedEntity = await this.networkTarrifRepository.save(
      this.networkTarrifRepository.create(
        networkTarrifMapper.toPersistence({
          ...networkTarrifMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return networkTarrifMapper.toDomain(updatedEntity);
  }

  async remove(id: networkTarrif['id']): Promise<void> {
    await this.networkTarrifRepository.delete(id);
  }
}
