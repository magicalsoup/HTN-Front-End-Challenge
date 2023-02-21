import Head from "next/head";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { User } from "pages/api/user";
import { InferGetServerSidePropsType } from "next";
import { API_ENDPOINT } from "@/utils/metadata";
import { TEvent } from "@/utils/schema";
import Event from "../components/Event";
import { useRouter } from "next/router";
import useUser from "@/lib/useUser";
import fetchJson from "@/lib/fetchJson";

async function getEvents() {
  const req = `${API_ENDPOINT}/events`;
  const res = await fetch(req);
  return res.json();
}


export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const router = useRouter();
  const { mutateUser } = useUser();

  async function logOut(event: { preventDefault: () => void; }) {
    event.preventDefault();
    mutateUser(
      await fetchJson("/api/logout", {method: "POST"}),
      false,
    );
    router.push("/");
  }

  const [events, setEvents] = useState<TEvent[]>();


  useEffect(() => {
    async function fetchEvents() {
      
      const fetchedEvents = (await getEvents()).sort((a: TEvent, b: TEvent) => {
        if (a.start_time < b.start_time) { // sort events by start time
          return -1;
        }
        return 1;
      });
      setEvents(fetchedEvents);
    }
    fetchEvents();
  }, []);

  return (
    <>
      <Head>
        <title>Schedule</title>
      </Head>
      <main className="h-min-screen w-full bg-gray-800 flex justify-center p-24">
        
        <div className="max-w-[798px] flex flex-col gap-y-4">
          <div className="text-gray-100 font-bold text-5xl">Hack the North but from wish</div>
          <div className="text-white flex flex-col">
            {user?.isLoggedIn && 
              <div>Welcome back hacker! <a className="text-sky-400 underline" href="/" onClick={logOut}>Log out</a>
              </div>}
            {!user?.isLoggedIn && 
              <p>Hmmm, you're not currently logged in, to see hidden events, please <a className="text-sky-400 underline" href="/login">log in.</a>
            </p>}
            <p>Click on events to learn more!</p>
            <div>
              <p>Filter events based on:</p>
            </div>
          </div>

          {events &&
            events.map((event, index) => {
              if (event.permission === "public" || user?.isLoggedIn) {
                return <Event event={event} isLoggedIn={user?.isLoggedIn} key={index}/>;
              }
            })}
        </div>
      </main>
    </>
  );
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
