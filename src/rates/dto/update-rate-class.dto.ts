import { PartialType } from '@nestjs/swagger';

import { CreateRateClassDto } from './create-rate-class.dto';

export class UpdateRateClassDto extends PartialType(CreateRateClassDto) {}
