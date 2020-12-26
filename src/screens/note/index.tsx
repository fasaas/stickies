import React from 'react'
import { NoteProvider } from './context'
import { ISection } from './Types'
import { Note } from './Note'

export default ({ id, title, sections }: { id?: string; title?: string; sections?: ISection[] }) => {
    return (
        <NoteProvider id={id} title={title} sections={sections}>
            <Note />
        </NoteProvider>
    )
}
