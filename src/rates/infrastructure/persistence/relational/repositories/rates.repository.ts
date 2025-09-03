import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Domain entities
import { FuelType } from '@src/rates/domain/fuel-type';
import { Rate } from '@src/rates/domain/rate';
import { RateCard } from '@src/rates/domain/rate-card';
import { RateCategory } from '@src/rates/domain/rate-category';
import { RateClass } from '@src/rates/domain/rate-class';
import { RateSeason } from '@src/rates/domain/rate-season';
import { RateType } from '@src/rates/domain/rate-type';
import { TariffType } from '@src/rates/domain/tariff-type';

// Database entities
import { RatesAbstractRepository } from '@src/rates/infrastructure/persistence/rates.abstract.repository';
import { FuelTypeEntity } from '@src/rates/infrastructure/persistence/relational/entities/fuel-type.entity';
import { RateCardEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-card.entity';
import { RateCategoryEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-category.entity';
import { RateClassEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-class.entity';
import { RateSeasonEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-season.entity';
import { RateTypeEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-type.entity';
import { RateEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate.entity';
import { TariffTypeEntity } from '@src/rates/infrastructure/persistence/relational/entities/tariff-type.entity';

// Mappers
import { FuelTypeMapper } from '@src/rates/infrastructure/persistence/relational/mappers/fuel-type.mapper';
import { RateCardMapper } from '@src/rates/infrastructure/persistence/relational/mappers/rate-card.mapper';
import { RateCategoryMapper } from '@src/rates/infrastructure/persistence/relational/mappers/rate-category.mapper';
import { RateClassMapper } from '@src/rates/infrastructure/persistence/relational/mappers/rate-class.mapper';
import { RateSeasonMapper } from '@src/rates/infrastructure/persistence/relational/mappers/rate-season.mapper';
import { RateTypeMapper } from '@src/rates/infrastructure/persistence/relational/mappers/rate-type.mapper';
import { RateMapper } from '@src/rates/infrastructure/persistence/relational/mappers/rate.mapper';
import { TariffTypeMapper } from '@src/rates/infrastructure/persistence/relational/mappers/tariff-type.mapper';

// Abstract repository
import { NullableType } from '@src/utils/types/nullable.type';

@Injectable()
export class RatesRelationalRepository extends RatesAbstractRepository {
  constructor(
    @InjectRepository(FuelTypeEntity)
    private readonly fuelTypesRepository: Repository<FuelTypeEntity>,
    @InjectRepository(TariffTypeEntity)
    private readonly tariffTypesRepository: Repository<TariffTypeEntity>,
    @InjectRepository(RateCardEntity)
    private readonly rateCardsRepository: Repository<RateCardEntity>,
    @InjectRepository(RateClassEntity)
    private readonly rateClassesRepository: Repository<RateClassEntity>,
    @InjectRepository(RateTypeEntity)
    private readonly rateTypesRepository: Repository<RateTypeEntity>,
    @InjectRepository(RateCategoryEntity)
    private readonly rateCategoriesRepository: Repository<RateCategoryEntity>,
    @InjectRepository(RateEntity)
    private readonly ratesRepository: Repository<RateEntity>,
    @InjectRepository(RateSeasonEntity)
    private readonly rateSeasonsRepository: Repository<RateSeasonEntity>,
  ) {
    super();
  }

  // FuelType methods
  async createFuelType(data: FuelType): Promise<FuelType> {
    const persistenceModel = FuelTypeMapper.toPersistence(data);
    const newEntity = await this.fuelTypesRepository.save(
      this.fuelTypesRepository.create(persistenceModel),
    );
    return FuelTypeMapper.toDomain(newEntity);
  }

  async findFuelTypeById(
    id: FuelType['fuelTypeId'],
  ): Promise<NullableType<FuelType>> {
    const entity = await this.fuelTypesRepository.findOne({
      where: { fuel_type_id: id },
    });
    return entity ? FuelTypeMapper.toDomain(entity) : null;
  }

  async findFuelTypeByCode(code: string): Promise<NullableType<FuelType>> {
    const entity = await this.fuelTypesRepository.findOne({
      where: { fuel_type_code: code },
    });
    return entity ? FuelTypeMapper.toDomain(entity) : null;
  }

  async findAllFuelTypes(): Promise<FuelType[]> {
    const entities = await this.fuelTypesRepository.find({
      order: { fuel_type_name: 'ASC' },
    });
    return entities.map((entity) => FuelTypeMapper.toDomain(entity));
  }

  async updateFuelType(
    id: FuelType['fuelTypeId'],
    payload: Partial<FuelType>,
  ): Promise<FuelType> {
    const entity = await this.fuelTypesRepository.findOne({
      where: { fuel_type_id: id },
    });

    if (!entity) {
      throw new Error('Fuel type not found');
    }

    const updatedEntity = await this.fuelTypesRepository.save(
      this.fuelTypesRepository.create(
        FuelTypeMapper.toPersistence({
          ...FuelTypeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return FuelTypeMapper.toDomain(updatedEntity);
  }

  async deleteFuelType(id: FuelType['fuelTypeId']): Promise<void> {
    await this.fuelTypesRepository.delete(id);
  }

  // TariffType methods
  async createTariffType(data: TariffType): Promise<TariffType> {
    const persistenceModel = TariffTypeMapper.toPersistence(data);
    const newEntity = await this.tariffTypesRepository.save(
      this.tariffTypesRepository.create(persistenceModel),
    );
    return TariffTypeMapper.toDomain(newEntity);
  }

  async findTariffTypeById(
    id: TariffType['tariffTypeId'],
  ): Promise<NullableType<TariffType>> {
    const entity = await this.tariffTypesRepository.findOne({
      where: { tariff_type_id: id },
      relations: ['fuelType'],
    });
    return entity ? TariffTypeMapper.toDomain(entity) : null;
  }

  async findTariffTypeByCode(code: string): Promise<NullableType<TariffType>> {
    const entity = await this.tariffTypesRepository.findOne({
      where: { tariff_type_code: code },
      relations: ['fuelType'],
    });
    return entity ? TariffTypeMapper.toDomain(entity) : null;
  }

  async findTariffTypesByFuelType(fuelTypeId: number): Promise<TariffType[]> {
    const entities = await this.tariffTypesRepository.find({
      where: { fuel_type_id: fuelTypeId },
      relations: ['fuelType'],
      order: { tariff_type_name: 'ASC' },
    });
    return entities.map((entity) => TariffTypeMapper.toDomain(entity));
  }

  async findAllTariffTypes(): Promise<TariffType[]> {
    const entities = await this.tariffTypesRepository.find({
      relations: ['fuelType'],
      order: { tariff_type_name: 'ASC' },
    });
    return entities.map((entity) => TariffTypeMapper.toDomain(entity));
  }

  async updateTariffType(
    id: TariffType['tariffTypeId'],
    payload: Partial<TariffType>,
  ): Promise<TariffType> {
    const entity = await this.tariffTypesRepository.findOne({
      where: { tariff_type_id: id },
    });

    if (!entity) {
      throw new Error('Tariff type not found');
    }

    const updatedEntity = await this.tariffTypesRepository.save(
      this.tariffTypesRepository.create(
        TariffTypeMapper.toPersistence({
          ...TariffTypeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TariffTypeMapper.toDomain(updatedEntity);
  }

  async deleteTariffType(id: TariffType['tariffTypeId']): Promise<void> {
    await this.tariffTypesRepository.delete(id);
  }

  // RateCard methods
  async createRateCard(data: RateCard): Promise<RateCard> {
    const persistenceModel = RateCardMapper.toPersistence(data);
    const newEntity = await this.rateCardsRepository.save(
      this.rateCardsRepository.create(persistenceModel),
    );
    return RateCardMapper.toDomain(newEntity);
  }

  async findRateCardById(
    id: RateCard['rateCardId'],
  ): Promise<NullableType<RateCard>> {
    const entity = await this.rateCardsRepository.findOne({
      where: { rate_card_id: id },
      relations: ['tariffType', 'tariffType.fuelType'],
    });
    return entity ? RateCardMapper.toDomain(entity) : null;
  }

  async findRateCardsByTariffType(tariffTypeId: number): Promise<RateCard[]> {
    const entities = await this.rateCardsRepository.find({
      where: { tariff_type_id: tariffTypeId },
      relations: ['tariffType', 'tariffType.fuelType'],
      order: { rate_card_name: 'ASC' },
    });
    return entities.map((entity) => RateCardMapper.toDomain(entity));
  }

  async findAllRateCards(): Promise<RateCard[]> {
    const entities = await this.rateCardsRepository.find({
      relations: ['tariffType', 'tariffType.fuelType'],
      order: { rate_card_name: 'ASC' },
    });
    return entities.map((entity) => RateCardMapper.toDomain(entity));
  }

  async updateRateCard(
    id: RateCard['rateCardId'],
    payload: Partial<RateCard>,
  ): Promise<RateCard> {
    const entity = await this.rateCardsRepository.findOne({
      where: { rate_card_id: id },
    });

    if (!entity) {
      throw new Error('Rate card not found');
    }

    const updatedEntity = await this.rateCardsRepository.save(
      this.rateCardsRepository.create(
        RateCardMapper.toPersistence({
          ...RateCardMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RateCardMapper.toDomain(updatedEntity);
  }

  async deleteRateCard(id: RateCard['rateCardId']): Promise<void> {
    await this.rateCardsRepository.delete(id);
  }

  // RateClass methods
  async createRateClass(data: RateClass): Promise<RateClass> {
    const persistenceModel = RateClassMapper.toPersistence(data);
    const newEntity = await this.rateClassesRepository.save(
      this.rateClassesRepository.create(persistenceModel),
    );
    return RateClassMapper.toDomain(newEntity);
  }

  async findRateClassById(
    id: RateClass['rateClassId'],
  ): Promise<NullableType<RateClass>> {
    const entity = await this.rateClassesRepository.findOne({
      where: { rate_class_id: id },
    });
    return entity ? RateClassMapper.toDomain(entity) : null;
  }

  async findRateClassByCode(code: string): Promise<NullableType<RateClass>> {
    const entity = await this.rateClassesRepository.findOne({
      where: { rate_class_code: code },
    });
    return entity ? RateClassMapper.toDomain(entity) : null;
  }

  async findAllRateClasses(): Promise<RateClass[]> {
    const entities = await this.rateClassesRepository.find({
      order: { rate_class_name: 'ASC' },
    });
    return entities.map((entity) => RateClassMapper.toDomain(entity));
  }

  async updateRateClass(
    id: RateClass['rateClassId'],
    payload: Partial<RateClass>,
  ): Promise<RateClass> {
    const entity = await this.rateClassesRepository.findOne({
      where: { rate_class_id: id },
    });

    if (!entity) {
      throw new Error('Rate class not found');
    }

    const updatedEntity = await this.rateClassesRepository.save(
      this.rateClassesRepository.create(
        RateClassMapper.toPersistence({
          ...RateClassMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RateClassMapper.toDomain(updatedEntity);
  }

  async deleteRateClass(id: RateClass['rateClassId']): Promise<void> {
    await this.rateClassesRepository.delete(id);
  }

  // RateType methods
  async createRateType(data: RateType): Promise<RateType> {
    const persistenceModel = RateTypeMapper.toPersistence(data);
    const newEntity = await this.rateTypesRepository.save(
      this.rateTypesRepository.create(persistenceModel),
    );
    return RateTypeMapper.toDomain(newEntity);
  }

  async findRateTypeById(
    id: RateType['rateTypeId'],
  ): Promise<NullableType<RateType>> {
    const entity = await this.rateTypesRepository.findOne({
      where: { rate_type_id: id },
      relations: ['rateClass'],
    });
    return entity ? RateTypeMapper.toDomain(entity) : null;
  }

  async findRateTypeByCode(code: string): Promise<NullableType<RateType>> {
    const entity = await this.rateTypesRepository.findOne({
      where: { rate_type_code: code },
      relations: ['rateClass'],
    });
    return entity ? RateTypeMapper.toDomain(entity) : null;
  }

  async findRateTypesByRateClass(rateClassId: number): Promise<RateType[]> {
    const entities = await this.rateTypesRepository.find({
      where: { rate_class_id: rateClassId },
      relations: ['rateClass'],
      order: { rate_type_name: 'ASC' },
    });
    return entities.map((entity) => RateTypeMapper.toDomain(entity));
  }

  async findAllRateTypes(): Promise<RateType[]> {
    const entities = await this.rateTypesRepository.find({
      relations: ['rateClass'],
      order: { rate_type_name: 'ASC' },
    });
    return entities.map((entity) => RateTypeMapper.toDomain(entity));
  }

  async updateRateType(
    id: RateType['rateTypeId'],
    payload: Partial<RateType>,
  ): Promise<RateType> {
    const entity = await this.rateTypesRepository.findOne({
      where: { rate_type_id: id },
    });

    if (!entity) {
      throw new Error('Rate type not found');
    }

    const updatedEntity = await this.rateTypesRepository.save(
      this.rateTypesRepository.create(
        RateTypeMapper.toPersistence({
          ...RateTypeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RateTypeMapper.toDomain(updatedEntity);
  }

  async deleteRateType(id: RateType['rateTypeId']): Promise<void> {
    await this.rateTypesRepository.delete(id);
  }

  // RateCategory methods
  async createRateCategory(data: RateCategory): Promise<RateCategory> {
    const persistenceModel = RateCategoryMapper.toPersistence(data);
    const newEntity = await this.rateCategoriesRepository.save(
      this.rateCategoriesRepository.create(persistenceModel),
    );
    return RateCategoryMapper.toDomain(newEntity);
  }

  async findRateCategoryById(
    id: RateCategory['rateCategoryId'],
  ): Promise<NullableType<RateCategory>> {
    const entity = await this.rateCategoriesRepository.findOne({
      where: { rate_category_id: id },
    });
    return entity ? RateCategoryMapper.toDomain(entity) : null;
  }

  async findRateCategoryByCode(
    code: string,
  ): Promise<NullableType<RateCategory>> {
    const entity = await this.rateCategoriesRepository.findOne({
      where: { rate_category_code: code },
    });
    return entity ? RateCategoryMapper.toDomain(entity) : null;
  }

  async findAllRateCategories(): Promise<RateCategory[]> {
    const entities = await this.rateCategoriesRepository.find({
      order: { rate_category_name: 'ASC' },
    });
    return entities.map((entity) => RateCategoryMapper.toDomain(entity));
  }

  async updateRateCategory(
    id: RateCategory['rateCategoryId'],
    payload: Partial<RateCategory>,
  ): Promise<RateCategory> {
    const entity = await this.rateCategoriesRepository.findOne({
      where: { rate_category_id: id },
    });

    if (!entity) {
      throw new Error('Rate category not found');
    }

    const updatedEntity = await this.rateCategoriesRepository.save(
      this.rateCategoriesRepository.create(
        RateCategoryMapper.toPersistence({
          ...RateCategoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RateCategoryMapper.toDomain(updatedEntity);
  }

  async deleteRateCategory(id: RateCategory['rateCategoryId']): Promise<void> {
    await this.rateCategoriesRepository.delete(id);
  }

  // Rate methods
  async createRate(data: Rate): Promise<Rate> {
    const persistenceModel = RateMapper.toPersistence(data);
    const newEntity = await this.ratesRepository.save(
      this.ratesRepository.create(persistenceModel),
    );
    return RateMapper.toDomain(newEntity);
  }

  async findRateById(id: Rate['rateId']): Promise<NullableType<Rate>> {
    const entity = await this.ratesRepository.findOne({
      where: { rate_id: id },
      relations: [
        'rateCategory',
        'rateCard',
        'rateCard.tariffType',
        'rateCard.tariffType.fuelType',
      ],
    });
    return entity ? RateMapper.toDomain(entity) : null;
  }

  async findRateByCode(code: string): Promise<NullableType<Rate>> {
    const entity = await this.ratesRepository.findOne({
      where: { rate_code: code },
      relations: [
        'rateCategory',
        'rateCard',
        'rateCard.tariffType',
        'rateCard.tariffType.fuelType',
      ],
    });
    return entity ? RateMapper.toDomain(entity) : null;
  }

  async findRatesByRateCard(rateCardId: number): Promise<Rate[]> {
    const entities = await this.ratesRepository.find({
      where: { rate_card_id: rateCardId },
      relations: [
        'rateCategory',
        'rateCard',
        'rateCard.tariffType',
        'rateCard.tariffType.fuelType',
      ],
      order: { rate_name: 'ASC' },
    });
    return entities.map((entity) => RateMapper.toDomain(entity));
  }

  async findRatesByRateCategory(rateCategoryId: number): Promise<Rate[]> {
    const entities = await this.ratesRepository.find({
      where: { rate_category_id: rateCategoryId },
      relations: [
        'rateCategory',
        'rateCard',
        'rateCard.tariffType',
        'rateCard.tariffType.fuelType',
      ],
      order: { rate_name: 'ASC' },
    });
    return entities.map((entity) => RateMapper.toDomain(entity));
  }

  async findAllRates(): Promise<Rate[]> {
    const entities = await this.ratesRepository.find({
      relations: [
        'rateCategory',
        'rateCard',
        'rateCard.tariffType',
        'rateCard.tariffType.fuelType',
      ],
      order: { rate_name: 'ASC' },
    });
    return entities.map((entity) => RateMapper.toDomain(entity));
  }

  async updateRate(id: Rate['rateId'], payload: Partial<Rate>): Promise<Rate> {
    const entity = await this.ratesRepository.findOne({
      where: { rate_id: id },
    });

    if (!entity) {
      throw new Error('Rate not found');
    }

    const updatedEntity = await this.ratesRepository.save(
      this.ratesRepository.create(
        RateMapper.toPersistence({
          ...RateMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RateMapper.toDomain(updatedEntity);
  }

  async deleteRate(id: Rate['rateId']): Promise<void> {
    await this.ratesRepository.delete(id);
  }

  // RateSeason methods
  async createRateSeason(data: RateSeason): Promise<RateSeason> {
    const persistenceModel = RateSeasonMapper.toPersistence(data);
    const newEntity = await this.rateSeasonsRepository.save(
      this.rateSeasonsRepository.create(persistenceModel),
    );
    return RateSeasonMapper.toDomain(newEntity);
  }

  async findRateSeasonById(
    id: RateSeason['rateSeasonId'],
  ): Promise<NullableType<RateSeason>> {
    const entity = await this.rateSeasonsRepository.findOne({
      where: { rate_season_id: id },
      relations: ['rate', 'rate.rateCategory', 'rate.rateCard'],
    });
    return entity ? RateSeasonMapper.toDomain(entity) : null;
  }

  async findRateSeasonsByRate(rateId: number): Promise<RateSeason[]> {
    const entities = await this.rateSeasonsRepository.find({
      where: { rate_id: rateId },
      relations: ['rate', 'rate.rateCategory', 'rate.rateCard'],
      order: { effective_from: 'ASC' },
    });
    return entities.map((entity) => RateSeasonMapper.toDomain(entity));
  }

  async findRateSeasonsBySeasonCode(seasonCode: string): Promise<RateSeason[]> {
    const entities = await this.rateSeasonsRepository.find({
      where: { season_code: seasonCode },
      relations: ['rate', 'rate.rateCategory', 'rate.rateCard'],
      order: { effective_from: 'ASC' },
    });
    return entities.map((entity) => RateSeasonMapper.toDomain(entity));
  }

  async findActiveRateSeasons(): Promise<RateSeason[]> {
    const now = new Date();
    const entities = await this.rateSeasonsRepository
      .createQueryBuilder('rateSeason')
      .leftJoinAndSelect('rateSeason.rate', 'rate')
      .leftJoinAndSelect('rate.rateCategory', 'rateCategory')
      .leftJoinAndSelect('rate.rateCard', 'rateCard')
      .where('rateSeason.effective_from <= :now', { now })
      .andWhere('rateSeason.effective_to >= :now', { now })
      .orderBy('rateSeason.effective_from', 'ASC')
      .getMany();

    return entities.map((entity) => RateSeasonMapper.toDomain(entity));
  }

  async findAllRateSeasons(): Promise<RateSeason[]> {
    const entities = await this.rateSeasonsRepository.find({
      relations: ['rate', 'rate.rateCategory', 'rate.rateCard'],
      order: { effective_from: 'ASC' },
    });
    return entities.map((entity) => RateSeasonMapper.toDomain(entity));
  }

  async updateRateSeason(
    id: RateSeason['rateSeasonId'],
    payload: Partial<RateSeason>,
  ): Promise<RateSeason> {
    const entity = await this.rateSeasonsRepository.findOne({
      where: { rate_season_id: id },
    });

    if (!entity) {
      throw new Error('Rate season not found');
    }

    const updatedEntity = await this.rateSeasonsRepository.save(
      this.rateSeasonsRepository.create(
        RateSeasonMapper.toPersistence({
          ...RateSeasonMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RateSeasonMapper.toDomain(updatedEntity);
  }

  async deleteRateSeason(id: RateSeason['rateSeasonId']): Promise<void> {
    await this.rateSeasonsRepository.delete(id);
  }
}
