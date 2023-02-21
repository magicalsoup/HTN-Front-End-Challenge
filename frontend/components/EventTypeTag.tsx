import { tagColors, eventTypes } from "@/utils/metadata";
export default function EventTypeTag({eventTypeName}: {
    eventTypeName: string;
}) {
    const eventTypeColor = tagColors[eventTypes.indexOf(eventTypeName)]
    
    // Doesnt work sadge
    return <div className={`${eventTypeColor} p-2 rounded-md text-gray-100`}>
        {eventTypeName.replace("_", " ")} 
    </div>
}