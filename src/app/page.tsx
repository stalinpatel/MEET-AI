"use client"
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session } = authClient.useSession() 
  const router = useRouter()
  const {signUp,signOut} = authClient;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async() => { 
    const res = await signUp.email({ email, name, password }, {
      onRequest: (ctx) => {
        console.log("Ctx :",ctx)
      },
      onSuccess: (ctx) => {
        window.alert("Success")
        console.log("Ctx :",ctx)
      },
      onError: (ctx) => {
        console.error("Something went wrong : " + ctx.error.message);
        window.alert("Something went wrong : " + ctx.error.message);
      }
    },
    )
    console.log("Res.data:",res.data)
  }
  
  if(session)
  {
    return (
      <div className="flex flex-col p-4 gap-y-4"> 
        <h1>Logged in as {session?.user?.name}</h1>
        <button
          className="p-2 bg-gray-600 rounded-xl border-1 border-blue-800 text-white"
          onClick={() => signOut({
            fetchOptions: {
            onSuccess: () => {
            router.push("/"); // redirect to login page
            },  
          },
          })}>
          Logout
        </button>
      </div>
    )
  }
  
  
  return (
    <div className="p-4 flex flex-col gap-y-4">
    <Input placeholder="name" value={name} onChange={((e)=>setName(e.target.value))}/>
    <Input placeholder="email" value={email} onChange={((e)=>setEmail(e.target.value))}/>
    <Input placeholder="password" value={password} onChange={((e)=>setPassword(e.target.value))}/>
    <Button onClick={onSubmit}>
        Create User
    </Button>
    </div>
  );  
}
