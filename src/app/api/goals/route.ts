import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/api-auth";
import { serializeGoal } from "@/lib/goal-dto";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.enum(["ACTIVE", "COMPLETED"]).optional(),
});

export async function GET() {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const goals = await prisma.goal.findMany({
    where: { userId },
    include: { stages: { orderBy: { deadline: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ goals: goals.map(serializeGoal) });
}

export async function POST(request: Request) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const { title, description, startDate, endDate, status } = parsed.data;
  const start = startDate;
  const end = endDate;
  if (end < start) {
    return NextResponse.json(
      { error: "End date must be on or after start date" },
      { status: 400 }
    );
  }

  const goal = await prisma.goal.create({
    data: {
      userId,
      title,
      description: description ?? null,
      startDate: start,
      endDate: end,
      status: status ?? "ACTIVE",
    },
    include: { stages: true },
  });

  return NextResponse.json({ goal: serializeGoal(goal) }, { status: 201 });
}
