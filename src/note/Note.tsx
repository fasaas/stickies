import React from 'react'
import { ISection, SectionsProvider } from './sections/Context'
import Sections from './sections'

export default ({ sections }: { sections?: ISection[] }) => {
    return (
        <SectionsProvider value={sections}>
            <Sections />
        </SectionsProvider>
    )
}
