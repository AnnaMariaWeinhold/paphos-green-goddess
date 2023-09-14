import { useState, useEffect, Fragment } from "react";
import { readOnlySanityClient, type Event } from "../lib/read-only-sanity-client";

type Categories = "Workshop" | "Tour" | "Experience";

export function CurrentEvent({ category, slug }: { category: Categories, slug: string }) {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const sanityEvents: Event[] = await readOnlySanityClient.fetch(`*[_type == "event" && type == "${category}"]`);
                setEvents(sanityEvents.filter((event) => typeof event.type === "string"));
            } catch (e) {
                console.log("Error fetching events from Sanity", e.message || e);
                setEvents(undefined);
            }
        })();
    }, []);

    const event = Array.isArray(events) ? events.find((event) => event.href.includes(slug)) : null;


    return (
        <Fragment>
            {event ?
                <Fragment>We meet {new Date(event.date).toLocaleDateString("de-DE")}, <br />{new Date(event.date).toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" }).toLowerCase()}</Fragment>
                : event === null ? <a style={{
                    color: "inherit",
                    textDecoration: "underline",
                }} href="/contact/">
                    Please contact us for upcomping events
                </a> : ""}
        </Fragment>
    );
}