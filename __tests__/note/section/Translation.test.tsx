import React from 'react'
import { act, fireEvent, render, within } from '@testing-library/react-native'
import { Translation } from '../../../src/note/sections/Translation'

describe.skip('Native translation section', () => {
    describe('When clicking on the remove button from @native/translation section', () => {
        test('Then replace @native/translation with an Undo box', () => {
            const { queryByTestId } = render(<Note />)
            fireEvent(queryByTestId('remove-section'), 'press')

            expect(queryByTestId('@native/translation')).toBeNull()
            expect(queryByTestId('undo')).not.toBeNull()
            expect(queryByTestId('close-undo')).not.toBeNull()
        })

        describe('When clicking the undo button', () => {
            test.only('Then recover @native/translation section', () => {
                const { queryByTestId } = render(<Note />)
                act(() => fireEvent(queryByTestId('remove-section'), 'press'))
                act(() => fireEvent(queryByTestId('undo'), 'press'))
                expect(queryByTestId('undo')).toBeNull()
                expect(queryByTestId('close-undo')).toBeNull()
                expect(queryByTestId('@native/translation')).not.toBeNull()
            })
        })
    })
})
