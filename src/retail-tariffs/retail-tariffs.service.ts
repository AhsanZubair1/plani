import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { retailTariffs } from './domain/retail-tariffs';
import { CreateretailTariffsDto } from './dto/create-retail-tariffs.dto';
import { UpdateretailTariffsDto } from './dto/update-retail-tariffs.dto';
import { retailTariffsAbstractRepository } from './infrastructure/persistence/retail-tariffs.abstract.repository';

@Injectable()
export class retailTariffsService {
  constructor(
    private readonly retailTariffsRepository: retailTariffsAbstractRepository,
  ) {}

  create(createretailTariffsDto: CreateretailTariffsDto) {
    return this.retailTariffsRepository.create(createretailTariffsDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.retailTariffsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: retailTariffs['id']) {
    return this.findAndValidate('id', id);
  }

  update(
    id: retailTariffs['id'],
    updateretailTariffsDto: UpdateretailTariffsDto,
  ) {
    const retailTariffs = this.retailTariffsRepository.update(
      id,
      updateretailTariffsDto,
    );
    if (!retailTariffs) {
      throw NOT_FOUND('retailTariffs', { id });
    }
    return retailTariffs;
  }

  remove(id: retailTariffs['id']) {
    return this.retailTariffsRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.retailTariffsRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on retailTariffs repository.`,
        field,
      );
    }

    const retailTariffs =
      await this.retailTariffsRepository[repoFunction](value);
    if (!retailTariffs) {
      throw NOT_FOUND('retailTariffs', { [field]: value });
    }
    return retailTariffs;
  }
}
