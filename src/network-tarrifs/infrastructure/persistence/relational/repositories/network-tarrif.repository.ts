import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { networkTarrif } from '@src/network-tarrifs/domain/network-tarrif';
import { networkTarrifAbstractRepository } from '@src/network-tarrifs/infrastructure/persistence/network-tarrif.abstract.repository';
import { networkTariffEntity } from '@src/network-tarrifs/infrastructure/persistence/relational/entities/network-tarrif.entity';
import { networkTarrifMapper } from '@src/network-tarrifs/infrastructure/persistence/relational/mappers/network-tarrif.mapper';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { StatusCountNetworkTarrifsDto } from '@src/network-tarrifs/dto/status-count.dto';

@Injectable()
export class networkTarrifRelationalRepository
  implements networkTarrifAbstractRepository
{
  constructor(
    @InjectRepository(networkTariffEntity)
    private readonly networkTarrifRepository: Repository<networkTariffEntity>,
  ) {}

  async getStatusCount(): Promise<StatusCountNetworkTarrifsDto> {
    const networkTariffs = await this.networkTarrifRepository
      .createQueryBuilder('network_tariff')
      .leftJoinAndSelect('network_tariff.ntcRelations', 'ntc_reln')
      .leftJoinAndSelect('ntc_reln.network_tariff_key', 'network_tariff_key')
      .leftJoinAndSelect(
        'network_tariff_key.retailNtcKeyRelations',
        'retail_ntc_key_reln',
      )
      .leftJoinAndSelect('retail_ntc_key_reln.retail_tariff', 'retail_tariff')
      .getMany();

    let activeCount = 0;
    let inactiveCount = 0;

    networkTariffs.forEach((networkTariff) => {
      networkTariff.ntcRelations?.forEach((ntcRelation) => {
        ntcRelation.network_tariff_key?.retailNtcKeyRelations?.forEach(
          (retailRelation) => {
            if (retailRelation.retail_tariff?.active) {
              activeCount++;
            } else {
              inactiveCount++;
            }
          },
        );
      });
    });

    return {
      active: activeCount,
      inActive: inactiveCount,
    };
  }

  async getFilterOptions(): Promise<{
    retailTarrifs: string[];
    distributors: string[];
    markets: string[];
  }> {
    const [retailTarrifs, distributors] = await Promise.all([
      // Get unique retail tariffs through the relationship chain
      this.networkTarrifRepository
        .createQueryBuilder('network_tariff')
        .leftJoin('network_tariff.ntcRelations', 'ntc_reln')
        .leftJoin('ntc_reln.network_tariff_key', 'network_tariff_key')
        .leftJoin(
          'network_tariff_key.retailNtcKeyRelations',
          'retail_ntc_key_reln',
        )
        .leftJoin('retail_ntc_key_reln.retail_tariff', 'retail_tariff')
        .select('DISTINCT retail_tariff.retail_tariff_code', 'retailTariff')
        .where('retail_tariff.retail_tariff_code IS NOT NULL')
        .getRawMany()
        .then((results) => results.map((r) => r.retailTariff)),

      // Get unique distributors directly from network_tariff
      this.networkTarrifRepository
        .createQueryBuilder('network_tariff')
        .leftJoin('network_tariff.distributor', 'distributor')
        .select('DISTINCT distributor.distributor_name', 'distributor')
        .where('distributor.distributor_name IS NOT NULL')
        .getRawMany()
        .then((results) => results.map((r) => r.distributor)),
    ]);

    return {
      retailTarrifs: retailTarrifs.filter(Boolean),
      distributors: distributors.filter(Boolean),
      markets: [], // Always return empty array for markets
    };
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
}
