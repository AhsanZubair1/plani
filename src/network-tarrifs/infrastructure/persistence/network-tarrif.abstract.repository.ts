import { networkTarrif } from '@src/network-tarrifs/domain/network-tarrif';
import { StatusCountNetworkTarrifsDto } from '@src/network-tarrifs/dto/status-count.dto';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

export abstract class networkTarrifAbstractRepository {
  abstract getStatusCount(): Promise<StatusCountNetworkTarrifsDto>;

  abstract getFilterOptions(): Promise<{
    retailTarrifs: string[];
    distributors: string[];
    markets: string[];
  }>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<networkTarrif[]>;
}
