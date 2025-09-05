import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
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

import { networkTarrif } from './domain/network-tarrif';
import { CreatenetworkTarrifDto } from './dto/create-network-tarrif.dto';
import { FindAllnetworkTarrifsDto } from './dto/find-all-network-tarrifs.dto';
import { UpdatenetworkTarrifDto } from './dto/update-network-tarrif.dto';
import { networkTarrifsService } from './network-tarrifs.service';

@ApiTags('Networktarrifs')
@Controller({
  path: 'network-tarrifs',
  version: '1',
})
export class networkTarrifsController {
  constructor(private readonly networkTarrifsService: networkTarrifsService) {}

  @Post()
  @ApiCreatedResponse({
    type: networkTarrif,
  })
  create(@Body() createnetworkTarrifDto: CreatenetworkTarrifDto) {
    return this.networkTarrifsService.create(createnetworkTarrifDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(networkTarrif),
  })
  async findAll(
    @Query() query: FindAllnetworkTarrifsDto,
  ): Promise<InfinityPaginationResponseDto<networkTarrif>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.networkTarrifsService.findAllWithPagination({
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
    return this.networkTarrifsService.findOne(parseInt(id));
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: networkTarrif,
  })
  update(
    @Param('id') id: string,
    @Body() updatenetworkTarrifDto: UpdatenetworkTarrifDto,
  ) {
    return this.networkTarrifsService.update(
      parseInt(id),
      updatenetworkTarrifDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.networkTarrifsService.remove(parseInt(id));
  }
}
