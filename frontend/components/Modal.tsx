import useUser from "@/lib/useUser";
import { TEvent } from "@/utils/schema";
import React, { Dispatch, SetStateAction, useState, useEffect} from "react";
import Link from "next/link";
import { formatTimeInterval } from "@/lib/format";
import { getRelatedEvents } from "@/utils/eventdata";
import { getEventTypes, getTagColors } from "@/utils/metadata";

export default function Modal({
  selectedEvent,
  setShowModal,
  setSelectedEvent,
}: {
  selectedEvent: TEvent;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setSelectedEvent: Dispatch<SetStateAction<TEvent | undefined>>;
}) {
  const { user, mutateUser } = useUser();
  const tagColors = getTagColors();
  const eventTypes = getEventTypes();
  const [ relatedEvents, setRelatedEvents ] = useState<TEvent[] | undefined[]>();

  useEffect(() => {
    async function fetchRelatedEvents() {
        const fetchedEvents = await getRelatedEvents(selectedEvent, user?.isLoggedIn);
        setRelatedEvents(fetchedEvents);
    }
    fetchRelatedEvents();
  }, [selectedEvent]);

  return (
    <div
      className="fixed w-full h-full top-0 left-0 flex items-center justify-center bg-opacity-50 bg-black bg-blend-normal">
      <div className="flex max-w-[1298px] max-h-[798px] w-10/12 h-5/6 xl:h-5/6 bg-stone-300 p-4 rounded-md">
        <div className="flex flex-col lg:px-8">
            <button className="self-end" onClick={(() => setShowModal(false))}>Close</button>
            <div className="">
                <div className="flex justify-between">
                    <div className="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <Link href={user?.isLoggedIn? selectedEvent.private_url : selectedEvent.private_url} target="_blank">
                            <h1 className="text-lg sm:text-xl font-bold text-neutral-800 underline decoration-2">{selectedEvent.name}</h1>
                        </Link>
                        <div className={`${tagColors[eventTypes.indexOf(selectedEvent.event_type)]} rounded-md p-1 text-xs md:text-lg w-fit`}>
                        {selectedEvent.event_type.replace("_", " ")}
                        </div>
                    </div>
                </div>
                <h1 className="text-sm sm:text-lg">
                    {formatTimeInterval(selectedEvent.start_time, selectedEvent.end_time)}
                </h1>
                {selectedEvent.speakers.length !== 0 && 
                    <p className="text-sm sm:text-lg">Speakers: {selectedEvent.speakers.map((speaker) => speaker.name).join(",")}</p>
                }
            </div>

            <p className="text-xs sm:text-lg text-gray-700">{selectedEvent.description}</p>

            <div className="flex flex-col py-4">
                {relatedEvents?.length !== 0 && <div className="flex flex-col py-2">
                    <p className="text-xs sm:text-lg"> You might also be interested in: </p>
                    {relatedEvents?.map((event, index) => {
                        return <button onClick={() => {
                                        setShowModal(true);
                                        setSelectedEvent(event);
                                }} className="self-start text-xs sm:text-lg text-sky-800 underline font-bold" key={index}>
                                        {event?.name}
                                </button>
                    })}
                    </div>
                }
            </div>

        </div>
      </div>
    </div>
  );
}
