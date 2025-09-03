import { retailTariffs } from '@src/retail-tariffs/domain/retail-tariffs';
import { retailTariffsEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/retail-tariffs.entity';

export class retailTariffsMapper {
  static toDomain(raw: retailTariffsEntity): retailTariffs {
    const domainEntity = new retailTariffs();
    domainEntity.id = raw.retail_tariff_id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: retailTariffs): retailTariffsEntity {
    const persistenceEntity = new retailTariffsEntity();
    if (domainEntity.id) {
      persistenceEntity.retail_tariff_id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
