import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/api-auth";
import { isMongoObjectIdString } from "@/lib/mongo-id";

export const runtime = "nodejs";

const patchSchema = z.object({
  weekday: z.coerce.number().int().min(1).max(7).optional(),
  title: z.string().min(1).max(200).optional(),
  sortOrder: z.coerce.number().int().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
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

  const { id } = await context.params;
  const existing = await prisma.weeklyHabit.findFirst({
    where: { id, userId },
  });
  if (!existing) {
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

  const habit = await prisma.weeklyHabit.update({
    where: { id },
    data: {
      ...(parsed.data.weekday !== undefined && { weekday: parsed.data.weekday }),
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
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
}

export async function DELETE(_request: Request, context: RouteContext) {
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

  const { id } = await context.params;
  const existing = await prisma.weeklyHabit.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.weeklyHabit.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
