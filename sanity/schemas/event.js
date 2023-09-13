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
            validation: (Rule) => Rule.required()
        }),
        defineField({
            title: "Type",
            name: "type",
            type: "string",
            validation: (Rule) => Rule.required()

        }),
        defineField({
            title: "Date",
            name: "date",
            type: "date",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            title: "Link",
            name: "href",
            type: "url",
        }),
        defineField({
            title: "Start Time",
            name: "from",
            type: "datetime",
            options: {
                timeStep: 15
            }
        }),
        defineField({
            title: "End Time",
            name: "to",
            type: "datetime",
            options: {
                timeStep: 15
            }
        })
    ]
});