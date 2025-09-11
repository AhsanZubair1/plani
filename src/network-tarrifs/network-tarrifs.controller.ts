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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@src/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@src/utils/infinity-pagination';
import { networkTarrif } from './domain/network-tarrif';
import { FindAllnetworkTarrifsDto } from './dto/find-all-network-tarrifs.dto';
import { networkTarrifsService } from './network-tarrifs.service';
import { StatusCountNetworkTarrifsDto } from '@src/network-tarrifs/dto/status-count.dto';

@ApiTags('NetworkTarrifs')
@Controller({
  path: 'network-tarrifs',
  version: '1',
})
export class networkTarrifsController {
  constructor(private readonly networkTarrifsService: networkTarrifsService) {}

  @Get('status/count')
  @ApiOperation({
    summary: 'Get network tarrifs status counts (active, inactive, solar)',
  })
  @ApiResponse({
    status: 200,
    description: 'Network tarrifs status counts retrieved successfully',
    type: StatusCountNetworkTarrifsDto,
  })
  async getStatusCount(): Promise<StatusCountNetworkTarrifsDto> {
    return await this.networkTarrifsService.getStatusCount();
  }

  @Get('filter/options')
  @ApiOperation({
    summary: 'Get network tarrifs filter options',
  })
  @ApiResponse({
    status: 200,
    description: 'Network tarrifs filter options retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        retailTarrifs: { type: 'array', items: { type: 'string' } },
        distributors: { type: 'array', items: { type: 'string' } },
        markets: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async getFilterOptions(): Promise<{
    retailTarrifs: string[];
    distributors: string[];
    markets: string[];
  }> {
    return await this.networkTarrifsService.getFilterOptions();
  }

  @Get()
  @ApiOperation({
    summary: 'Get network tarrifs status counts (active, inactive, solar)',
  })
  @ApiResponse({
    status: 200,
    description: 'Network tarrifs status counts retrieved successfully',
    type: StatusCountNetworkTarrifsDto,
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
}
