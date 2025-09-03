import { PartialType } from '@nestjs/swagger';

import { CreateRateCategoryDto } from './create-rate-category.dto';

export class UpdateRateCategoryDto extends PartialType(CreateRateCategoryDto) {}
