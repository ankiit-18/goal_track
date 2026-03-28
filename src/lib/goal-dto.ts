import type { Goal, Stage } from "@prisma/client";
import { goalProgressPercent } from "./progress";

export type GoalWithStages = Goal & { stages: Stage[] };

export function serializeGoal(g: GoalWithStages) {
  const progress = goalProgressPercent(g.stages);
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    startDate: g.startDate.toISOString(),
    endDate: g.endDate.toISOString(),
    status: g.status,
    progress,
    stages: g.stages.map((s) => ({
      id: s.id,
      title: s.title,
      deadline: s.deadline.toISOString(),
      status: s.status,
    })),
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  };
}
