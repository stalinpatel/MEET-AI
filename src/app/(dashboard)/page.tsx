import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import HomeView from "@/modules/home/ui/views/home-view";
import { redirect } from "next/navigation";
import { caller } from "@/trpc/server";

const Page = async () => {
  const data = await caller.hello({ text: "Stalin Server" });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div>
      <p>{data?.greeting}</p>
    </div>
  );
  return <HomeView />;
};

export default Page;
