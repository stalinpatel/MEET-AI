import { db } from "@/db";
import { agents } from "@/db/schema";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { eq } from "drizzle-orm";
// import { sleep } from "@/lib/utils";
// import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id));

      return existingAgent;
    }),
  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);

    // await sleep(5000);
    // throw new TRPCError({ code: "BAD_REQUEST" });

    return data;
  }),
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { auth } = ctx;
      const [createdAgent] = await db
        .insert(agents)
        .values({ ...input, userId: auth.user.id })
        .returning();
      return createdAgent;
    }),
});
