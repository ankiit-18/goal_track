type StageLike = {
  status: string;
};

export function deriveGoalStatusFromStages(stages: StageLike[]) {
  if (stages.length === 0) return "ACTIVE";
  const allCompleted = stages.every((stage) => stage.status === "COMPLETED");
  return allCompleted ? "COMPLETED" : "ACTIVE";
}
