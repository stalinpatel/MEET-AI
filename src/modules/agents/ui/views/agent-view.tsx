"use client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EmptyState } from "../components/empty-state";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  if (data.length === 0) {
    return (
      <div className="container mx-auto py-2 flex-1 px-4 md:px-8 flex flex-col gap-y-2">
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instruction and can interact with participants during the call "
        />
      </div>
    );
  }
  return (
    <div className="container mx-auto py-10 flex-1 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take few seconds"
    />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong"
    />
  );
};
