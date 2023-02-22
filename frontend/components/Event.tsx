import { TEvent } from "@/utils/schema";
import { formatUnixTimeStamp } from "@/lib/format";
import { useState, useEffect } from "react";
import { API_ENDPOINT } from "@/utils/metadata";
import Link from "next/link";

async function getEvent(id: number) : Promise<TEvent> {
    const req = `${API_ENDPOINT}/events/${id}`;
    const res = await fetch(req);
    return res.json();
}

export default function Event({
  event,
  isLoggedIn,
}: {
  event: TEvent;
  isLoggedIn: boolean | undefined;
}) {
  
  const [ showDetails, setShowDetails ] = useState(false);
  const [ relatedEvents, setRelatedEvents ] = useState<TEvent[] | undefined[]>();
  const tagColors = ["bg-red-400", "bg-orange-400", "bg-purple-400"]; // in tailwind styles for consistency
  const eventTypes= ["workshop", "activity", "tech_talk"]; // redudant but workaround for tailwind sync issues

  useEffect(() => {
    async function fetchRelatedEvents() {
        // admittedly, this could get slow if there are a ton of related events, but should be very unlikely
        const fetchedEvents = await 
              (await Promise.all(event.related_events
              .map(async (id) => (await getEvent(id)))))
              .filter((event) => (event.permission === "public" || isLoggedIn)); // make sure related events are visible in accordance if the user is logged in or not
        setRelatedEvents(fetchedEvents);
    }
    fetchRelatedEvents();
  }, []);

  return (
    <div className="flex flex-col bg-stone-300 px-16 py-8 rounded-md hover:cursor-pointer" id={`event-${event.id}`}>
      <div onClick={() => setShowDetails(!showDetails)} className="flex flex-col gap-y-4">
        <div className="py-2" >
            <div className="flex justify-between">
                <h1 className="text-xl font-bold text-neutral-800">{event.name}</h1>
                <div className={`${tagColors[eventTypes.indexOf(event.event_type)]} rounded-md p-2`}>
                  {event.event_type.replace("_", " ")}
                </div>
            </div>
            <h1>
                {formatUnixTimeStamp(event.start_time)} to {formatUnixTimeStamp(event.end_time)}
            </h1>
            {event.speakers.length !== 0 && 
                <p>Speakers: {event.speakers.map((speaker) => speaker.name).join(",")}</p>
            }
        </div>
        <p className="text-gray-700">{event.description}</p>
      </div>
      { showDetails && 
        <div className="flex flex-col py-4">
            <Link href={isLoggedIn? event.private_url : event.private_url} target="_blank"> 
                <p className="w-full text-center p-2 bg-sky-400 rounded-md text-white font-bold">Join this event!</p>
            </Link>
            {relatedEvents?.length !== 0 && <div className="flex flex-col py-2">
                <div> You might also be intersted in: </div>
                {relatedEvents?.map((event, index) => {
                    return <Link href={`#event-${event?.id}`} key={index} className="text-sky-800 underline font-bold">
                            {event?.name}
                    </Link>
                })}
            </div>}
        </div>
      }
    </div>
  );
}
