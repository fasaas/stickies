import React from 'react'
import { SectionsProvider } from './sections/Context'
import Sections from './sections'

export default () => {
    return (
        <SectionsProvider>
            <Sections />
        </SectionsProvider>
    )
}
