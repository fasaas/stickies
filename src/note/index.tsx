import React from 'react'
import { NoteProvider } from './context'
import { ISection } from './Types'
import { Note } from './Note'

export default ({ title, sections }: { title?: string; sections?: ISection[] }) => {
    return (
        <NoteProvider title={title} sections={sections}>
            <Note />
        </NoteProvider>
    )
}
