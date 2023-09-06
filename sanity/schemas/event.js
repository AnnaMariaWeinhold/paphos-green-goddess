import {defineField, defineType} from 'sanity'

export default defineType({
    name: "event",
    title: "Event",
    type: "document",
    fields: [
        defineField({
            title: "Name",
            name: "name",
            type: "string",
        }),
        defineField({
            title: "Date",
            name: "date",
            type: "date",
        }),
        defineField({
            title: "Link",
            name: "href",
            type: "url",
        })
    ]
});