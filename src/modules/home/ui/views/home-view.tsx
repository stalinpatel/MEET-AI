"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function HomeView() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { signOut } = authClient;

  if (!session) {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <h1>Logged in as {session?.user?.name}</h1>
        <button
          className="p-2 bg-gray-600 rounded-xl border-1 border-blue-800 text-white"
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/sign-in"); // redirect to login page
                },
              },
            })
          }
        >
          Logout
        </button>
      </div>
    );
  }
}
