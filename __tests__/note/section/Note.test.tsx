import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native'
import Note from '../../../src/note/Note'
import { ISection } from '../../../src/note/sections/Context'

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
                    const { queryByPlaceholderText, queryByTestId, queryByDisplayValue, queryAllByTestId } = render(
                        <Note />
                    )
                    fireEvent.changeText(queryByPlaceholderText('Por ejemplo ...'), 'Mar')

                    await waitFor(() => expect(queryByDisplayValue('Mar')).toBeTruthy())

                    fireEvent.press(queryByTestId('remove-section'))

                    await waitFor(() => expect(queryByTestId('undo-button')).toBeTruthy())

                    fireEvent.press(queryByTestId('remove-box'))

                    await waitFor(() => {
                        expect(queryByPlaceholderText('Por ejemplo ...')).toBeNull()
                        expect(queryAllByTestId('section')).toHaveLength(0)
                    })
                })
            })
        })
    })

    describe('When adding a new section', () => {
        test('Render the new section below existing ones', async () => {
            const { queryByTestId, queryAllByTestId } = render(<Note />)

            fireEvent.press(queryByTestId('add-section-button'))

            await waitFor(() => expect(queryAllByTestId('section')).toHaveLength(2))
        })
    })
})

describe('Given existing note with two sections', () => {
    afterEach(cleanup)

    test('Render both sections', async () => {
        const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
        const { queryAllByTestId } = render(<Note sections={sections} />)

        await waitFor(() => expect(queryAllByTestId('section')).toHaveLength(2))
    })

    test('Render disabled save button', async () => {
        const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
        const { queryByTestId } = render(<Note sections={sections} />)

        await waitFor(() => expect(queryByTestId('save-note')).toBeDisabled())
    })

    test('Render disabled cancel button', async () => {
        const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
        const { queryByTestId } = render(<Note sections={sections} />)

        await waitFor(() => expect(queryByTestId('cancel-note')).toBeDisabled())
    })

    describe('When updating sections, given new content is different from initial sections', () => {
        test('Enable both save and cancel buttons', async () => {
            const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
            const { queryByTestId, queryAllByPlaceholderText, queryByDisplayValue } = render(
                <Note sections={sections} />
            )

            await waitFor(() => expect(queryByTestId('cancel-note')).toBeDisabled())

            fireEvent.changeText(queryAllByPlaceholderText('Например ...')[0], 'Море')

            await waitFor(() => {
                expect(queryByDisplayValue('Море')).toBeTruthy()
                expect(queryByTestId('save-note')).toBeEnabled()
                expect(queryByTestId('cancel-note')).toBeEnabled()
            })
        })
    })

    describe('When updating sections, given new content is same as initial sections', () => {
        test('Disable both save and cancel buttons', async () => {
            const sections: ISection[] = [
                mockTranslationSection({ id: '1', from: 'Один' }),
                mockTranslationSection({ id: '2' }),
            ]
            const { queryByTestId, queryAllByPlaceholderText, queryByDisplayValue } = render(
                <Note sections={sections} />
            )

            await waitFor(() => expect(queryByTestId('cancel-note')).toBeDisabled())

            fireEvent.changeText(queryAllByPlaceholderText('Например ...')[0], 'Море')

            await waitFor(() => {
                expect(queryByDisplayValue('Море')).toBeTruthy()
                expect(queryByTestId('save-note')).toBeEnabled()
                expect(queryByTestId('cancel-note')).toBeEnabled()
            })

            fireEvent.changeText(queryAllByPlaceholderText('Например ...')[0], 'Один')

            await waitFor(() => {
                expect(queryByDisplayValue('Один')).toBeTruthy()
                expect(queryByTestId('save-note')).toBeDisabled()
                expect(queryByTestId('cancel-note')).toBeDisabled()
            })
        })
    })

    describe('When adding a new section', () => {
        test('Enable both save and cancel buttons', async () => {
            const sections: ISection[] = [
                mockTranslationSection({ id: '1', from: 'Один' }),
                mockTranslationSection({ id: '2' }),
            ]
            const { queryByTestId } = render(<Note sections={sections} />)

            await waitFor(() => {
                expect(queryByTestId('save-note')).toBeDisabled()
                expect(queryByTestId('cancel-note')).toBeDisabled()
            })

            fireEvent.press(queryByTestId('add-section-button'))

            await waitFor(() => {
                expect(queryByTestId('save-note')).toBeEnabled()
                expect(queryByTestId('cancel-note')).toBeEnabled()
            })
        })
    })

    describe('When removing a  section', () => {
        test('Enable both save and cancel buttons', async () => {
            const sections: ISection[] = [
                mockTranslationSection({ id: '1', from: 'Один' }),
                mockTranslationSection({ id: '2' }),
            ]
            const { queryByTestId, queryAllByTestId } = render(<Note sections={sections} />)

            await waitFor(() => {
                expect(queryByTestId('save-note')).toBeDisabled()
                expect(queryByTestId('cancel-note')).toBeDisabled()
            })

            fireEvent.press(queryAllByTestId('remove-section')[0])

            await waitFor(() => expect(queryByTestId('remove-box')).toBeTruthy())

            fireEvent.press(queryAllByTestId('remove-box')[0])

            expect(queryByTestId('save-note')).toBeEnabled()
            expect(queryByTestId('cancel-note')).toBeEnabled()
        })
    })
})

describe('Cancel button', () => {
    describe('When clicked', () => {
        test('Restores to initial sections', async () => {
            const sections: ISection[] = [mockTranslationSection({ id: '1', from: 'Один' })]
            const { queryByTestId, queryByDisplayValue } = render(<Note sections={sections} />)

            await waitFor(() => expect(queryByTestId('cancel-note')).toBeDisabled())

            fireEvent.changeText(queryByDisplayValue('Один'), 'Море')

            await waitFor(() => {
                expect(queryByDisplayValue('Море')).toBeTruthy()
                expect(queryByTestId('cancel-note')).toBeEnabled()
            })

            fireEvent.press(queryByTestId('cancel-note'))

            await waitFor(() => {
                expect(queryByDisplayValue('Один')).toBeTruthy()
                expect(queryByDisplayValue('Море')).not.toBeTruthy()
                expect(queryByTestId('cancel-note')).toBeDisabled()
            })
        })
    })
})

const mockTranslationSection = ({ id, from = '', to = '' }: { id: string; from?: string; to?: string }): ISection => {
    return {
        type: '@native/translation',
        id,
        name: 'Translation',
        props: { from, to },
    }
}

// Test save action!!
