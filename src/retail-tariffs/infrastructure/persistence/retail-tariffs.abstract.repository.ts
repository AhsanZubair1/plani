import { retailTariffs } from '@src/retail-tariffs/domain/retail-tariffs';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

export abstract class retailTariffsAbstractRepository {
  abstract create(
    data: Omit<retailTariffs, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<retailTariffs>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<retailTariffs[]>;

  abstract findById(
    id: retailTariffs['id'],
  ): Promise<NullableType<retailTariffs>>;

  abstract update(
    id: retailTariffs['id'],
    payload: DeepPartial<retailTariffs>,
  ): Promise<retailTariffs | null>;

  abstract remove(id: retailTariffs['id']): Promise<void>;
}
