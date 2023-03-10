import { getEventTypes, getTagColors } from "@/utils/metadata";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
export default function EventTypeTag({eventTypeName, setTypeFilterList}: {
    eventTypeName: string;  
    setTypeFilterList: Dispatch<SetStateAction<Set<string>>>;
}) {
    const [ clicked, setClicked ] = useState(true);
    const tagColors = getTagColors(); 
    const eventTypes = getEventTypes();

    const eventTypeColor = tagColors[eventTypes.indexOf(eventTypeName)]

    useEffect(() => {
        if(clicked) {
            setTypeFilterList((prevSet) => new Set([...prevSet, eventTypeName]));
        }
        else {
            setTypeFilterList((prevSet) => new Set([...prevSet].filter((t) => t !== eventTypeName)));
        }
    }, [clicked]);

    if(clicked) {
        return <button className={`${eventTypeColor} p-1 sm:p-2 rounded-md text-gray-100 text-md sm:text-lg`} 
                    onClick={() => setClicked(!clicked)}>
            {eventTypeName.replace("_", " ")}
        </button>
    }
    else {
        return <button className={`bg-gray-400 p-1 sm:p-2 p-2 rounded-md text-gray-100 text-md sm:text-lg`} 
                    onClick={() => setClicked(!clicked)}>
                {eventTypeName.replace("_", " ")}
            </button>
    }
}