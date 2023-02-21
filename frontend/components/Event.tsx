import { TEvent } from "@/utils/schema";
import { formatUnixTimeStamp } from "@/lib/format";
import { useState, useEffect } from "react";
import { API_ENDPOINT } from "@/utils/metadata";
import Link from "next/link";
import EventTypeTag from "./EventTypeTag";

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
  const [ relatedEvents, setRelatedEvents ] = useState<TEvent[]>();

  useEffect(() => {
    async function fetchRelatedEvents() {
        // admittedly, this could get slow if there are a ton of related events, but should be very unlikely
        const fetchedEvents = await Promise.all(event.related_events.map(async (id) => {
            return (await getEvent(id));
        }));
        setRelatedEvents(fetchedEvents);
    }
    fetchRelatedEvents();
  }, []);

  // TODO add colors for tags
  return (
    <div className="flex flex-col bg-stone-300 px-16 py-8 rounded-md hover:cursor-pointer" 
        id={`event-${event.id}`}>
      <div onClick={() => setShowDetails(!showDetails)}>
        <div className="py-2" >
            <div className="flex justify-between">
                <h1 className="text-xl font-bold text-neutral-800">{event.name}</h1>
                <EventTypeTag eventTypeName={event.event_type}/>
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
                    return <Link href={`#event-${event.id}`} key={index} className="text-sky-800 underline font-bold">
                            {event.name}
                    </Link>
                })}
            </div>}
        </div>
      }
    </div>
  );
}
