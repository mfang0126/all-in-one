export interface Result {
  uid: string;
  originalFilename: string;
  category: string;
  createdAt: string;
  text: string;
  timestamp: string;
  score: {
    standard: number;
    accuracy: number;
    fluency: number;
    integrity: number;
    total: number;
  };
  status?: 'pending' | 'completed';
}
