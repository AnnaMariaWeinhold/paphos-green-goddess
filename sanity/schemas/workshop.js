import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  fields: [
    defineField({
        name: 'mainImage',
        title: 'Main image',
        type: 'image',
        fields: [
          {
            name: 'altTag',
            title: 'Alt Tag',
            type: 'string',
          }
        ]
      }),
      defineField({
        name: 'description',
        title: 'Description',
        type: 'string',
      }),
    defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
      }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
    }),
    defineField({
        name: 'time',
        title: 'Time',
        type: 'datetime',
      }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
        name: 'whatDo',
        title: 'What do you do',
        type: 'string',
      }),
      defineField({
        name: 'whatDoImage',
        title: 'Small Image',
        type: 'image',
        fields: [
          {
            name: 'altTag',
            title: 'Alt Tag',
            type: 'string',
          }
        ]
      }),
      defineField({
        name: 'fullImage',
        title: 'Big Image',
        type: 'image',
        fields: [
          {
            name: 'altTag',
            title: 'Alt Tag',
            type: 'string',
          }
        ]
      }),
    defineField({
      name: 'whatGet',
      title: 'What do you get',
      type: 'string',
    }),
      defineField({
        name: 'forWhom',
        title: 'For whom is it suitable',
        type: 'string',
      }),
      defineField({
        name: 'whatBring',
        title: 'What do you need to bring',
        type: 'string',
      }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
