// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreatenetworkTarrifDto } from './create-network-tarrif.dto';

export class UpdatenetworkTarrifDto extends PartialType(
  CreatenetworkTarrifDto,
) {}
