import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native'
import Note from '../../../src/note/Note'

describe('Given new Note', () => {
    afterEach(cleanup)

    test('Render a title block', () => {
        const { queryAllByPlaceholderText, queryByA11yRole } = render(<Note />)

        expect(queryAllByPlaceholderText('Note title')).toHaveLength(1)
        expect(queryByA11yRole('header')).not.toBeNull()
    })

    test('Render an add section button', () => {
        const { queryByTestId } = render(<Note />)

        expect(queryByTestId('add-section')).not.toBeNull()
    })

    test('Render a disabled save button', () => {
        const { queryByA11yLabel } = render(<Note />)

        expect(queryByA11yLabel('Save note')).toBeDisabled()
    })

    test('Render a disabled cancel button', () => {
        const { queryByA11yLabel } = render(<Note />)

        expect(queryByA11yLabel('Cancel')).toBeDisabled()
    })

    test('Render a first section for translatable section', () => {
        const { queryByA11yRole, queryByText, queryByPlaceholderText, queryByTestId } = render(<Note />)

        expect(queryByA11yRole('sectionList')).not.toBeNull()
        expect(queryByTestId('@native/translation')).not.toBeNull()
        expect(queryByText('На русском')).not.toBeNull()
        expect(queryByPlaceholderText(/Например .../)).not.toBeNull()
        expect(queryByText('A castellano')).not.toBeNull()
        expect(queryByPlaceholderText(/Por ejemplo .../)).not.toBeNull()
    })

    describe('When rendering a section', () => {
        test('Render a remove icon', async () => {
            const { queryAllByTestId } = render(<Note />)

            await waitFor(() => expect(queryAllByTestId('remove-section')).toHaveLength(1))
        })

        describe('When clicking on the remove icon', () => {
            test('Render an Undo box', async () => {
                const { queryAllByTestId } = render(<Note />)

                await waitFor(() => expect(queryAllByTestId('remove-section')).toHaveLength(1))

                fireEvent.press(queryAllByTestId('remove-section')[0])

                await waitFor(() => {
                    expect(queryAllByTestId('undo-button')).toHaveLength(1)
                    expect(queryAllByTestId('remove-box')).toHaveLength(1)
                })
            })

            describe('When clicking on the Undo button', () => {
                test('Show section once again', async () => {
                    const { queryByPlaceholderText, queryByTestId, queryByDisplayValue } = render(<Note />)
                    fireEvent.changeText(queryByPlaceholderText('Например ...'), 'Море')

                    await waitFor(() => expect(queryByDisplayValue('Море')).toBeTruthy())

                    fireEvent.press(queryByTestId('remove-section'))

                    await waitFor(() => expect(queryByTestId('undo-button')).toBeTruthy())

                    fireEvent.press(queryByTestId('undo-button'))

                    await waitFor(() => expect(queryByDisplayValue('Море')).toBeTruthy())
                })
            })

            describe('When clicking on the remove section box clear icon', () => {
                test('Completely remove the section', async () => {
                    const { queryByPlaceholderText, queryByTestId, queryByDisplayValue } = render(<Note />)
                    fireEvent.changeText(queryByPlaceholderText('Por ejemplo ...'), 'Mar')

                    await waitFor(() => expect(queryByDisplayValue('Mar')).toBeTruthy())

                    fireEvent.press(queryByTestId('remove-section'))

                    await waitFor(() => expect(queryByTestId('undo-button')).toBeTruthy())

                    fireEvent.press(queryByTestId('remove-box'))

                    await waitFor(() => expect(queryByPlaceholderText('Por ejemplo ...')).toBeNull())
                })
            })
        })
    })
})
