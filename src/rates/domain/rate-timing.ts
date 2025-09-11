export class RateTiming {
  rateTimingId: number;
  planId: number;
  timingName: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  season: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
