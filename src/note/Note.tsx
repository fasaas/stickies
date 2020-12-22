import React from 'react'
import { ISection, SectionsProvider } from './sections/Context'
import Sections from './sections'

export default ({ title, sections }: { title?: string; sections?: ISection[] }) => {
    return (
        <SectionsProvider title={title} sections={sections}>
            <Sections />
        </SectionsProvider>
    )
}
