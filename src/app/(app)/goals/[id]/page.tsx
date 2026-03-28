import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { serializeGoal } from "@/lib/goal-dto";
import { GoalDetail } from "./GoalDetail";

type PageProps = { params: Promise<{ id: string }> };

export default async function GoalPage(props: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await props.params;
  const goal = await prisma.goal.findFirst({
    where: { id, userId: session.userId },
    include: { stages: { orderBy: { deadline: "asc" } } },
  });

  if (!goal) notFound();

  return <GoalDetail initial={serializeGoal(goal)} />;
}
