
import { useEffect, useState, Fragment } from "react";
import { readOnlySanityClient, type Event } from "../lib/read-only-sanity-client";
import { LoadingSpinner } from './LoadingSpinner.tsx';
import './EventCards.css';

export function EventCards() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const sanityEvents: Event[] = await readOnlySanityClient.fetch(`*[_type == "event"] | order(date desc)`);
                setEvents(sanityEvents.filter((event) => typeof event.type === "string"));

            } catch (e) {
                console.log("Error fetching events from Sanity", e.message || e);
            }
        })();
    }, []);

    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <Fragment>
            {events.length === 0 ? <LoadingSpinner /> : events.map((event) => (
                <div key={event._id} className={`event__container ${event.type.toLowerCase()}-color`}>
                    <div className="event__calendar">
                        <p className="event__month">
                            {months[new Date(event.date).getMonth()]}
                        </p>
                        <div className="event__date-container">
                            <div>
                                <div className="event__circle">
                                    <h2 className="event__date">
                                        {new Date(event.date).getDate()}
                                    </h2>
                                </div>
                            </div>
                            <div>
                                <p className="event__weekday">
                                    {daysOfTheWeek[new Date(event.date).getDay()]}
                                </p>
                                <p className="event__time">
                                    {`${new Date(event.from).toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "numeric" })} to ${new Date(event.to).toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" })}`.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <h3 className="event__name">
                        {event.name}
                    </h3>
                    <h6 className="event">{event.type}</h6>
                    <p className="event__registration">{event.type.toLowerCase() !== "tour" ? "*Registration is required" : ""}</p>
                    <div className="event__button-container">
                        {
                            event.href
                                ? <a className="event__button" href={event.href}>Learn more</a>
                                : <a className="event__button" href="/contact">Contact us</a>
                        }
                    </div>
                </div>
            ))}
        </Fragment>
    )
}