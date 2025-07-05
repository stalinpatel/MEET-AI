import { auth } from "@/lib/auth";
import {
  MeetingIdView,
  MeetingIdViewLoading,
} from "@/modules/meetings/ui/views/meeting-id-view";
import { MeetingsViewError } from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{ meetingId: string }>;
}

const Page = async ({ params }: Props) => {
  const { meetingId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  //TODO PREFETCH  meetings.get

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingIdViewLoading />}>
          <ErrorBoundary fallback={<MeetingsViewError />}>
            <MeetingIdView meetingId={meetingId} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
