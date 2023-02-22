export const API_ENDPOINT = "https://api.hackthenorth.com/v3/";

const tagColors = ["bg-red-400", "bg-orange-400", "bg-purple-400"]; // in tailwind styles for consistency
const eventTypes= ["workshop", "activity", "tech_talk"];

export function getTagColors() {
    return tagColors;
}

export function getEventTypes() {
    return eventTypes;
}

