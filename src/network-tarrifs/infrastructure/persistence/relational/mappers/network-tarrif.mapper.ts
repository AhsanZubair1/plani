import { networkTarrif } from '@src/network-tarrifs/domain/network-tarrif';
import { networkTariffEntity } from '@src/network-tarrifs/infrastructure/persistence/relational/entities/network-tarrif.entity';

export class networkTarrifMapper {
  static toDomain(raw: networkTariffEntity): networkTarrif {
    const domainEntity = new networkTarrif();
    domainEntity.id = raw.network_tariff_id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: networkTarrif): networkTariffEntity {
    const persistenceEntity = new networkTariffEntity();
    if (domainEntity.id) {
      persistenceEntity.network_tariff_id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
