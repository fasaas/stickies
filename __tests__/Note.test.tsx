import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { render } from '@testing-library/react-native'
import Note from '../src/Note'

describe('Given new Note', () => {
    test('Then render a title block', () => {
        const { queryAllByPlaceholderText, queryByA11yRole } = render(<Note />)

        expect(queryAllByPlaceholderText('Note title')).toHaveLength(1)
        expect(queryByA11yRole('header')).not.toBeNull()
    })

    test('Then render a disabled save button', () => {
        const { queryByA11yLabel } = render(<Note />)

        expect(queryByA11yLabel('Save note')).toBeDisabled()
    })

    test('Then render a disabled cancel button', () => {
        const { queryByA11yLabel } = render(<Note />)

        expect(queryByA11yLabel('Cancel')).toBeDisabled()
    })

    test('Then render a first section for translatable content', () => {
        const {
            queryByA11yRole,
            queryByText,
            queryByPlaceholderText,
            queryByTestId,
        } = render(<Note />)

        expect(queryByA11yRole('sectionList')).not.toBeNull()
        expect(queryByTestId('@native/translation')).not.toBeNull()
        expect(queryByText('На русском')).not.toBeNull()
        expect(queryByPlaceholderText(/Например .../)).not.toBeNull()
        expect(queryByText('A castellano')).not.toBeNull()
        expect(queryByPlaceholderText(/Por ejemplo .../)).not.toBeNull()
    })
})
