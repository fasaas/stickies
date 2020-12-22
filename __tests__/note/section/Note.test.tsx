import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native'
import Note from '../../../src/note/Note'
import { ISection } from '../../../src/note/sections/Context'

const errorToSilence =
    'Warning: You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);'

const consoleError = console.error
jest.spyOn(console, 'error').mockImplementation((message, ...optionalParams) => {
    if (!message.includes(errorToSilence)) consoleError(message, optionalParams)
})

describe('Given new Note', () => {
    afterEach(cleanup)

    test('Render an empty title block', () => {
        const { queryByPlaceholderText } = render(<Note />)

        expect(queryByPlaceholderText('Note title')).toBeTruthy()
        expect(queryByPlaceholderText('Note title')).toHaveTextContent('')
    })

    test('Render an add section button', () => {
        const { queryByText } = render(<Note />)

        expect(queryByText('Add section')).toBeTruthy()
        expect(queryByText('Add section')).toBeEnabled()
    })

    test('Render a disabled save button', () => {
        const { queryByText } = render(<Note />)

        expect(queryByText('Save')).toBeTruthy()
        expect(queryByText('Save')).toBeDisabled()
    })

    test('Render a disabled reset button', () => {
        const { queryByText } = render(<Note />)

        expect(queryByText('Reset')).toBeTruthy()
        expect(queryByText('Reset')).toBeDisabled()
    })

    test('Render a first section for translatable section', () => {
        const { queryByTestId, queryAllByTestId } = render(<Note />)

        expect(queryByTestId('@native/translation')).toBeTruthy()
        expect(queryAllByTestId('section')).toHaveLength(1)
    })
})

