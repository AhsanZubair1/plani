import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { networkTarrif } from './domain/network-tarrif';
import { CreatenetworkTarrifDto } from './dto/create-network-tarrif.dto';
import { UpdatenetworkTarrifDto } from './dto/update-network-tarrif.dto';
import { networkTarrifAbstractRepository } from './infrastructure/persistence/network-tarrif.abstract.repository';

@Injectable()
export class networkTarrifsService {
  constructor(
    private readonly networkTarrifRepository: networkTarrifAbstractRepository,
  ) {}

  create(createnetworkTarrifDto: CreatenetworkTarrifDto) {
    return this.networkTarrifRepository.create(createnetworkTarrifDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.networkTarrifRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: networkTarrif['id']) {
    return this.findAndValidate('id', id);
  }

  update(
    id: networkTarrif['id'],
    updatenetworkTarrifDto: UpdatenetworkTarrifDto,
  ) {
    const networkTarrif = this.networkTarrifRepository.update(
      id,
      updatenetworkTarrifDto,
    );
    if (!networkTarrif) {
      throw NOT_FOUND('networkTarrif', { id });
    }
    return networkTarrif;
  }

  remove(id: networkTarrif['id']) {
    return this.networkTarrifRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.networkTarrifRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on networkTarrif repository.`,
        field,
      );
    }

    const networkTarrif =
      await this.networkTarrifRepository[repoFunction](value);
    if (!networkTarrif) {
      throw NOT_FOUND('networkTarrif', { [field]: value });
    }
    return networkTarrif;
  }
}
