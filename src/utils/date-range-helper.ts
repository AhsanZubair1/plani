export function getDateRangeConfig(range: 'week' | 'month' | 'year'): {
  dateTruncFormat: string;
  interval: string;
  labelFormat: string;
  seriesRange: string;
} {
  switch (range) {
    case 'week':
      return {
        dateTruncFormat: 'day',
        interval: '1 day',
        labelFormat: 'YYYY-MM-DD',
        seriesRange: 'week',
      };
    case 'month':
      return {
        dateTruncFormat: 'day',
        interval: '1 day',
        labelFormat: 'YYYY-MM-DD',
        seriesRange: 'month',
      };
    case 'year':
      return {
        dateTruncFormat: 'month',
        interval: '1 month',
        labelFormat: 'YYYY-MM',
        seriesRange: 'year',
      };
    default:
      throw new Error('Invalid date range');
  }
}