describe('Given existing note', () => {
    afterEach(cleanup)

    test('Render title and all sections', async () => {
        const title = 'any title'
        const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
        const { queryByDisplayValue, queryAllByTestId } = render(<Note title={title} sections={sections} />)

        await waitFor(() => {
            expect(queryByDisplayValue(title)).toBeTruthy()
            expect(queryAllByTestId('section')).toHaveLength(sections.length)
        })
    })

    test('Disable Save button when both title and sections are empty', async () => {
        const { queryByTestId, queryByText, queryByDisplayValue } = render(
            <Note title={'any title'} sections={oneTranslationSection} />
        )

        await waitFor(() => {
            expect(queryByText('Save')).toBeDisabled()
            expect(queryByText('Reset')).toBeDisabled()
        })

        fireEvent.press(queryByTestId('remove-section'))

        await waitFor(() => expect(queryByTestId('remove-box')).toBeTruthy())

        fireEvent.press(queryByTestId('remove-box'))

        expect(queryByText('Save')).toBeEnabled()
        expect(queryByText('Reset')).toBeEnabled()

        fireEvent.changeText(queryByDisplayValue('any title'), '')

        expect(queryByText('Save')).toBeDisabled()
        expect(queryByText('Reset')).toBeEnabled()
    })

    test('Render disabled save button', async () => {
        const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
        const { queryByText } = render(<Note sections={sections} />)

        await waitFor(() => expect(queryByText('Save')).toBeDisabled())
    })

    test('Render disabled reset button', async () => {
        const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
        const { queryByText } = render(<Note sections={sections} />)

        await waitFor(() => expect(queryByText('Reset')).toBeDisabled())
    })

    describe('When updating title', () => {
        const title = 'any given title'

        describe('Given title is different from initial title', () => {
            test('Enable save and reset buttons', async () => {
                const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
                const { queryByText, queryByDisplayValue } = render(<Note title={title} sections={sections} />)

                await waitFor(() => expect(queryByText('Reset')).toBeDisabled())

                fireEvent.changeText(queryByDisplayValue(title), 'Any other given title')

                await waitFor(() => {
                    expect(queryByText('Save')).toBeEnabled()
                    expect(queryByText('Reset')).toBeEnabled()
                })
            })
        })

        describe('Given new title is same as initial title', () => {
            test('Disable save and reset buttons', async () => {
                const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
                const { queryByText, queryByDisplayValue } = render(<Note title={title} sections={sections} />)

                await waitFor(() => expect(queryByText('Reset')).toBeDisabled())

                fireEvent.changeText(queryByDisplayValue(title), 'Any other given title')

                await waitFor(() => {
                    expect(queryByText('Save')).toBeEnabled()
                    expect(queryByText('Reset')).toBeEnabled()
                })

                fireEvent.changeText(queryByDisplayValue('Any other given title'), title)

                await waitFor(() => {
                    expect(queryByText('Save')).toBeDisabled()
                    expect(queryByText('Reset')).toBeDisabled()
                })
            })
        })
    })

    describe('When updating content from any section', () => {
        describe('Given new content is different from initial sections', () => {
            test('Enable both save and reset buttons', async () => {
                const sections: ISection[] = [mockTranslationSection({ id: '1' }), mockTranslationSection({ id: '2' })]
                const { queryByText, queryAllByPlaceholderText, queryByDisplayValue } = render(
                    <Note sections={sections} />
                )

                await waitFor(() => expect(queryByText('Reset')).toBeDisabled())

                fireEvent.changeText(queryAllByPlaceholderText('Например ...')[0], 'Море')

                await waitFor(() => {
                    expect(queryByDisplayValue('Море')).toBeTruthy()
                    expect(queryByText('Save')).toBeEnabled()
                    expect(queryByText('Reset')).toBeEnabled()
                })
            })
        })

        describe('Given new content is same as initial sections', () => {
            test('Disable both save and reset buttons', async () => {
                const sections: ISection[] = [
                    mockTranslationSection({ id: '1', from: 'Один' }),
                    mockTranslationSection({ id: '2' }),
                ]
                const { queryByText, queryAllByPlaceholderText, queryByDisplayValue } = render(
                    <Note sections={sections} />
                )

                await waitFor(() => expect(queryByText('Reset')).toBeDisabled())

                fireEvent.changeText(queryAllByPlaceholderText('Например ...')[0], 'Море')

                await waitFor(() => {
                    expect(queryByDisplayValue('Море')).toBeTruthy()
                    expect(queryByText('Save')).toBeEnabled()
                    expect(queryByText('Reset')).toBeEnabled()
                })

                fireEvent.changeText(queryAllByPlaceholderText('Например ...')[0], 'Один')

                await waitFor(() => {
                    expect(queryByDisplayValue('Один')).toBeTruthy()
                    expect(queryByText('Save')).toBeDisabled()
                    expect(queryByText('Reset')).toBeDisabled()
                })
            })
        })
    })

    describe('When adding a new section', () => {
        test('Enable both save and reset buttons', async () => {
            const sections: ISection[] = [
                mockTranslationSection({ id: '1', from: 'Один' }),
                mockTranslationSection({ id: '2' }),
            ]
            const { queryByText } = render(<Note sections={sections} />)

            await waitFor(() => {
                expect(queryByText('Save')).toBeDisabled()
                expect(queryByText('Reset')).toBeDisabled()
            })

            fireEvent.press(queryByText('Add section'))

            await waitFor(() => {
                expect(queryByText('Save')).toBeEnabled()
                expect(queryByText('Reset')).toBeEnabled()
            })
        })
    })

    describe('When removing a section', () => {
        test('Enable both save and reset buttons', async () => {
            const sections: ISection[] = [
                mockTranslationSection({ id: '1', from: 'Один' }),
                mockTranslationSection({ id: '2' }),
            ]
            const { queryByTestId, queryByText, queryAllByTestId } = render(<Note sections={sections} />)

            await waitFor(() => {
                expect(queryByText('Save')).toBeDisabled()
                expect(queryByText('Reset')).toBeDisabled()
            })

            fireEvent.press(queryAllByTestId('remove-section')[0])

            await waitFor(() => expect(queryByTestId('remove-box')).toBeTruthy())

            fireEvent.press(queryAllByTestId('remove-box')[0])

            expect(queryByText('Save')).toBeEnabled()
            expect(queryByText('Reset')).toBeEnabled()
        })

        test('Ensure sections contain unique ID when deleting', async () => {
            const sections: ISection[] = [mockTranslationSection({ id: '1' })]
            const { queryByText, queryByTestId, queryAllByTestId } = render(<Note sections={sections} />)

            await waitFor(() => {
                expect(queryByText('Save')).toBeDisabled()
                expect(queryByText('Reset')).toBeDisabled()
            })

            fireEvent.press(queryByText('Add section'))

            await waitFor(() => expect(queryAllByTestId('section')).toHaveLength(2))

            fireEvent.press(queryByText('Add section'))

            await waitFor(() => {
                expect(queryAllByTestId('section')).toHaveLength(3)
                expect(queryAllByTestId('remove-section')).toHaveLength(3)
            })

            fireEvent.press(queryAllByTestId('remove-section')[1])

            await waitFor(() => expect(queryByTestId('remove-box')).toBeTruthy())

            fireEvent.press(queryByTestId('remove-box'))

            await waitFor(() => expect(queryAllByTestId('section')).toHaveLength(2))
        })
    })
})

