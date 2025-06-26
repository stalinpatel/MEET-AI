import { db } from "@/db";
import { agents } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
// import { sleep } from "@/lib/utils";
// import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agents);

    // await sleep(5000);
    // throw new TRPCError({ code: "BAD_REQUEST" });

    return data;
  }),
});
