export interface Notification {
  status: 'error' | 'success' | 'warning';
  title: string;
  description: string;
  duration?: number;
}
