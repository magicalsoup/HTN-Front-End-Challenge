import Head from "next/head"
import useUser from "@/lib/useUser";
import fetchJson, { FetchError } from "lib/fetchJson";
import { DEMO_PASSWORD, DEMO_USERNAME } from "@/utils/login";
import { useState } from "react";
export default function Login() {

    const { mutateUser } = useUser({
      redirectTo: "/",
      redirectIfFound: true,
    })

    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit (event : any) { 
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
          setErrorMessage(error.data.message);
        }
        else {
          console.log("Something unexpected occured", error);
        }
      } 
    }

    // Maybe make the form into a component
    // TODO add logo
    return (
        <>
        <Head>
          <title>Login</title>
        </Head>
        <main className="h-screen w-full bg-gray-800 flex justify-center p-24">
          <div className="flex flex-col gap-y-4 max-w-xl">
            <h1 className="font-bold text-gray-100 text-4xl text-center">Welcome Back Hacker!</h1>
            <p className="text-gray-400 text-lg text-center">Dream big and build amazing things at Canada's largest hackathon.</p>
            <form onSubmit={handleSubmit} id="userform">
                    <div className = "flex flex-col py-8">
                        <p className = "flex py-2 text-gray-400 text-lg">Username:</p>
                        <input 
                            className = "p-2 w-full border-2 border-gray-300 rounded-xl"
                            type = "text"
                            name="username"
                        />
                        <p className = "flex py-2 text-gray-400 text-lg">Password:</p>
                        <input 
                            className = "p-2 w-full border-2 border-gray-300 rounded-xl"
                            type = "password"
                            name="password"
                        />
                    </div>
                    <div className = "flex flex-row space-x-10">
                        <input
                            className = "flex flex-grow object-none object-right justify-center bg-sky-400 hover:bg-sky-500 hover:cursor-pointer rounded text-white p-2 font-bold"
                            type="submit"
                            value="Login to Hack the North"
                            form="userform"
                        />
                    </div>     
                    {errorMessage !== "" && 
                      <span className="py-2 text-red-400">{errorMessage}</span>}   
                </form>
                <div className="flex flex-col text-gray-400">
                  <p>Demo username: {DEMO_USERNAME}</p>
                  <p>Demo password: {DEMO_PASSWORD}</p>
                </div>
              </div>
        </main>
      </>
    )
}