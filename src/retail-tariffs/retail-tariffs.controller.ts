import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@src/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@src/utils/infinity-pagination';

import { retailTariffs } from './domain/retail-tariffs';
import { CreateretailTariffsDto } from './dto/create-retail-tariffs.dto';
import { FindAllretailTariffsDto } from './dto/find-all-retail-tariffs.dto';
import { UpdateretailTariffsDto } from './dto/update-retail-tariffs.dto';
import { retailTariffsService } from './retail-tariffs.service';

@ApiTags('Retailtariffs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'retail-tariffs',
  version: '1',
})
export class retailTariffsController {
  constructor(private readonly retailTariffsService: retailTariffsService) {}

  @Post()
  @ApiCreatedResponse({
    type: retailTariffs,
  })
  create(@Body() createretailTariffsDto: CreateretailTariffsDto) {
    return this.retailTariffsService.create(createretailTariffsDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(retailTariffs),
  })
  async findAll(
    @Query() query: FindAllretailTariffsDto,
  ): Promise<InfinityPaginationResponseDto<retailTariffs>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.retailTariffsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string) {
    return this.retailTariffsService.findOne(parseInt(id));
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: retailTariffs,
  })
  update(
    @Param('id') id: string,
    @Body() updateretailTariffsDto: UpdateretailTariffsDto,
  ) {
    return this.retailTariffsService.update(
      parseInt(id),
      updateretailTariffsDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.retailTariffsService.remove(parseInt(id));
  }
}
