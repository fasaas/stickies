import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { fireEvent, render, waitFor, within } from '@testing-library/react-native'
import Note from '../../src/note'
import { ISection } from '../../src/note/Types'

const errorToSilence =
    'Warning: You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);'

const consoleError = console.error
jest.spyOn(console, 'error').mockImplementation((message, ...optionalParams) => {
    if (!message.includes(errorToSilence)) consoleError(message, optionalParams)
})

describe('Note', () => {
    describe('Add section button', () => {
        test('Adds a new selected section to the screen', () => {
            const { queryByText, queryAllByTestId } = render(<Note sections={[AnEmptySection()]} />)
            expect(queryAllByTestId('section')).toHaveLength(1)

            fireEvent.press(queryByText('Add section'))

            expect(queryAllByTestId('section')).toHaveLength(2)
        })
    })

    describe('Save button', () => {
        describe('Should be disabled when', () => {
            test('Loading empty note', () => {
                const { queryByText } = render(<Note />)

                expect(queryByText('Save')).toBeDisabled()
            })

            test('Loading note with content', () => {
                const { queryByText } = render(<Note title='title' sections={[AnEmptySection()]} />)

                expect(queryByText('Save')).toBeDisabled()
            })

            test.each(['', ' ', '  '])('Title is "%s" given note had some title', (emptyTitle) => {
                const { queryByText, queryByDisplayValue } = render(<Note title='title' />)

                fireEvent.changeText(queryByDisplayValue('title'), emptyTitle)

                expect(queryByText('Save')).toBeDisabled()
            })

            test('Updating a section but title is still empty', async () => {
                const { queryByText, queryByDisplayValue, queryByTestId } = render(
                    <Note sections={[AnEmptySection()]} />
                )

                const sections = within(queryByTestId('sections-view'))
                fireEvent.changeText(sections.queryAllByDisplayValue('')[0], 'any other display value')

                await waitFor(() => expect(queryByDisplayValue('any other display value')).toBeTruthy())

                expect(queryByText('Save')).toBeDisabled()
            })

            test('Adding a new section but title is still empty', () => {
                const { queryByText } = render(<Note />)

                fireEvent.press(queryByText('Add section'))

                expect(queryByText('Save')).toBeDisabled()
            })

            test('Clicking on the icon prior to removing a section', async () => {
                const { queryByText, queryByTestId, queryAllByTestId } = render(<Note sections={[AnEmptySection()]} />)

                fireEvent.press(queryByTestId('remove-section'))

                await waitFor(() => expect(queryByText('Undo')).toBeTruthy())
                expect(queryAllByTestId('section')).toHaveLength(1)
                expect(queryByText('Save')).toBeDisabled()
            })

            test('Undoing from removing a section ending up with the same sections as the given sections', async () => {
                const { queryByText, queryByTestId, queryAllByTestId } = render(<Note sections={[AnEmptySection()]} />)

                fireEvent.press(queryByTestId('remove-section'))

                await waitFor(() => expect(queryByText('Undo')).toBeTruthy())
                fireEvent.press(queryByText('Undo'))

                await waitFor(() => expect(queryAllByTestId('section')).toHaveLength(1))
                expect(queryByText('Save')).toBeDisabled()
            })

            test('Removing a section but title is still empty', async () => {
                const { queryByText, queryByTestId, queryAllByTestId } = render(<Note sections={[AnEmptySection()]} />)

                fireEvent.press(queryByTestId('remove-section'))

                await waitFor(() => expect(queryByText('Undo')).toBeTruthy())

                fireEvent.press(queryByTestId('remove-box'))

                expect(queryAllByTestId('section')).toHaveLength(0)
                expect(queryByText('Save')).toBeDisabled()
            })

            test('Changing title before removing all sections', async () => {
                const {
                    queryByText,
                    queryByTestId,
                    queryAllByTestId,
                    queryByPlaceholderText,
                    queryByDisplayValue,
                } = render(<Note sections={[AnEmptySection()]} />)

                fireEvent.changeText(queryByPlaceholderText('Note title'), 'title')

                await waitFor(() => expect(queryByDisplayValue('title')).toBeTruthy())

                fireEvent.press(queryByTestId('remove-section'))

                await waitFor(() => expect(queryByText('Undo')).toBeTruthy())

                fireEvent.press(queryByTestId('remove-box'))

                await waitFor(() => expect(queryAllByTestId('section')).toHaveLength(0))

                expect(queryByText('Save')).toBeDisabled()
            })

            test('Removing all sections even though title is changed', async () => {
                const { queryByText, queryByTestId, queryAllByTestId, queryByDisplayValue } = render(
                    <Note title='title' sections={[AnEmptySection()]} />
                )

                fireEvent.press(queryByTestId('remove-section'))

                await waitFor(() => expect(queryByText('Undo')).toBeTruthy())

                fireEvent.press(queryByTestId('remove-box'))

                await waitFor(() => expect(queryAllByTestId('section')).toHaveLength(0))

                fireEvent.changeText(queryByDisplayValue('title'), 'another title')

                await waitFor(() => expect(queryByDisplayValue('another title')).toBeTruthy())

                expect(queryByText('Save')).toBeDisabled()
            })

            test('Updating title but there are no sections', async () => {
                const { queryByText, queryByDisplayValue, queryByTestId, queryAllByTestId } = render(
                    <Note title='title' sections={[AnEmptySection()]} />
                )

                fireEvent.press(queryByTestId('remove-section'))

                await waitFor(() => expect(queryByText('Undo')).toBeTruthy())

                fireEvent.press(queryByTestId('remove-box'))

                await waitFor(() => expect(queryAllByTestId('section')).toHaveLength(0))

                fireEvent.changeText(queryByDisplayValue('title'), 'another title')

                await waitFor(() => expect(queryByDisplayValue('another title')).toBeTruthy())

                expect(queryByText('Save')).toBeDisabled()
            })

            test('After clicking on save button', async () => {
                const { queryByText, queryByDisplayValue } = render(<Note title='title' />)

                fireEvent.changeText(queryByDisplayValue('title'), 'another title')

                await waitFor(() => expect(queryByText('Save')).toBeEnabled())

                fireEvent.press(queryByText('Save'))

                await waitFor(() => expect(queryByText('Save')).toBeDisabled())
            })

            test('After clicking on reset button', async () => {
                const { queryByText, queryByDisplayValue } = render(<Note title='title' />)

                fireEvent.changeText(queryByDisplayValue('title'), 'another title')

                await waitFor(() => expect(queryByText('Reset')).toBeEnabled())

                fireEvent.press(queryByText('Reset'))

                await waitFor(() => expect(queryByText('Save')).toBeDisabled())
            })

            test('Updated title is the same as the given title while sections have not changed', async () => {
                const { queryByText, queryByDisplayValue } = render(<Note title='title' />)

                fireEvent.changeText(queryByDisplayValue('title'), 'another title')

                await waitFor(() => expect(queryByDisplayValue('another title')).toBeTruthy())
                expect(queryByText('Save')).toBeEnabled()

                fireEvent.changeText(queryByDisplayValue('another title'), 'title')

                await waitFor(() => expect(queryByDisplayValue('title')).toBeTruthy())
                expect(queryByText('Save')).toBeDisabled()
            })

            test('Updated sections are the same as the given sections while title has not changed', async () => {
                const { queryByText, queryByDisplayValue } = render(
                    <Note title='title' sections={[ATranslationSection({ id: '1', from: 'a from value' })]} />
                )

                fireEvent.changeText(queryByDisplayValue('a from value'), 'a different from value')

                await waitFor(() => expect(queryByDisplayValue('a different from value')).toBeTruthy())
                expect(queryByText('Save')).toBeEnabled()

                fireEvent.changeText(queryByDisplayValue('a different from value'), 'a from value')

                await waitFor(() => expect(queryByDisplayValue('a from value')).toBeTruthy())
                expect(queryByText('Save')).toBeDisabled()
            })
        })
    })

    describe('Reset button', () => {
        describe('Should be disabled when', () => {
            test('Loading empty note', () => {
                const { queryByText } = render(<Note />)

                expect(queryByText('Reset')).toBeDisabled()
            })

            test('Loading note with content', () => {
                const { queryByText } = render(<Note title='title' sections={[AnEmptySection()]} />)

                expect(queryByText('Reset')).toBeDisabled()
            })

            test('Clicking on the icon prior to removing a section', async () => {
                const { queryByText, queryByTestId, queryAllByTestId } = render(<Note sections={[AnEmptySection()]} />)

                fireEvent.press(queryByTestId('remove-section'))

                await waitFor(() => expect(queryByText('Undo')).toBeTruthy())
                expect(queryAllByTestId('section')).toHaveLength(1)
                expect(queryByText('Reset')).toBeDisabled()
            })

            test('Undoing from removing a section ending up with the same sections as the given sections', async () => {
                const { queryByText, queryByTestId, queryAllByTestId } = render(<Note sections={[AnEmptySection()]} />)

                fireEvent.press(queryByTestId('remove-section'))

                await waitFor(() => expect(queryByText('Undo')).toBeTruthy())
                fireEvent.press(queryByText('Undo'))

                await waitFor(() => expect(queryAllByTestId('section')).toHaveLength(1))
                expect(queryByText('Reset')).toBeDisabled()
            })

            test('After clicking on save button', async () => {
                const { queryByText, queryByDisplayValue } = render(<Note title='title' />)

                fireEvent.changeText(queryByDisplayValue('title'), 'another title')

                await waitFor(() => {
                    expect(queryByText('Save')).toBeEnabled()
                    expect(queryByText('Reset')).toBeEnabled()
                })

                fireEvent.press(queryByText('Save'))

                await waitFor(() => expect(queryByText('Reset')).toBeDisabled())
            })

            test('After clicking on reset button', async () => {
                const { queryByText, queryByDisplayValue } = render(<Note title='title' />)

                fireEvent.changeText(queryByDisplayValue('title'), 'another title')

                await waitFor(() => expect(queryByText('Reset')).toBeEnabled())

                fireEvent.press(queryByText('Reset'))

                await waitFor(() => expect(queryByText('Reset')).toBeDisabled())
            })

            test('Updated title is the same as the given title while sections have not changed', async () => {
                const { queryByText, queryByDisplayValue } = render(<Note title='title' />)

                fireEvent.changeText(queryByDisplayValue('title'), 'another title')

                await waitFor(() => expect(queryByDisplayValue('another title')).toBeTruthy())
                expect(queryByText('Reset')).toBeEnabled()

                fireEvent.changeText(queryByDisplayValue('another title'), 'title')

                await waitFor(() => expect(queryByDisplayValue('title')).toBeTruthy())
                expect(queryByText('Reset')).toBeDisabled()
            })

            test('Updated sections are the same as the given sections while title has not changed', async () => {
                const { queryByText, queryByDisplayValue } = render(
                    <Note sections={[ATranslationSection({ id: '1', from: 'a from value' })]} />
                )

                fireEvent.changeText(queryByDisplayValue('a from value'), 'a different from value')

                await waitFor(() => expect(queryByDisplayValue('a different from value')).toBeTruthy())
                expect(queryByText('Reset')).toBeEnabled()

                fireEvent.changeText(queryByDisplayValue('a different from value'), 'a from value')

                await waitFor(() => expect(queryByDisplayValue('a from value')).toBeTruthy())
                expect(queryByText('Reset')).toBeDisabled()
            })
        })

        describe('Given initial empty note', () => {
            describe('When clicking on the reset button', () => {
                test('Restore note to initial empty note', async () => {
                    const { queryByText, queryAllByTestId, queryByPlaceholderText, queryAllByDisplayValue } = render(
                        <Note />
                    )
                    expect(queryByPlaceholderText('Note title')).toHaveTextContent('')
                    expect(queryAllByTestId('section')).toHaveLength(1)

                    fireEvent.press(queryByText('Add section'))
                    expect(queryAllByTestId('section')).toHaveLength(2)

                    fireEvent.changeText(queryByPlaceholderText('Note title'), 'Updated title')
                    fireEvent.changeText(queryAllByDisplayValue('')[0], 'Updated text')
                    fireEvent.press(queryByText('Reset'))

                    await waitFor(() => {
                        expect(queryByPlaceholderText('Note title')).toHaveTextContent('')
                        expect(queryAllByTestId('section')).toHaveLength(1)
                    })
                })
            })
        })

        describe('Given note with content', () => {
            describe('When clicking on the reset button', () => {
                test('Restore note to initially given content', async () => {
                    const { queryByText, queryByDisplayValue, queryAllByTestId, queryAllByDisplayValue } = render(
                        <Note title='title' sections={[AnEmptySection(), AnEmptySection()]} />
                    )

                    expect(queryByDisplayValue('title')).toBeTruthy()
                    expect(queryAllByTestId('section')).toHaveLength(2)

                    fireEvent.press(queryByText('Add section'))
                    expect(queryAllByTestId('section')).toHaveLength(3)

                    fireEvent.changeText(queryByDisplayValue('title'), 'Updated title')
                    fireEvent.changeText(queryAllByDisplayValue('')[0], 'Updated text')
                    fireEvent.press(queryByText('Reset'))

                    await waitFor(() => {
                        expect(queryByDisplayValue('title')).toBeTruthy()
                        expect(queryAllByTestId('section')).toHaveLength(2)
                    })
                })
            })
        })

        describe('Given any note', () => {
            describe('When saving updated note', () => {
                describe('When resetting unsaved content', () => {
                    test('Reset note content back to the last saved content', async () => {
                        const { queryByText, queryByDisplayValue, queryAllByTestId, queryAllByDisplayValue } = render(
                            <Note title='title' sections={[AnEmptySection(), AnEmptySection()]} />
                        )

                        expect(queryByDisplayValue('title')).toBeTruthy()
                        expect(queryAllByTestId('section')).toHaveLength(2)

                        fireEvent.press(queryByText('Add section'))
                        expect(queryAllByTestId('section')).toHaveLength(3)

                        fireEvent.changeText(queryByDisplayValue('title'), 'Updated title')
                        fireEvent.changeText(queryAllByDisplayValue('')[0], 'Updated text')
                        fireEvent.press(queryByText('Save'))

                        fireEvent.changeText(queryByDisplayValue('Updated title'), 'Another updated title')
                        fireEvent.changeText(queryByDisplayValue('Updated text'), 'Another updated text')
                        fireEvent.press(queryByText('Reset'))

                        await waitFor(() => {
                            expect(queryByDisplayValue('Updated title')).toBeTruthy()
                            expect(queryAllByTestId('section')).toHaveLength(3)
                            expect(queryByDisplayValue('Updated text')).toBeTruthy()
                        })
                    })
                })
            })
        })
    })
})

const ATranslationSection = ({ id, from = '', to = '' }: { id: string; from?: string; to?: string }): ISection => {
    return {
        type: '@native/translation',
        id,
        name: 'Translation',
        props: { from, to },
    }
}

const AnEmptySection = (): ISection => ATranslationSection({ id: '1' })
