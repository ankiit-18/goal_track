import { prisma } from "./prisma";

/** True when the goal has stages and every one is completed (matches DB sync rules). */
export function isGoalFullyCompleteFromStages(
  stages: { status: string }[]
): boolean {
  return stages.length > 0 && stages.every((s) => s.status === "COMPLETED");
}

/**
 * When every stage is COMPLETED, set goal to COMPLETED; otherwise ACTIVE.
 * If there are no stages, keep the goal ACTIVE (not “completed” with nothing to do).
 */
export async function syncGoalStatusWithStages(goalId: string) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: { stages: true },
  });
  if (!goal) return;

  if (goal.stages.length === 0) {
    if (goal.status === "COMPLETED") {
      await prisma.goal.update({
        where: { id: goalId },
        data: { status: "ACTIVE" },
      });
    }
    return;
  }

  const allCompleted = isGoalFullyCompleteFromStages(goal.stages);
  const target = allCompleted ? "COMPLETED" : "ACTIVE";

  if (goal.status !== target) {
    await prisma.goal.update({
      where: { id: goalId },
      data: { status: target },
    });
  }
}
