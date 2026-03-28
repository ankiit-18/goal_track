import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/api-auth";
import { isMongoObjectIdString } from "@/lib/mongo-id";

export const runtime = "nodejs";

const createSchema = z.object({
  weekday: z.coerce.number().int().min(1).max(7),
  title: z.string().min(1).max(200),
  sortOrder: z.coerce.number().int().optional(),
});

const dateKeyRegex = /^\d{4}-\d{2}-\d{2}$/;

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

    const habits = await prisma.weeklyHabit.findMany({
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
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const account = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!account) {
      return NextResponse.json(
        { error: "Account not found. Please sign in again." },
        { status: 401 }
      );
    }

    const weekday = Math.trunc(parsed.data.weekday);
    const sortOrder = Math.trunc(parsed.data.sortOrder ?? 0);

    const habit = await prisma.weeklyHabit.create({
      data: {
        weekday,
        title: parsed.data.title.trim(),
        sortOrder,
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(
      {
        habit: {
          id: habit.id,
          weekday: habit.weekday,
          title: habit.title,
          sortOrder: habit.sortOrder,
          createdAt: habit.createdAt.toISOString(),
          completionDateKeys: [] as string[],
        },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("[weekly-habits POST]", e);
    const detail =
      process.env.NODE_ENV === "development" && e instanceof Error
        ? e.message
        : undefined;
    return NextResponse.json(
      {
        error: "Server error creating weekly habit",
        ...(detail ? { detail } : {}),
      },
      { status: 500 }
    );
  }
}
