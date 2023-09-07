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

function dayClassName(date1: Date, date2: Date) {
    const isSameMonth = date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth();

    return isSameMonth ? date1.getDate() === date2.getDate() ? 'today' : 'same-month' : 'other-month'
}

function getOrdinalNum(n: number) {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
}


export default function Calendar() {
    const [events, setEvents] = useState([]);
    const { calendar, viewPreviousMonth, viewNextMonth, viewing } = useLilius();

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
        const className = dayClassName(day, viewing);
        if (event) {
            return (
                <div key={day.toString()} className={className + ' event'}>
                    {day.getDate()}
                    <a href={event.href} className="event-link">
                        <p className="event">{event.name}</p>
                    </a>
                </div>);
        }
        return (
            <div key={day.toString()} className={className}>{day.getDate()}</div>
        );
    }, [events, viewing]);

    return (
        <div className="calendar__container">
            <div className="calendar">
                <div className="month">
                    <i onClick={viewPreviousMonth} className="icofont-thin-left icofont-2x prev"></i>
                    <div className="date">
                        <h1>{viewing.toLocaleString('default', { month: 'long' })}</h1>
                        <p>{`${getOrdinalNum(viewing.getDate())} of ${viewing.toLocaleString('default', { month: 'long' })} ${viewing.getFullYear()}`}</p>
                    </div>
                    <i onClick={viewNextMonth} className="icofont-thin-right icofont-2x next"></i>
                </div>
                <div className="weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
                </div>
            </div>
        </div>
    );
}
