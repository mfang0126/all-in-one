export interface Result {
  uid: string;
  originalFilename: string;
  category: string;
  createdAt: string;
  text: string;
  timestamp: string;
  score?: number;
  status?: 'pending' | 'completed';
}
