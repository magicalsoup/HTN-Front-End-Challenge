import { TEvent } from "@/utils/schema";
import {formatTimeInterval } from "@/lib/format";
import { SetStateAction, Dispatch } from "react";
import Link from "next/link";
import { getEventTypes, getTagColors } from "../utils/metadata";

export default function Event({
  event,
  isLoggedIn,
  setShowModal,
  setSelectedEvent
}: {
  event: TEvent;
  isLoggedIn: boolean | undefined;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setSelectedEvent: Dispatch<SetStateAction<TEvent | undefined>>;
}) {
  

  const tagColors = getTagColors(); 
  const eventTypes= getEventTypes(); 

  return (
    <div className="flex flex-col bg-stone-300 px-2 py-4 sm:px-16 sm:py-8 rounded-md">
      <div className="flex flex-col gap-y-8">
        <div className="py-2" >
            <div className="flex flex-col sm:flex-row justify-between gap-y-2">
              <Link href={isLoggedIn? event.private_url : event.private_url} target="_blank">
                <h1 className="text-lg sm:text-xl font-bold text-neutral-800 underline decoration-2">{event.name}</h1>
              </Link>
                <div className={`${tagColors[eventTypes.indexOf(event.event_type)]} rounded-md p-1 sm:p-2 text-xs sm:text-lg w-fit`}>
                  {event.event_type.replace("_", " ")}
                </div>
            </div>
            <h1 className="text-sm sm:text-lg">
                {formatTimeInterval(event.start_time, event.end_time)}
            </h1>
            {event.speakers.length !== 0 && 
                <p className="text-sm sm:text-lg">Speakers: {event.speakers.map((speaker) => speaker.name).join(",")}</p>
            }
        </div>
        <p className="text-gray-700 text-sm sm:text-lg">{event.description}</p>
        <button className="w-fit text-center py-2 px-4 bg-sky-400 rounded-md text-white font-bold" 
                onClick={() => {
                  setShowModal((prevState) => !prevState);
                  setSelectedEvent(event);
                }}>
          Learn More
        </button>
      </div>
    </div>
  );
}
