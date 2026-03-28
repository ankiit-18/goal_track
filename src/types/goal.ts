export type SerializedStage = {
  id: string;
  title: string;
  deadline: string;
  status: string;
};

export type SerializedGoal = {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  stages: SerializedStage[];
  createdAt: string;
  updatedAt: string;
};