describe('Add section button', () => {
    describe('When adding a section', () => {
        test('Render a remove icon', async () => {
            const { queryByText, queryAllByTestId } = render(<Note sections={oneTranslationSection} />)

            fireEvent.press(queryByText('Add section'))

            await waitFor(() => expect(queryAllByTestId('remove-section')).toHaveLength(2))
        })

        describe('When clicking on the remove icon', () => {
            test('Render an Undo box', async () => {
                const { queryAllByTestId, queryAllByText } = render(<Note />)

                await waitFor(() => expect(queryAllByTestId('remove-section')).toHaveLength(1))

                fireEvent.press(queryAllByTestId('remove-section')[0])

                await waitFor(() => {
                    expect(queryAllByText('Undo')).toHaveLength(1)
                    expect(queryAllByTestId('remove-box')).toHaveLength(1)
                })
            })

            describe('When clicking on the Undo button', () => {
                test('Show same exact section once again', async () => {
                    const { queryByText, queryByPlaceholderText, queryByTestId, queryByDisplayValue } = render(<Note />)
                    fireEvent.changeText(queryByPlaceholderText('Например ...'), 'Море')

                    await waitFor(() => expect(queryByDisplayValue('Море')).toBeTruthy())

                    fireEvent.press(queryByTestId('remove-section'))

                    await waitFor(() => expect(queryByText('Undo')).toBeTruthy())

                    fireEvent.press(queryByText('Undo'))

                    await waitFor(() => expect(queryByDisplayValue('Море')).toBeTruthy())
                })
            })

            describe('When clicking on the remove section box clear icon', () => {
                test('Completely remove the section', async () => {
                    const {
                        queryByPlaceholderText,
                        queryByTestId,
                        queryByText,
                        queryByDisplayValue,
                        queryAllByTestId,
                    } = render(<Note />)
                    fireEvent.changeText(queryByPlaceholderText('Por ejemplo ...'), 'Mar')

                    await waitFor(() => expect(queryByDisplayValue('Mar')).toBeTruthy())

                    fireEvent.press(queryByTestId('remove-section'))

                    await waitFor(() => expect(queryByText('Undo')).toBeTruthy())

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
        test('Enable save and reset buttons', async () => {
            const { queryByText } = render(<Note />)

            fireEvent.press(queryByText('Add section'))

            await waitFor(() => {
                expect(queryByText('Save')).toBeEnabled()
                expect(queryByText('Reset')).toBeEnabled()
            })
        })
    })
})

describe('Reset button', () => {
    describe('When clicked', () => {
        test('Restores to initial sections', async () => {
            const sections: ISection[] = [mockTranslationSection({ id: '1', from: 'Один' })]
            const { queryByText, queryByDisplayValue } = render(<Note sections={sections} />)

            await waitFor(() => expect(queryByText('Reset')).toBeDisabled())

            fireEvent.changeText(queryByDisplayValue('Один'), 'Море')

            await waitFor(() => {
                expect(queryByDisplayValue('Море')).toBeTruthy()
                expect(queryByText('Reset')).toBeEnabled()
            })

            fireEvent.press(queryByText('Reset'))

            await waitFor(() => {
                expect(queryByDisplayValue('Один')).toBeTruthy()
                expect(queryByDisplayValue('Море')).not.toBeTruthy()
                expect(queryByText('Reset')).toBeDisabled()
            })
        })
    })
})

describe('Save button', () => {
    describe('When clicked', () => {
        test('Disables save button', async () => {
            const sections: ISection[] = [mockTranslationSection({ id: '1', from: 'Один' })]
            const { queryByText, queryByDisplayValue } = render(<Note sections={sections} />)

            await waitFor(() => expect(queryByText('Reset')).toBeDisabled())

            fireEvent.changeText(queryByDisplayValue('Один'), 'Море')

            await waitFor(() => {
                expect(queryByDisplayValue('Море')).toBeTruthy()
                expect(queryByText('Save')).toBeEnabled()
            })

            fireEvent.press(queryByText('Save'))

            await waitFor(() => {
                expect(queryByDisplayValue('Море')).toBeTruthy()
                expect(queryByText('Save')).toBeDisabled()
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

const oneTranslationSection: ISection[] = [mockTranslationSection({ id: '1' })]
