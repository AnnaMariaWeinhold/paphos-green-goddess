import { useEffect, useState, useCallback, Fragment } from "react";
import { useLilius } from "use-lilius";
import { readOnlySanityClient, type Event } from "../lib/read-only-sanity-client";
import "./Calendar.css";

// Nice to have: Types for faster search through the events, when they are sorted by year and months
// type Month = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
// type Year = '2023' | '2024' | '2025';

// type EventsByMonths = Record<Month, Event[]>

// type EventList = Record<Year, EventsByMonths>

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
        const event = events.find((event) => {
            const eventDate = new Date(event.date);
            if (eventDate.getFullYear() === day.getFullYear() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getDate() === day.getDate()) {
                return true;
            }
            return false;
        });

        const className = dayClassName(day);

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

    const today = new Date();

    function todayIsInDisplayedMonth() {
        return today.getFullYear() === viewing.getFullYear() &&
            today.getMonth() === viewing.getMonth();
    }


    function dayClassName(date1: Date) {
        const isSameMonth = date1.getFullYear() === viewing.getFullYear() &&
            date1.getMonth() === viewing.getMonth();
        
        const isToday = date1.getDate() === today.getDate() &&
            date1.getMonth() === today.getMonth() &&
            date1.getFullYear() === today.getFullYear();

        return isToday ? 'today' : isSameMonth ? 'same-month' : 'other-month';
    }

    return (
        <div className="calendar__container">
            <div className="calendar">
                <div className="month">
                    <i onClick={viewPreviousMonth} className="icofont-thin-left icofont-2x prev"></i>
                    <div className="date">
                        <h1>{viewing.toLocaleString('default', { month: 'long' })}</h1>
                        {
                            todayIsInDisplayedMonth()
                                ? <p>{`${getOrdinalNum(today.getDate())} of ${today.toLocaleString('default', { month: 'long' })} ${viewing.getFullYear()}`}</p>
                                : <p style={{ height: "22px" }}> </p>
                        }
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
