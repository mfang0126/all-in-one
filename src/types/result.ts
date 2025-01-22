export interface Result {
  uid: string;
  originalFilename: string;
  category: string;
  createdAt: string;
  text: string;
  timestamp: string;
  scores?: {
    standard: {
      calculatedScore: number;
      type: 'standard';
      normalizedScore: number;
      confidence: 'low' | 'medium' | 'high';
    };
    detailed: {
      normalizedScore: number;
      confidence: 'low' | 'medium' | 'high';
      contentsScore: number;
      calculatedScore: number;
      type: 'detailed';
      fluencyScore: number;
      pronunciationScore: number;
    };
  };
  status?: 'pending' | 'completed';
}
