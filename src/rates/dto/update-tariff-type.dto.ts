import { PartialType } from '@nestjs/swagger';

import { CreateTariffTypeDto } from './create-tariff-type.dto';

export class UpdateTariffTypeDto extends PartialType(CreateTariffTypeDto) {}
