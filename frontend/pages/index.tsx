import Head from "next/head";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { User } from "pages/api/user";
import { InferGetServerSidePropsType } from "next";
import { API_ENDPOINT, eventTypes } from "@/utils/metadata";
import { TEvent } from "@/utils/schema";
import Event from "../components/Event";
import useUser from "@/lib/useUser";
import fetchJson from "@/lib/fetchJson";
import EventTypeTag from "@/components/EventTypeTag";
import Header from "../components/Header";
import Modal from "@/components/Modal";

async function getEvents() {
  const req = `${API_ENDPOINT}/events`;
  const res = await fetch(req);
  return res.json();
}

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const { mutateUser } = useUser();

  const [events, setEvents] = useState<TEvent[]>();
  const [typeFilterList, setTypeFilterList] = useState<Set<string>>(new Set());
  const [filteredEvents, setFilteredEvents] = useState<TEvent[]>();
  const [searchParam, setSearchParam] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<TEvent>();
  const [showModal, setShowModal] = useState(false);

  async function logOut(event: { preventDefault: () => void; }) {
    event.preventDefault();
    mutateUser(
      await fetchJson("/api/logout", {method: "POST"}),
      false,
    );
    location.reload();
  }

  // updates filter list when event type tags are selected
  useEffect(() => {
    if(events) {
      setFilteredEvents([...events].filter((event) => {
        let match = false;
        typeFilterList.forEach((eventType) => {
          if(eventType === event.event_type) {
            match = true; // if it matches any one of them
          }
        })
        return match; 
      }));
    }
    
  }, [typeFilterList]);

  useEffect(() => {
    if(events) {
      setFilteredEvents([...events].filter((event) => {
        if(searchParam === "") { // base case when nothing is being searched
          return true;
        }
        const regExp = new RegExp(searchParam, 'gi'); // if the string appears anywhere in the event name, case insensitive
        const result = event.name.match(regExp);
        return result && result.length !== 0; // if found a match, then include it
      }))
    }
  }, [searchParam]);

  useEffect(() => {
    async function fetchEvents() {
      const fetchedEvents = (await getEvents()).sort((a: TEvent, b: TEvent) => {
        if (a.start_time < b.start_time) { // sort events by start time
          return -1;
        }
        return 1;
      });
      setEvents([...fetchedEvents]);
      setFilteredEvents([...fetchedEvents]);
    }
    fetchEvents();
  }, []);

  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <Header />
      <main className="min-h-screen w-full bg-gray-800 flex justify-center px-4 py-32 md:px-24">
        <div className="w-full sm:w-[798px] flex flex-col gap-y-4">
          <div className="text-gray-100 font-bold text-3xl sm:text-5xl py-1">Events</div>
          <div className="text-white flex flex-col">
            
            <p className="text-sm">Select tags below to filter by event type.</p>
            <div className="flex flex-col sm:flex-row justify-between py-4 gap-y-3">
              <div className="flex gap-x-4">
                {eventTypes.map((eventType, index) => {
                  return <EventTypeTag key={index} eventTypeName={eventType} setTypeFilterList={setTypeFilterList}/>
                  })
                }
              </div>

              <input 
                className="rounded-md p-2 text-neutral-800"
                placeholder="Search"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
              />

            </div>
          </div>

          {filteredEvents?.map((event, index) => {
              if (event.permission === "public" || user?.isLoggedIn) {
                return <Event event={event} 
                              isLoggedIn={user?.isLoggedIn} 
                              setShowModal={setShowModal}
                              setSelectedEvent={setSelectedEvent}
                              key={index}/>;
              }
            })}
          
          {showModal && selectedEvent && 
          <Modal 
            setShowModal={setShowModal}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}/>
          }

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
