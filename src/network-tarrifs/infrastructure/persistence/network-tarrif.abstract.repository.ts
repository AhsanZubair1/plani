import { networkTarrif } from '@src/network-tarrifs/domain/network-tarrif';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

export abstract class networkTarrifAbstractRepository {
  abstract create(
    data: Omit<networkTarrif, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<networkTarrif>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<networkTarrif[]>;

  abstract findById(
    id: networkTarrif['id'],
  ): Promise<NullableType<networkTarrif>>;

  abstract update(
    id: networkTarrif['id'],
    payload: DeepPartial<networkTarrif>,
  ): Promise<networkTarrif | null>;

  abstract remove(id: networkTarrif['id']): Promise<void>;
}
