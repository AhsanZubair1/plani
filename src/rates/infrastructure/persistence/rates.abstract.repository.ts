import { FuelType } from '@src/rates/domain/fuel-type';
import { Rate } from '@src/rates/domain/rate';
import { RateCard } from '@src/rates/domain/rate-card';
import { RateCategory } from '@src/rates/domain/rate-category';
import { RateClass } from '@src/rates/domain/rate-class';
import { RateSeason } from '@src/rates/domain/rate-season';
import { RateType } from '@src/rates/domain/rate-type';
import { TariffType } from '@src/rates/domain/tariff-type';
import { NullableType } from '@src/utils/types/nullable.type';

export abstract class RatesAbstractRepository {
  // FuelType methods
  abstract createFuelType(data: FuelType): Promise<FuelType>;
  abstract findFuelTypeById(
    id: FuelType['fuelTypeId'],
  ): Promise<NullableType<FuelType>>;
  abstract findFuelTypeByCode(code: string): Promise<NullableType<FuelType>>;
  abstract findAllFuelTypes(): Promise<FuelType[]>;
  abstract updateFuelType(
    id: FuelType['fuelTypeId'],
    payload: Partial<FuelType>,
  ): Promise<FuelType>;
  abstract deleteFuelType(id: FuelType['fuelTypeId']): Promise<void>;

  // TariffType methods
  abstract createTariffType(data: TariffType): Promise<TariffType>;
  abstract findTariffTypeById(
    id: TariffType['tariffTypeId'],
  ): Promise<NullableType<TariffType>>;
  abstract findTariffTypeByCode(
    code: string,
  ): Promise<NullableType<TariffType>>;
  abstract findTariffTypesByFuelType(fuelTypeId: number): Promise<TariffType[]>;
  abstract findAllTariffTypes(): Promise<TariffType[]>;
  abstract updateTariffType(
    id: TariffType['tariffTypeId'],
    payload: Partial<TariffType>,
  ): Promise<TariffType>;
  abstract deleteTariffType(id: TariffType['tariffTypeId']): Promise<void>;

  // RateCard methods
  abstract createRateCard(data: RateCard): Promise<RateCard>;
  abstract findRateCardById(
    id: RateCard['rateCardId'],
  ): Promise<NullableType<RateCard>>;
  abstract findRateCardsByTariffType(tariffTypeId: number): Promise<RateCard[]>;
  abstract findAllRateCards(): Promise<RateCard[]>;
  abstract updateRateCard(
    id: RateCard['rateCardId'],
    payload: Partial<RateCard>,
  ): Promise<RateCard>;
  abstract deleteRateCard(id: RateCard['rateCardId']): Promise<void>;

  // RateClass methods
  abstract createRateClass(data: RateClass): Promise<RateClass>;
  abstract findRateClassById(
    id: RateClass['rateClassId'],
  ): Promise<NullableType<RateClass>>;
  abstract findRateClassByCode(code: string): Promise<NullableType<RateClass>>;
  abstract findAllRateClasses(): Promise<RateClass[]>;
  abstract updateRateClass(
    id: RateClass['rateClassId'],
    payload: Partial<RateClass>,
  ): Promise<RateClass>;
  abstract deleteRateClass(id: RateClass['rateClassId']): Promise<void>;

  // RateType methods
  abstract createRateType(data: RateType): Promise<RateType>;
  abstract findRateTypeById(
    id: RateType['rateTypeId'],
  ): Promise<NullableType<RateType>>;
  abstract findRateTypeByCode(code: string): Promise<NullableType<RateType>>;
  abstract findRateTypesByRateClass(rateClassId: number): Promise<RateType[]>;
  abstract findAllRateTypes(): Promise<RateType[]>;
  abstract updateRateType(
    id: RateType['rateTypeId'],
    payload: Partial<RateType>,
  ): Promise<RateType>;
  abstract deleteRateType(id: RateType['rateTypeId']): Promise<void>;

  // RateCategory methods
  abstract createRateCategory(data: RateCategory): Promise<RateCategory>;
  abstract findRateCategoryById(
    id: RateCategory['rateCategoryId'],
  ): Promise<NullableType<RateCategory>>;
  abstract findRateCategoryByCode(
    code: string,
  ): Promise<NullableType<RateCategory>>;
  abstract findAllRateCategories(): Promise<RateCategory[]>;
  abstract updateRateCategory(
    id: RateCategory['rateCategoryId'],
    payload: Partial<RateCategory>,
  ): Promise<RateCategory>;
  abstract deleteRateCategory(
    id: RateCategory['rateCategoryId'],
  ): Promise<void>;

  // Rate methods
  abstract createRate(data: Rate): Promise<Rate>;
  abstract findRateById(id: Rate['rateId']): Promise<NullableType<Rate>>;
  abstract findRateByCode(code: string): Promise<NullableType<Rate>>;
  abstract findRatesByRateCard(rateCardId: number): Promise<Rate[]>;
  abstract findRatesByRateCategory(rateCategoryId: number): Promise<Rate[]>;
  abstract findAllRates(): Promise<Rate[]>;
  abstract updateRate(
    id: Rate['rateId'],
    payload: Partial<Rate>,
  ): Promise<Rate>;
  abstract deleteRate(id: Rate['rateId']): Promise<void>;

  // RateSeason methods
  abstract createRateSeason(data: RateSeason): Promise<RateSeason>;
  abstract findRateSeasonById(
    id: RateSeason['rateSeasonId'],
  ): Promise<NullableType<RateSeason>>;
  abstract findRateSeasonsByRate(rateId: number): Promise<RateSeason[]>;
  abstract findRateSeasonsBySeasonCode(
    seasonCode: string,
  ): Promise<RateSeason[]>;
  abstract findActiveRateSeasons(): Promise<RateSeason[]>;
  abstract findAllRateSeasons(): Promise<RateSeason[]>;
  abstract updateRateSeason(
    id: RateSeason['rateSeasonId'],
    payload: Partial<RateSeason>,
  ): Promise<RateSeason>;
  abstract deleteRateSeason(id: RateSeason['rateSeasonId']): Promise<void>;
}
