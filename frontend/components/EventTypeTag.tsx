import { tagColors, eventTypes } from "@/utils/metadata";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
export default function EventTypeTag({eventTypeName, setTypeFilterList}: {
    eventTypeName: string;  
    setTypeFilterList: Dispatch<SetStateAction<Set<string>>>;
}) {
    const [ clicked, setClicked ] = useState(true);
    const tagColors = ["bg-red-400", "bg-orange-400", "bg-purple-400"]; // in tailwind styles for simplicity
    const eventTypes= ["workshop", "activity", "tech_talk"];

    const eventTypeColor = tagColors[eventTypes.indexOf(eventTypeName)]

    useEffect(() => {
        if(clicked) {
            setTypeFilterList((prevSet) => new Set([...prevSet, eventTypeName]));
        }
        else {
            setTypeFilterList((prevSet) => new Set([...prevSet].filter((t) => t !== eventTypeName)));
        }
    }, [clicked]);

    // Doesnt work sadge
    if(clicked) {
        return <div className={`${eventTypeColor} p-2 rounded-md text-gray-100`} 
                    onClick={() => setClicked(!clicked)}>
            {eventTypeName.replace("_", " ")}
        </div>
    }
    else {
        return <div className={`bg-gray-400 p-2 rounded-md text-gray-100`} 
                    onClick={() => setClicked(!clicked)}>
                {eventTypeName.replace("_", " ")}
            </div>
    }
}