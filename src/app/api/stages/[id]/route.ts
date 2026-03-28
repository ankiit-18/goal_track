import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/api-auth";
import { serializeGoal } from "@/lib/goal-dto";
import { syncGoalStatusWithStages } from "@/lib/sync-goal-status";

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  deadline: z.coerce.date().optional(),
  status: z.enum(["PENDING", "COMPLETED"]).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

async function getStageForUser(stageId: string, userId: string) {
  return prisma.stage.findFirst({
    where: { id: stageId, goal: { userId } },
    include: { goal: true },
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const stage = await getStageForUser(id, userId);
  if (!stage) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  await prisma.stage.update({
    where: { id },
    data: {
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.deadline !== undefined && {
        deadline: parsed.data.deadline,
      }),
      ...(parsed.data.status !== undefined && { status: parsed.data.status }),
    },
  });

  await syncGoalStatusWithStages(stage.goalId);

  const goal = await prisma.goal.findFirstOrThrow({
    where: { id: stage.goalId },
    include: { stages: { orderBy: { deadline: "asc" } } },
  });

  return NextResponse.json({ goal: serializeGoal(goal) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const stage = await getStageForUser(id, userId);
  if (!stage) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const goalId = stage.goalId;
  await prisma.stage.delete({ where: { id } });

  await syncGoalStatusWithStages(goalId);

  const goal = await prisma.goal.findFirstOrThrow({
    where: { id: goalId },
    include: { stages: { orderBy: { deadline: "asc" } } },
  });

  return NextResponse.json({ goal: serializeGoal(goal) });
}
