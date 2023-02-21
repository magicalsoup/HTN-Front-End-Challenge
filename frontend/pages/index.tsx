import Head from 'next/head'
import { useEffect, useState } from "react";
import useUser from "@/lib/useUser";
import fetchJson, { FetchError } from "lib/fetchJson";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { User } from "pages/api/user";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from 'next/router';
export default function Home({user}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const router = useRouter();

  const { mutateUser } = useUser();
  
  async function logOut(event) {
    event.preventDefault();
    mutateUser(
      await fetchJson("/api/logout", {method: "POST"}),
      false,
    );
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Hack the North</title>
      </Head>
      <main className="h-screen w-full bg-gray-100 flex p-24">
        <div className="flex flex-col">
          <h1 className="text-xl text-coolGray-200 font-bold">Home</h1>

          {!user?.isLoggedIn && 
            <p>Hmmm, you're not currently logged in. 
              <a className="text-sky-400 underline" href="/login">Click here to log in.</a>
            </p>
          }

          {user?.isLoggedIn && 
            <div>
              <p>
                Welcome Hacker!!!
              </p>
              <button onClick={logOut}>Log out</button>
            </div>
          }

        </div>
        
      </main>
    </>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user === undefined) {
    return {
      props: {
        user: { isLoggedIn: false } as User,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
