import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/api-auth";
import { isMongoObjectIdString } from "@/lib/mongo-id";

export const runtime = "nodejs";

const dateKeyRegex = /^\d{4}-\d{2}-\d{2}$/;

const createSchema = z.object({
  weekday: z.coerce.number().int().min(1).max(7),
  title: z.string().min(1).max(200),
  sortOrder: z.coerce.number().int().optional(),
});

export async function GET(request: Request) {
  try {
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

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (
      !from ||
      !to ||
      !dateKeyRegex.test(from) ||
      !dateKeyRegex.test(to)
    ) {
      return NextResponse.json(
        { error: "Query params from and to (YYYY-MM-DD) are required" },
        { status: 400 }
      );
    }

    const habits: Prisma.WeeklyHabitGetPayload<{
      include: { completions: true };
    }>[] = await prisma.weeklyHabit.findMany({
      where: { userId },
      orderBy: [{ weekday: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        completions: {
          where: { dateKey: { gte: from, lte: to } },
        },
      },
    });

    return NextResponse.json({
      habits: habits.map((h) => ({
        id: h.id,
        weekday: h.weekday,
        title: h.title,
        sortOrder: h.sortOrder,
        createdAt: h.createdAt.toISOString(),
        completionDateKeys: h.completions.map((c) => c.dateKey),
      })),
    });
  } catch (e) {
    console.error("[weekly-habits GET]", e);
    return NextResponse.json(
      { error: "Server error loading weekly habits" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", detail: parsed.error.message },
        { status: 400 }
      );
    }

    const habit = await prisma.weeklyHabit.create({
      data: {
        userId,
        weekday: parsed.data.weekday,
        title: parsed.data.title,
        ...(parsed.data.sortOrder !== undefined && {
          sortOrder: parsed.data.sortOrder,
        }),
      },
    });

    return NextResponse.json({
      habit: {
        id: habit.id,
        weekday: habit.weekday,
        title: habit.title,
        sortOrder: habit.sortOrder,
        createdAt: habit.createdAt.toISOString(),
      },
    });
  } catch (e) {
    console.error("[weekly-habits POST]", e);
    return NextResponse.json(
      { error: "Server error creating habit" },
      { status: 500 }
    );
  }
}
