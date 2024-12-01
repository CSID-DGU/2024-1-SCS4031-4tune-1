export type ReportResponse = {
  examName: string;
  totalCheatingCount: number;
  cheatingStudentsCount: number;
  averageCheatingCount: number;
  maxCheatingStudent: string;
  cheatingRate: number;
  cheatingTypeStatistics: {
    [key: string]: number;
  };
  peakCheatingTimeRange: string;
};
