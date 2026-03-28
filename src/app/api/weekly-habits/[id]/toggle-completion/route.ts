import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/api-auth";
import { isMongoObjectIdString } from "@/lib/mongo-id";
import { isoWeekdayFromDateKey } from "@/lib/week-dates";

export const runtime = "nodejs";

const bodySchema = z.object({
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoObjectIdString(userId)) {
    return NextResponse.json(
      {
        error:
          "Your session is outdated. Please sign out and sign in again.",
      },
      { status: 401 }
    );
  }

  const { id: habitId } = await context.params;
  const habit = await prisma.weeklyHabit.findFirst({
    where: { id: habitId, userId },
  });
  if (!habit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { dateKey } = parsed.data;
  const dow = isoWeekdayFromDateKey(dateKey);
  if (dow !== habit.weekday) {
    return NextResponse.json(
      { error: "That date is not the scheduled weekday for this habit" },
      { status: 400 }
    );
  }

  const existing = await prisma.weeklyHabitCompletion.findUnique({
    where: {
      habitId_dateKey: { habitId, dateKey },
    },
  });

  if (existing) {
    await prisma.weeklyHabitCompletion.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ completed: false, dateKey });
  }

  await prisma.weeklyHabitCompletion.create({
    data: { habitId, dateKey },
  });
  return NextResponse.json({ completed: true, dateKey });
}
