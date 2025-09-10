import { PartialType } from '@nestjs/swagger';

import { CreateRateBlockDto } from './create-rate-block.dto';

export class UpdateRateBlockDto extends PartialType(CreateRateBlockDto) {}
