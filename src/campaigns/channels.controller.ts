import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

import { CampaignsService } from './campaigns.service';
import { ChannelAuditService } from './services/channel-audit.service';

@ApiTags('Channels')
@Controller({
  path: 'channels',
  version: '1',
})
export class ChannelsController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly channelAuditService: ChannelAuditService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all channels with campaigns' })
  getChannels(): Promise<any> {
    return this.campaignsService.getChannelsWithCampaigns();
  }

  @Put(':id/active')
  @ApiOperation({ summary: 'Update channel active status' })
  @ApiParam({ name: 'id', type: 'number', description: 'Channel ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        active: { type: 'boolean' },
        userId: { type: 'string' },
        userName: { type: 'string' },
      },
      required: ['active'],
    },
  })
  async updateChannelActiveStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { active: boolean; userId?: string; userName?: string },
  ): Promise<any> {
    const updatedChannel =
      await this.channelAuditService.updateChannelActiveStatus(
        id,
        body.active,
        body.userId,
        body.userName,
      );

    return {
      message: 'Channel active status updated successfully',
      channel: {
        channelId: updatedChannel.channel_id,
        channelCode: updatedChannel.channel_code,
        channelName: updatedChannel.channel_name,
        active: updatedChannel.active,
        updatedAt: updatedChannel.updated_at,
      },
    };
  }
}
