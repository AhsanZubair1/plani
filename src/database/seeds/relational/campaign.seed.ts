import { DataSource } from 'typeorm';

import { CampaignEntity } from '@src/campaigns/infrastructure/persistence/relational/entities/campaign.entity';
import { CampaignStatusEntity } from '@src/campaigns/infrastructure/persistence/relational/entities/campaign-status.entity';
import { ChannelEntity } from '@src/campaigns/infrastructure/persistence/relational/entities/channel.entity';
import { CampaignChannelRelnEntity } from '@src/campaigns/infrastructure/persistence/relational/entities/campaign-channel-reln.entity';
import { CampaignPlanRelnEntity } from '@src/campaigns/infrastructure/persistence/relational/entities/campaign-plan-reln.entity';

export async function seedCampaignData(dataSource: DataSource): Promise<void> {
  const campaignStatusRepository =
    dataSource.getRepository(CampaignStatusEntity);
  const channelRepository = dataSource.getRepository(ChannelEntity);
  const campaignRepository = dataSource.getRepository(CampaignEntity);
  const campaignChannelRelnRepository = dataSource.getRepository(
    CampaignChannelRelnEntity,
  );
  const campaignPlanRelnRepository = dataSource.getRepository(
    CampaignPlanRelnEntity,
  );

  // Clear existing data
  await campaignPlanRelnRepository.delete({});
  await campaignChannelRelnRepository.delete({});
  await campaignRepository.delete({});
  await channelRepository.delete({});
  await campaignStatusRepository.delete({});

  // Seed campaign statuses
  const campaignStatuses = [
    { campaign_status_code: 'DRAFT', campaign_status_name: 'Draft' },
    { campaign_status_code: 'ACTIVE', campaign_status_name: 'Active' },
    { campaign_status_code: 'EXPIRED', campaign_status_name: 'Expired' },
  ];

  const savedStatuses = await campaignStatusRepository.save(campaignStatuses);

  // Seed channels
  const channels = [
    { channel_code: 'ISELECT', channel_name: 'iSelect', active: true },
    { channel_code: 'MEERKATS', channel_name: 'Meerkats', active: true },
    {
      channel_code: 'MARKET_COMP',
      channel_name: 'Compare the Market',
      active: true,
    },
    { channel_code: 'CHOICE', channel_name: 'Choice', active: false },
  ];

  const savedChannels = await channelRepository.save(channels);

  // Seed campaigns
  const campaigns = [
    {
      campaign_code: 'BLACK_2025',
      campaign_name: 'Black Friday 2025',
      campaign_desc: 'Yearly black friday sale',
      effective_from: new Date('2025-02-05'),
      effective_to: new Date('2025-03-06'),
      campaign_status_id: savedStatuses[2].campaign_status_id, // EXPIRED
    },
    {
      campaign_code: 'MARKET_2025',
      campaign_name: 'Market Offers 2025',
      campaign_desc: null,
      effective_from: new Date('2025-01-01'),
      effective_to: new Date('2025-12-31'),
      campaign_status_id: savedStatuses[1].campaign_status_id, // ACTIVE
    },
    {
      campaign_code: 'MARKET_2026',
      campaign_name: 'Market Offers 2026',
      campaign_desc: null,
      effective_from: new Date('2026-01-01'),
      effective_to: new Date('2026-12-31'),
      campaign_status_id: savedStatuses[0].campaign_status_id, // DRAFT
    },
  ];

  const savedCampaigns = await campaignRepository.save(campaigns);

  // Seed campaign-channel relationships
  const campaignChannelRelns = [
    {
      campaign_id: savedCampaigns[0].campaign_id, // BLACK_2025
      channel_id: savedChannels[0].channel_id, // iSelect
      effective_from: new Date('2025-02-05'),
      effective_to: new Date('2025-03-06'),
    },
    {
      campaign_id: savedCampaigns[1].campaign_id, // MARKET_2025
      channel_id: savedChannels[0].channel_id, // iSelect
      effective_from: new Date('2025-02-21'),
      effective_to: new Date('2025-12-31'),
    },
    {
      campaign_id: savedCampaigns[1].campaign_id, // MARKET_2025
      channel_id: savedChannels[1].channel_id, // Meerkats
      effective_from: new Date('2025-06-03'),
      effective_to: new Date('2025-12-31'),
    },
    {
      campaign_id: savedCampaigns[0].campaign_id, // BLACK_2025
      channel_id: savedChannels[2].channel_id, // Compare the Market
      effective_from: new Date('2025-02-05'),
      effective_to: new Date('2025-03-06'),
    },
    {
      campaign_id: savedCampaigns[1].campaign_id, // MARKET_2025
      channel_id: savedChannels[2].channel_id, // Compare the Market
      effective_from: new Date('2025-01-01'),
      effective_to: new Date('2025-12-31'),
    },
    {
      campaign_id: savedCampaigns[2].campaign_id, // MARKET_2026
      channel_id: savedChannels[2].channel_id, // Compare the Market
      effective_from: new Date('2026-01-01'),
      effective_to: new Date('2026-12-31'),
    },
    {
      campaign_id: savedCampaigns[0].campaign_id, // BLACK_2025
      channel_id: savedChannels[3].channel_id, // Choice
      effective_from: new Date('2025-02-05'),
      effective_to: new Date('2025-03-06'),
    },
    {
      campaign_id: savedCampaigns[1].campaign_id, // MARKET_2025
      channel_id: savedChannels[3].channel_id, // Choice
      effective_from: new Date('2025-01-01'),
      effective_to: new Date('2025-04-25'),
    },
  ];

  await campaignChannelRelnRepository.save(campaignChannelRelns);

  // Seed campaign-plan relationships
  const campaignPlanRelns = [
    { campaign_id: savedCampaigns[0].campaign_id, plan_id: 1 }, // BLACK_2025 -> plan 1
    { campaign_id: savedCampaigns[0].campaign_id, plan_id: 2 }, // BLACK_2025 -> plan 2
    { campaign_id: savedCampaigns[0].campaign_id, plan_id: 3 }, // BLACK_2025 -> plan 3
    { campaign_id: savedCampaigns[0].campaign_id, plan_id: 4 }, // BLACK_2025 -> plan 4
    { campaign_id: savedCampaigns[1].campaign_id, plan_id: 1 }, // MARKET_2025 -> plan 1
    { campaign_id: savedCampaigns[1].campaign_id, plan_id: 2 }, // MARKET_2025 -> plan 2
    { campaign_id: savedCampaigns[1].campaign_id, plan_id: 3 }, // MARKET_2025 -> plan 3
    { campaign_id: savedCampaigns[1].campaign_id, plan_id: 4 }, // MARKET_2025 -> plan 4
    { campaign_id: savedCampaigns[1].campaign_id, plan_id: 5 }, // MARKET_2025 -> plan 5
    { campaign_id: savedCampaigns[1].campaign_id, plan_id: 6 }, // MARKET_2025 -> plan 6
  ];

  await campaignPlanRelnRepository.save(campaignPlanRelns);

  console.log('Campaign data seeded successfully');
}
