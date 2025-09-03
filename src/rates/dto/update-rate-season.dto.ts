import { PartialType } from '@nestjs/swagger';
import { CreateRateSeasonDto } from './create-rate-season.dto';

export class UpdateRateSeasonDto extends PartialType(CreateRateSeasonDto) {}
