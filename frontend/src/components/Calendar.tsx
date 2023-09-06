import { useEffect, useState, useCallback, Fragment } from "react";
import { useLilius, Day } from "use-lilius";
import { readOnlySanityClient } from "../lib/read-only-sanity-client";

interface Event {
    name: string;
    href: string;
    date: string | Date;
}

// Nice to have: Types for faster search through the events, when they are sorted by year and months
// type Month = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
// type Year = '2023' | '2024' | '2025';

// type EventsByMonths = Record<Month, Event[]>

// type EventList = Record<Year, EventsByMonths>

function getYYYYMMDD(day: Event['date']) {
    const date = new Date(day);
    return date.toISOString().split("T")[0];
}

export default function Calendar() {
    const [events, setEvents] = useState([]);
    const { calendar, viewPreviousMonth, viewNextMonth, viewing } = useLilius({ weekStartsOn: Day.MONDAY });

    useEffect(() => {
        (async () => {
            try {
                const sanityEvents = await readOnlySanityClient.fetch(`*[_type == "event"]`);
                setEvents(sanityEvents);
            } catch (e) {
                console.log("Error fetching events from Sanity", e.message || e);
            }
        })();
    }, []);

    const addEvent = useCallback((day: Date) => {
        const event = events.find((event) => getYYYYMMDD(event.date) === getYYYYMMDD(day));
        if (event) {
            return (
                <div key={day.toString()} className="prev-date">
                    {day.getDate()}
                    <a href={event.href} className="event-link">
                        <p className="event">{event.name}</p>
                    </a>
                </div>);
        }
        return (
            <div key={day.toString()}>{day.getDate()}</div>
        );
    }, [events]);

    return (
        <div className="calendar__container">
            <div className="calendar">
                <div className="month">
                    <i onClick={viewPreviousMonth} className="icofont-thin-left icofont-2x prev"></i>
                    <div className="date">
                        <h1>{viewing.toLocaleString('default', { month: 'long' })}</h1>
                        <p>{`${viewing.toLocaleString('default', { month: 'long' })} ${viewing.getFullYear()}`}</p>
                    </div>
                    <i onClick={viewNextMonth} className="icofont-thin-right icofont-2x next"></i>
                </div>
                <div className="weekdays">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>
                <div className="days">
                    {
                        calendar[0].map((week) => (
                            <Fragment key={JSON.stringify(week[0])}>
                                {
                                    week.map(
                                        (day) => (addEvent(day))
                                    )
                                }
                            </Fragment>
                        )
                        )
                    }

                    {/* <div className="prev-date">
                        1<a href="" className="event-link"
                        ><p className="event">Carob Workshop</p></a
                        >
                    </div>
                    <div>2</div>
                    <div>3</div>
                    <div className="today">4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>
                        7<a href="" className="event-link"
                        ><p className="event tour">Open Day</p></a
                        >
                    </div>
                    <div>8</div>
                    <div>
                        9<a
                            href="/workshops/carob-black-gold-of-cyprus"
                            className="event-link"
                        ><p className="event">Carob Workshop</p></a
                        >
                    </div>
                    <div>
                        10<a href="" className="event-link"
                        ><p className="event workshop">Carob Workshop</p></a
                        >
                    </div>
                    <div className="next-date">11</div>
                    <div className="next-date">
                        12<a href="" className="event-link"
                        ><p className="event experience">Grape Picking</p></a
                        >
                    </div>
                    <div className="next-date">13</div> */}
                </div>
            </div>
        </div>);
}
