export class Log {
  id: number;
  method: string;
  url: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  status_code: number;
  response_time_ms: number;
  request_body: string | null;
  response_body: string | null;
  error_message?: string;
  controller?: string;
  action?: string;
  created_at: Date;
}
