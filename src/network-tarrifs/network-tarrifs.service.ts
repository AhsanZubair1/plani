import { Injectable } from '@nestjs/common';
import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { networkTarrif } from './domain/network-tarrif';
import { networkTarrifAbstractRepository } from './infrastructure/persistence/network-tarrif.abstract.repository';
import { StatusCountNetworkTarrifsDto } from '@src/network-tarrifs/dto/status-count.dto';

@Injectable()
export class networkTarrifsService {
  constructor(
    private readonly networkTarrifRepository: networkTarrifAbstractRepository,
  ) {}

  getStatusCount(): Promise<StatusCountNetworkTarrifsDto> {
    return this.networkTarrifRepository.getStatusCount();
  }

  getFilterOptions(): Promise<{
    retailTarrifs: string[];
    distributors: string[];
    markets: string[];
  }> {
    return this.networkTarrifRepository.getFilterOptions();
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
}
