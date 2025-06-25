"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function HomeView() {
  const trpc = useTRPC();
  const { data: helloData } = useQuery(
    trpc.hello.queryOptions({ text: "Stalin" })
  );
  const { data: gdbyData } = useQuery(
    trpc.goodbye.queryOptions({ text: "Milan" })
  );
  return (
    <div className="flex flex-col p-4 gap-y-4">
      <div>{helloData?.greeting}</div>
      <div>{gdbyData?.farewell}</div>
    </div>
  );
}
