import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/api-auth";
import { serializeGoal } from "@/lib/goal-dto";
import { deriveGoalStatusFromStages } from "@/lib/goal-status";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  deadline: z.coerce.date(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: goalId } = await context.params;
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  await prisma.stage.create({
    data: {
      goalId,
      title: parsed.data.title,
      deadline: parsed.data.deadline,
    },
  });

  const updated = await prisma.goal.findFirstOrThrow({
    where: { id: goalId },
    include: { stages: { orderBy: { deadline: "asc" } } },
  });

  const syncedGoal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      status: deriveGoalStatusFromStages(updated.stages),
    },
    include: { stages: { orderBy: { deadline: "asc" } } },
  });

  return NextResponse.json({ goal: serializeGoal(syncedGoal) }, { status: 201 });
}
