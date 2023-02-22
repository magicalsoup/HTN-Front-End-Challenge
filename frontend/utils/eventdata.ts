import { API_ENDPOINT } from "./metadata";
import { TEvent } from "./schema";

export async function getEvent(id: number) : Promise<TEvent> {
    const req = `${API_ENDPOINT}/events/${id}`;
    const res = await fetch(req);
    return res.json();
}

export async function getRelatedEvents(event:TEvent, isLoggedIn:boolean | undefined) : Promise<TEvent[]> {
    // admittedly, this could get slow if there are a ton of related events, but should be very unlikely
    const fetchedEvents = await 
          (await Promise.all(event.related_events
          .map(async (id) => (await getEvent(id)))))
          .filter((event) => (event.permission === "public" || isLoggedIn)); // make sure related events are visible in accordance if the user is logged in or not
    return fetchedEvents;
}