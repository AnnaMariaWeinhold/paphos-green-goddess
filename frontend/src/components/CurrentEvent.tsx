import { useState, useEffect, Fragment } from "react";
import { readOnlySanityClient, type Event } from "../lib/read-only-sanity-client";

type Categories = "Workshop" | "Tour" | "Experience";

export function CurrentEvent({ category, slug }: { category: Categories, slug: string }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const sanityEvents: Event[] = await readOnlySanityClient.fetch(`*[_type == "event" && type == "${category}"]`);
                setEvents(sanityEvents.filter((event) => typeof event.type === "string" && event.href.includes(slug)));
                setLoading(false);
            } catch (e) {
                console.log("Error fetching events from Sanity", e.message || e);
                setEvents(null);
                setLoading(false);
            }
        })();
    }, []);

    const currentDate = new Date();

    const futureEvents = Array.isArray(events)
        ? events
            .map((obj) => ({ ...obj, date: new Date(obj.date) }))
            .filter((obj) => obj.date > currentDate)
            .sort((a, b) => +a.date - +b.date) 
        : null;
    const event = Array.isArray(futureEvents) && futureEvents.length > 0 ? futureEvents[0] : Array.isArray(events) ? events[0] : null;

    function render(event?: Event) {
        if (loading) return "";
        if (events === null || !event) return (
            <a style={{
                color: "inherit",
                textDecoration: "underline",
            }} href="/contact/">
                Please contact us for upcomping events
            </a>
        );
        if (event) return (
            <Fragment>We meet {new Date(event.date).toLocaleDateString("de-DE")}, <br />{new Date(event.from).toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" }).toLowerCase()}</Fragment>
        );
    }

    return (
        <Fragment>
            {render(event)}
        </Fragment>
    );
}