export interface Task {
  id: number;
  title: string;
  status: 'awaiting' | 'in-progress' | 'completed';
  teamId: number;
  // any other fields your API returns...
}
