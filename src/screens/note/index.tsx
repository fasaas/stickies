import React from 'react'
import { NoteProvider } from './context'
import { ISection } from './Types'
import { Note } from './Note'

export default (params: { id?: string; title?: string; sections?: ISection[] }) => {
    console.log('TCL: params', params)
    const { id, title, sections } = params
    return (
        <NoteProvider id={id} title={title} sections={sections}>
            <Note />
        </NoteProvider>
    )
}
