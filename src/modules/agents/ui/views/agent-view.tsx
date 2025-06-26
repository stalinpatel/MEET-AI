"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
// import { useQuery } from "@tanstack/react-query";
// import { ErrorState } from "@/components/error-state";
// import { LoadingState } from "@/components/loading-state";

export const AgentsView = () => {
  const trpc = useTRPC();
  //   const { data, isLoading, isError } = useQuery(
  //     trpc.agents.getMany.queryOptions()
  //   );

  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  //   if (isLoading) {
  //     return (
  //       <LoadingState
  //         title="Loading Agents"
  //         description="This may take few seconds"
  //       />
  //     );
  //   }
  //   if (isError) {
  //     return (
  //       <ErrorState
  //         title="Error Loading Agents"
  //         description="Something went wrong"
  //       />
  //     );
  //   }

  return <div>{JSON.stringify(data, null, 2)}</div>;
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
