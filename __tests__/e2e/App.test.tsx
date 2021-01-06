import '@testing-library/jest-native/extend-expect'
import {
    fireEvent,
    render,
    RenderAPI,
    waitFor,
    waitForElementToBeRemoved,
    within,
} from '@testing-library/react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import App from '../../src/App'
import AppCommands from '../../src/commands/AppCommands'
import { NOTE_PREFIX } from '../../src/constants'

const initialMetrics = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
}
const TestApp = () => {
    return (
        <SafeAreaProvider initialMetrics={initialMetrics}>
            <App />
        </SafeAreaProvider>
    )
}

describe('I as the customer', () => {
    let App: RenderAPI
    beforeEach(() => (App = render(<TestApp />)))
    afterEach(async () => {
        jest.restoreAllMocks()
        mockConsole()
        await AsyncStorage.clear()
    })

    xtest('Renders', () => App.debug())

    test('I see a loading animation that hints the app is loading', () => {
        expect(App.queryByTestId('loading-app'))
    })

    describe('When the loading animation stops', () => {
        test("I'm initially in the Explorer tab (default)", async () => {
            await waitFor(() => expect(App.queryByA11yLabel(/Explorer/)).toBeTruthy())

            const ExplorerTab = within(App.queryByA11yLabel(/Explorer/))
            expect(ExplorerTab.queryByA11yState({ selected: true })).toBeTruthy()
        })

        describe('Given app failed to retrieve notes', () => {
            test('Show a retry button', async () => {
                jest.spyOn(AppCommands, 'getAllNotes').mockResolvedValueOnce({ failed: true })
                const App = render(<TestApp />)

                await waitForElementToBeRemoved(() => App.queryByTestId('loading-app'))
                await waitFor(() => expect(App.queryByTestId('app-retry')).toBeTruthy())
            })

            describe('When clicking on retry button', () => {
                test('Show bottom tabs if app succeeded in retrieving notes', async () => {
                    jest.spyOn(AppCommands, 'getAllNotes')
                        .mockResolvedValueOnce({ failed: true })
                        .mockResolvedValueOnce({ notes: [] })

                    const App = render(<TestApp />)

                    await waitFor(() => expect(App.queryByTestId('app-retry')).toBeTruthy())

                    fireEvent.press(App.queryByTestId('app-retry'))

                    await waitFor(() => {
                        expect(App.queryByA11yLabel(/Explorer/)).toBeTruthy()
                        expect(App.queryByA11yLabel(/Note/)).toBeTruthy()
                    })
                })

                test('Show a retry button if app failed to retrieve notes', async () => {
                    jest.spyOn(AppCommands, 'getAllNotes')
                        .mockResolvedValueOnce({ failed: true })
                        .mockResolvedValueOnce({ failed: true })

                    const App = render(<TestApp />)

                    await waitFor(() => expect(App.queryByTestId('app-retry')).toBeTruthy())

                    fireEvent.press(App.queryByTestId('app-retry'))

                    await waitFor(() => expect(App.queryByTestId('app-retry')).toBeTruthy())
                })
            })
        })

        describe('Given app succeeded in retrieving notes', () => {
            test('I see some bottom tabs', async () => {
                await waitFor(() => {
                    expect(App.queryByA11yLabel(/Explorer/)).toBeEnabled()
                    expect(App.queryByA11yLabel(/Note/)).toBeEnabled()
                })
            })
        })
    })

    describe("Given I'm in Explorer (default) tab", () => {
        test('I can see a Create new note button', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
        })

        describe('Clicking on Create new note button', () => {
            test("I'm taken to the note tab", async () => {
                await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())

                fireEvent.press(App.queryByText(/Create new note/))

                const ExplorerTab = within(App.queryByA11yLabel(/Explorer/))
                const NoteTab = within(App.queryByA11yLabel(/Note/))

                await waitFor(() => {
                    expect(ExplorerTab.queryByA11yState({ selected: false }))
                    expect(NoteTab.queryByA11yState({ selected: true }))
                })
            })
        })

        describe('When clicking on Note tab', () => {
            test('Navigate to Note tab', async () => {
                await waitFor(() => {
                    expect(App.queryByA11yLabel(/Explorer/)).toBeEnabled()
                    expect(App.queryByA11yLabel(/Note/)).toBeEnabled()
                })

                fireEvent.press(App.queryByA11yLabel(/Note/))

                const ExplorerTab = within(App.queryByA11yLabel(/Explorer/))
                const NoteTab = within(App.queryByA11yLabel(/Note/))

                await waitFor(() => {
                    expect(ExplorerTab.queryByA11yState({ selected: false }))
                    expect(NoteTab.queryByA11yState({ selected: true }))
                })
            })
        })
    })

    describe('Given I have no stored notes', () => {
        test('I see a text indicating I have no stored notes', async () => {
            await waitFor(() =>
                expect(App.queryByText("You don't have any saved notes")).toBeEnabled()
            )
        })

        test('I also see a Create new note button', async () => {
            await waitFor(() => expect(App.queryByText('Create new note')).toBeEnabled())
        })
    })
    describe('Given I want to create a new note', () => {
        test('I first use the Create new notebutton to go to Note tab', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            const NoteTab = within(App.queryByA11yLabel(/Note/))

            await waitFor(() => expect(NoteTab.queryByA11yState({ selected: true })))
        })

        test('I see an empty title with a placeholder', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            await waitFor(() =>
                expect(App.queryByPlaceholderText('Note title')).toHaveTextContent('')
            )
        })

        test('I enable the Save button by typing something in the title input', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            await waitFor(() =>
                expect(App.queryByPlaceholderText('Note title')).toHaveTextContent('')
            )
            const NoteView = within(App.queryByTestId('note-view'))
            fireEvent.changeText(NoteView.queryByPlaceholderText('Note title'), 'Any title')

            await waitFor(() => expect(NoteView.queryByText('Save')).toBeEnabled())
        })

        test('I get the confirmation that the note has been saved after clicking Save button', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            await waitFor(() =>
                expect(App.queryByPlaceholderText('Note title')).toHaveTextContent('')
            )
            const NoteView = within(App.queryByTestId('note-view'))
            fireEvent.changeText(NoteView.queryByPlaceholderText('Note title'), 'Any title')

            await waitFor(() => expect(NoteView.queryByText('Save')).toBeEnabled())
            fireEvent.press(NoteView.queryByText('Save'))

            await waitFor(() => expect(NoteView.queryByText('Saved!')).toBeTruthy())
        })

        test('I see the new note in the explorer tab', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            await waitFor(() =>
                expect(App.queryByPlaceholderText('Note title')).toHaveTextContent('')
            )
            const NoteView = within(App.queryByTestId('note-view'))
            fireEvent.changeText(NoteView.queryByPlaceholderText('Note title'), 'Any title')

            await waitFor(() => expect(NoteView.queryByText('Save')).toBeEnabled())
            fireEvent.press(NoteView.queryByText('Save'))

            await waitFor(() => expect(NoteView.queryByText('Saved!')).toBeTruthy())

            fireEvent.press(App.queryByA11yLabel(/Explorer/))

            await waitFor(() => {
                expect(App.queryByTestId('explorer-tree')).toBeTruthy()
            })

            const ExplorerView = within(App.queryByTestId('explorer-tree'))

            await waitFor(() => expect(ExplorerView.queryByText('Any title')).toBeTruthy())
        })

        test('I see the new note persisted when reloading the app', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            await waitFor(() =>
                expect(App.queryByPlaceholderText('Note title')).toHaveTextContent('')
            )
            const NoteView = within(App.queryByTestId('note-view'))
            fireEvent.changeText(NoteView.queryByPlaceholderText('Note title'), 'Any title')

            await waitFor(() => expect(NoteView.queryByText('Save')).toBeEnabled())
            fireEvent.press(NoteView.queryByText('Save'))

            await waitFor(() => expect(NoteView.queryByText('Saved!')).toBeTruthy())

            fireEvent.press(App.queryByA11yLabel(/Explorer/))

            await waitFor(() => expect(App.queryByTestId('explorer-tree')).toBeTruthy())

            const ExplorerView = within(App.queryByTestId('explorer-tree'))

            await waitFor(() => expect(ExplorerView.queryByText('Any title')).toBeTruthy())
            App.unmount()

            const AppReloaded = render(<TestApp />)

            await waitFor(() => expect(AppReloaded.queryByText('Any title')).toBeTruthy())
        })
    })

    describe('Given I already have multiple stored notes', () => {
        beforeEach(async () => {
            await AppCommands.saveNote('id1', {
                title: 'id1 title',
                createdAt: 12345,
                lastModifiedAt: 23456,
                sections: [
                    {
                        type: '@native/translation',
                        name: 'Translation',
                        id: Date.now().toString(),
                        props: { from: 'From value', to: 'To value' },
                    },
                ],
            })

            await AppCommands.saveNote('id2', {
                title: 'id2 title',
                createdAt: 98765,
                lastModifiedAt: 87654,
                sections: [
                    {
                        type: '@native/translation',
                        name: 'Translation',
                        id: Date.now().toString(),
                        props: { from: 'From value 2', to: 'To value 2' },
                    },
                ],
            })

            App = render(<TestApp />)
        })

        test('I see a heading', async () => {
            await waitFor(() => expect(App.queryByText('Stored notes')).toBeTruthy())
        })

        test('I also see a Create new note button', async () => {
            await waitFor(() => expect(App.queryByText('Create new note')).toBeEnabled())
        })

        test('I also see a tile for each stored note', async () => {
            await waitFor(() => {
                expect(App.queryAllByText(/ title/)).toHaveLength(2)
                expect(App.queryByText('id1 title')).toBeTruthy()
                expect(App.queryByText('id2 title')).toBeTruthy()
            })
        })

        test('I also see a remove icon for each stored note', async () => {
            await waitFor(() => expect(App.queryAllByTestId('remove-note')).toHaveLength(2))

            const withins = [`${NOTE_PREFIX}id1`, `${NOTE_PREFIX}id2`].map((noteId) =>
                within(App.queryByTestId(noteId))
            )
            await waitFor(() =>
                withins.forEach((within) =>
                    expect(within.queryAllByTestId('remove-note')).toHaveLength(1)
                )
            )
        })

        describe('When I click on the remove icon', () => {
            test("I don't see the remove icon", async () => {
                await waitFor(() => expect(App.queryAllByTestId('remove-note')).toHaveLength(2))
                const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                expect(firstExplorerNote.queryByTestId('remove-note')).not.toBeTruthy()
            })

            test('I see an undo button hinting I may roll back if I want to', async () => {
                await waitFor(() => expect(App.queryAllByTestId('remove-note')).toHaveLength(2))
                const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                await waitFor(() => expect(firstExplorerNote.queryByText('Undo')).toBeEnabled())
            })

            describe('When I click on the undo button', () => {
                test('I see my note again', async () => {
                    await waitFor(() => expect(App.queryAllByTestId('remove-note')).toHaveLength(2))
                    const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                    fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                    await waitFor(() => expect(firstExplorerNote.queryByText('Undo')).toBeEnabled())
                    fireEvent.press(firstExplorerNote.queryByText('Undo'))

                    await waitFor(() => expect(App.queryByText('id1 title')).toBeTruthy())
                })

                test("I don't see the undo button", async () => {
                    await waitFor(() => expect(App.queryAllByTestId('remove-note')).toHaveLength(2))
                    const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                    fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                    await waitFor(() => expect(firstExplorerNote.queryByText('Undo')).toBeEnabled())
                    fireEvent.press(firstExplorerNote.queryByText('Undo'))

                    expect(firstExplorerNote.queryByText('Undo')).not.toBeTruthy()
                })

                test("I don't see a black cross", async () => {
                    await waitFor(() => expect(App.queryAllByTestId('remove-note')).toHaveLength(2))
                    const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                    fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                    await waitFor(() => expect(firstExplorerNote.queryByText('Undo')).toBeEnabled())
                    fireEvent.press(firstExplorerNote.queryByText('Undo'))

                    expect(firstExplorerNote.queryByTestId('remove-box')).not.toBeTruthy()
                })
            })

            test('I see a black cross icon hinting a confirmation to remove the note', async () => {
                await waitFor(() => expect(App.queryAllByTestId('remove-note')).toHaveLength(2))
                const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                await waitFor(() =>
                    expect(firstExplorerNote.queryByTestId('remove-box')).toBeEnabled()
                )
            })

            describe('When I click on the black cross', () => {
                describe('Given app failed to remove note', () => {
                    test('I see a failing message where my note was before', async () => {
                        await waitFor(() =>
                            expect(App.queryAllByTestId('remove-note')).toHaveLength(2)
                        )
                        const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                        fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                        await waitFor(() =>
                            expect(firstExplorerNote.queryByTestId('remove-box')).toBeEnabled()
                        )
                        jest.spyOn(AppCommands, 'deleteNote').mockResolvedValueOnce({
                            failed: true,
                        })
                        fireEvent.press(firstExplorerNote.queryByTestId('remove-box'))

                        await waitFor(() =>
                            expect(
                                firstExplorerNote.queryByText(`Removing id1 title failed`)
                            ).toBeTruthy()
                        )
                    })

                    test('I see a Got it button', async () => {
                        await waitFor(() =>
                            expect(App.queryAllByTestId('remove-note')).toHaveLength(2)
                        )
                        const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                        fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                        await waitFor(() =>
                            expect(firstExplorerNote.queryByTestId('remove-box')).toBeEnabled()
                        )
                        jest.spyOn(AppCommands, 'deleteNote').mockResolvedValueOnce({
                            failed: true,
                        })
                        fireEvent.press(firstExplorerNote.queryByTestId('remove-box'))

                        await waitFor(() =>
                            expect(firstExplorerNote.queryByText('Got it')).toBeEnabled()
                        )
                    })

                    describe('When I click on the Got it button', () => {
                        test('I see my note again', async () => {
                            await waitFor(() =>
                                expect(App.queryAllByTestId('remove-note')).toHaveLength(2)
                            )
                            const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                            fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                            await waitFor(() =>
                                expect(firstExplorerNote.queryByTestId('remove-box')).toBeEnabled()
                            )
                            jest.spyOn(AppCommands, 'deleteNote').mockResolvedValueOnce({
                                failed: true,
                            })
                            fireEvent.press(firstExplorerNote.queryByTestId('remove-box'))

                            await waitFor(() =>
                                expect(firstExplorerNote.queryByText('Got it')).toBeEnabled()
                            )

                            fireEvent.press(firstExplorerNote.queryByText('Got it'))

                            await waitFor(() => expect(App.queryByText('id1 title')).toBeTruthy())
                        })
                    })
                })

                describe('Given app successfully removed the note', () => {
                    test('I no longer see my note', async () => {
                        await waitFor(() => {
                            expect(App.queryByText('id1 title')).toBeTruthy()
                            expect(App.queryAllByTestId('remove-note')).toHaveLength(2)
                        })
                        const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                        fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                        await waitFor(() =>
                            expect(firstExplorerNote.queryByTestId('remove-box')).toBeEnabled()
                        )
                        fireEvent.press(firstExplorerNote.queryByTestId('remove-box'))

                        await waitFor(() => expect(App.queryByText('id1 title')).not.toBeTruthy())
                    })

                    test('I see the other note alone', async () => {
                        await waitFor(() => {
                            expect(App.queryByText('id2 title')).toBeTruthy()
                            expect(App.queryAllByTestId('remove-note')).toHaveLength(2)
                        })
                        const firstExplorerNote = within(App.queryByTestId(`${NOTE_PREFIX}id1`))

                        fireEvent.press(firstExplorerNote.queryByTestId('remove-note'))

                        await waitFor(() =>
                            expect(firstExplorerNote.queryByTestId('remove-box')).toBeEnabled()
                        )
                        fireEvent.press(firstExplorerNote.queryByTestId('remove-box'))

                        await waitFor(() => expect(App.queryByText('id2 title')).toBeTruthy())
                    })
                })
            })
        })

        describe('When I click on the first note', () => {
            test('I see the content in detail inside the Note tab', async () => {
                await waitFor(() => expect(App.queryByText('id1 title')).toBeTruthy())

                fireEvent.press(App.queryByText('id1 title'))

                await waitFor(() => {
                    expect(App.queryByText('From value')).toBeTruthy()
                    expect(App.queryByText('To value')).toBeTruthy()
                })
            })
        })
    })

    xdescribe('Given I want to delete a created note', () => {
        test('I should first have a note', async () => {})
    })
})

const mockConsole = () => {
    const errorsToSilence = [
        'Warning: You called act(async () => ...) without await.',
        'Warning: An update to',
        "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in",
    ]

    const consoleError = console.error
    jest.spyOn(console, 'error').mockImplementation((message, ...optionalParams) => {
        if (errorsToSilence.some((error) => message.includes(error))) {
            // no-op
        } else {
            consoleError(message, optionalParams)
        }
    })

    jest.spyOn(console, 'warn').mockImplementation()
}
