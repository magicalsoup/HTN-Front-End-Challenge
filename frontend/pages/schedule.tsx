import Head from "next/head";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { User } from "pages/api/user";
import { InferGetServerSidePropsType } from "next";
import { API_ENDPOINT } from "@/data/metadata";
import { convertUnixTimeStampToDate } from "@/lib/convertTime";

type TEventType = "workshop" | "activity" | "tech_talk";
type TPermission = "public" | "private";

type TSpeaker = {
  name: string;
};

// The information for an event will look like so
export type TEvent = {
  id: number;
  name: string;
  event_type: TEventType;
  permission?: TPermission;

  start_time: number; // unix timestamp (ms)
  end_time: number; // unix timestamp (ms)

  description?: string; // a paragraph describing the event
  speakers: TSpeaker[]; // a list of speakers for the event

  public_url?: string; // a url to display for the general public
  private_url: string; // a url to display for hackers
  related_events: number[]; // a list ids corresponding to related events
};

// What the endpoints will return
export type TEndpointResponse = TEvent | TEvent[];

export default function Home({user}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [events, setEvents] = useState<TEvent[]>();

    async function getEvents() {
        const req = `${API_ENDPOINT}/events`;
        const res = await fetch(req);
        return res.json();
    }
    useEffect(() => {
        async function fetchEvents() {
            const fetchedEvents = (await getEvents()).sort((a:TEvent, b:TEvent) => {
                if(a.start_time < b.start_time) {
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
            <main>
                <div>
                    {events && events.map((event, index) => {
                        if(event.permission === "public" || user?.isLoggedIn) {
                            return (
                                <div key={index}>
                                    <h1>{event.name}</h1>
                                    <h1>{event.permission}</h1>
                                    <h1>{convertUnixTimeStampToDate(event.start_time)}</h1>
                                    <h1>{event.public_url}</h1>
                                    <h1>{event.private_url}</h1>
                                </div>
                            )
                        }
                    })}
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