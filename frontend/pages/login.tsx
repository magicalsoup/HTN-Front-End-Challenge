import Head from "next/head"
import { useState } from "react"
import useUser from "@/lib/useUser";
import fetchJson, { FetchError } from "lib/fetchJson";
export default function Login() {

    const { mutateUser } = useUser({
      redirectTo: "/schedule",
      redirectIfFound: true,
    })

    const [errorMsg, setErrorMsg] = useState(""); // TODO fix 

    async function handleSubmit (event) { // TODO specify type
      event.preventDefault();

      const body = {
        username: event.currentTarget.username.value,
        password: event.currentTarget.password.value,
      }

      try {
        mutateUser(
          await fetchJson("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
          false,
        );
      } catch(error) {
        if(error instanceof FetchError) {
          setErrorMsg(error.data.message);
        } else {
          console.log(`An unexpected error happend: ${error}`);
        }
      } 
    }
    
    // Maybe make the form into a component
    return (
        <>
        <Head>
          <title>Login</title>
        </Head>
        <main className="h-screen w-full bg-gray-100 flex justify-center p-24">
          <div className="flex flex-col gap-y-4">
            <h1 className="font-bold text-coolGray-200 text-xl">Log in to Hack the North</h1>
            <form onSubmit={handleSubmit} id = "userform" >
                    <div className = "grid gap-y-4 grid-cols-2 p-2">
                        <p className = "flex p-2 items-start">Username:</p>
                            <input 
                                className = "p-2 w-full border-2 border-gray-300 rounded-xl"
                                type = "text"
                                name="username"
                            />
                        <p className = "flex p-2 items-start text-left ">Password:</p>
                        <input 
                            className = "p-2 w-full border-2 border-gray-300 rounded-xl flex-grow"
                            type = "password"
                            name="password"
                        />
                    </div>
                    <div className = "flex flex-row space-x-10">
                        <input
                            className = "flex flex-grow object-none object-right justify-center bg-indigo-500 hover:bg-indigo-700 rounded x2 text-white p-2"
                            type="submit"
                            value="Login"
                            form="userform"
                        />
                    </div>        
                </form>
              </div>
        </main>
      </>
    )
}