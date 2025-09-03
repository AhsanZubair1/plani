// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateretailTariffsDto } from './create-retail-tariffs.dto';

export class UpdateretailTariffsDto extends PartialType(
  CreateretailTariffsDto,
) {}
