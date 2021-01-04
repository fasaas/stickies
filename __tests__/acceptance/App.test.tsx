import AsyncStorage from '@react-native-async-storage/async-storage'
import '@testing-library/jest-native/extend-expect'
import {
    cleanup,
    fireEvent,
    render,
    waitFor,
    waitForElementToBeRemoved,
    within,
} from '@testing-library/react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import App from '../../src/App'
import { Button as nativeButton } from 'react-native'
import AppCommands from '../../src/commands/AppCommands'

jest.mock('@expo/vector-icons', () => {
    return {
        Ionicons: (props: any) => <nativeButton {...props} />,
        FontAwesome: (props: any) => <nativeButton {...props} />,
        AntDesign: (props: any) => <nativeButton {...props} />,
        Feather: (props: any) => <nativeButton {...props} />,
    }
})

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

describe('App', () => {
    beforeEach(cleanup)
    afterEach(async () => await AsyncStorage.clear())

    test('Show a loading indicator before app is fully loaded', async () => {
        AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({ failed: true })
        const App = render(<TestApp />)

        expect(App.queryByTestId('loading-app')).toBeTruthy()
    })

    describe('When requesting for notes', () => {
        describe('Given request rejects', () => {
            test('Show a retry button', async () => {
                AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({ failed: true })
                const App = render(<TestApp />)

                await waitForElementToBeRemoved(() => App.queryByTestId('loading-app'))
                await waitFor(() => expect(App.queryByTestId('app-retry')).toBeTruthy())
            })

            describe('When clicking on retry button', () => {
                test('Show bottom tabs if new request resolves', async () => {
                    AppCommands.getAllNotes = jest
                        .fn()
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
            })
        })

        describe('Given request resolves', () => {
            test('Show bottom tabs', async () => {
                AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({ notes: [] })
                const App = render(<TestApp />)

                await waitFor(() => {
                    expect(App.queryByA11yLabel(/Explorer/)).toBeTruthy()
                    expect(App.queryByA11yLabel(/Note/)).toBeTruthy()
                })
            })
        })

        describe('Given request resolves with empty notes', () => {
            test('Indicate user has no notes', async () => {
                AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({ notes: [] })
                const App = render(<TestApp />)

                await waitFor(() =>
                    expect(App.queryByText("You don't have any saved notes")).toBeEnabled()
                )
            })

            test('Show a create new note button', async () => {
                AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({ notes: [] })
                const App = render(<TestApp />)

                await waitFor(() => expect(App.queryByText('Create new note')).toBeEnabled())
            })
        })

        describe('Given request resolves with notes', () => {
            test('Render a heading', async () => {
                AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({
                    notes: [
                        { id: '1', title: 'repeated title' },
                        { id: '2', title: 'repeated title' },
                    ],
                })

                const App = render(<TestApp />)

                await waitFor(() => expect(App.queryByText('Stored notes')).toBeTruthy())
            })

            test('Show a create new note button', async () => {
                AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({
                    notes: [
                        { id: '1', title: 'repeated title' },
                        { id: '2', title: 'repeated title' },
                    ],
                })

                const App = render(<TestApp />)

                await waitFor(() => expect(App.queryByText('Create new note')).toBeEnabled())
            })

            describe('When rendering all notes', () => {
                test('Render each note title', async () => {
                    AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({
                        notes: [
                            { id: '1', title: 'repeated title' },
                            { id: '2', title: 'repeated title' },
                        ],
                    })

                    const App = render(<TestApp />)

                    await waitFor(() =>
                        expect(App.queryAllByText('repeated title')).toHaveLength(2)
                    )
                })

                test('Render a remove icon with each note tile', async () => {
                    const notes = [
                        { id: '1', title: 'first title' },
                        { id: '2', title: 'second title' },
                    ]
                    AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({
                        notes,
                    })

                    const App = render(<TestApp />)

                    await waitFor(() => expect(App.queryAllByTestId('remove-note')).toHaveLength(2))

                    const withins = notes.map((note) => within(App.queryByTestId(note.id)))
                    await waitFor(() =>
                        withins.forEach((within) =>
                            expect(within.queryAllByTestId('remove-note')).toHaveLength(1)
                        )
                    )
                })

                describe('When clicking on the remove icon', () => {
                    test('Render an Undo step before completely removing the note', async () => {
                        AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({
                            notes: [{ id: '1', title: 'first title' }],
                        })

                        const App = render(<TestApp />)

                        await waitFor(() => expect(App.queryByTestId('remove-note')).toBeTruthy())

                        fireEvent.press(App.queryByTestId('remove-note'))

                        await waitFor(() => {
                            expect(App.queryByText('Undo')).toBeTruthy()
                            expect(App.queryByTestId('remove-note')).not.toBeTruthy()
                        })
                    })

                    describe('When clicking on the Undo button', () => {
                        test('Render stored note again', async () => {
                            AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({
                                notes: [{ id: '1', title: 'first title' }],
                            })

                            const App = render(<TestApp />)

                            await waitFor(() =>
                                expect(App.queryByTestId('remove-note')).toBeTruthy()
                            )
                            fireEvent.press(App.queryByTestId('remove-note'))

                            await waitFor(() => expect(App.queryByText('Undo')).toBeEnabled())

                            fireEvent.press(App.queryByText('Undo'))

                            await waitFor(() => {
                                expect(App.queryByText('first title')).toBeTruthy()
                                expect(App.queryByText('Undo')).not.toBeTruthy()
                            })
                        })
                    })

                    describe('When clicking on the permanently delete button', () => {
                        describe('Given remove request fails', () => {
                            test('Show a failing message indicating remove failed', async () => {
                                const note = { id: '1', title: 'first title' }
                                AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({
                                    notes: [note],
                                })

                                const App = render(<TestApp />)

                                await waitFor(() =>
                                    expect(App.queryByTestId('remove-note')).toBeTruthy()
                                )
                                fireEvent.press(App.queryByTestId('remove-note'))

                                await waitFor(() =>
                                    expect(App.queryByTestId('remove-box')).toBeEnabled()
                                )

                                AppCommands.deleteNote = jest
                                    .fn()
                                    .mockResolvedValueOnce({ failed: true })
                                fireEvent.press(App.queryByTestId('remove-box'))

                                await waitFor(() => {
                                    expect(
                                        App.queryByText(`Removing ${note.title} failed`)
                                    ).toBeTruthy()
                                    expect(App.queryByText('Got it')).toBeEnabled()
                                })
                            })

                            describe('After closing dialog by dialog button', () => {
                                test('Render about-to-remove note again', async () => {
                                    AppCommands.deleteNote = jest
                                        .fn()
                                        .mockResolvedValueOnce({ failed: true })
                                    const note = { id: '1', title: 'first title' }
                                    AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({
                                        notes: [note],
                                    })

                                    const App = render(<TestApp />)

                                    await waitFor(() =>
                                        expect(App.queryByTestId('remove-note')).toBeTruthy()
                                    )
                                    fireEvent.press(App.queryByTestId('remove-note'))

                                    await waitFor(() =>
                                        expect(App.queryByTestId('remove-box')).toBeEnabled()
                                    )

                                    fireEvent.press(App.queryByTestId('remove-box'))

                                    await waitFor(() => {
                                        expect(
                                            App.queryByText(`Removing ${note.title} failed`)
                                        ).toBeTruthy()
                                        expect(App.queryByText('Got it')).toBeEnabled()
                                    })

                                    fireEvent.press(App.queryByText('Got it'))

                                    await waitFor(() => {
                                        expect(App.queryByText(note.title)).toBeTruthy()
                                        expect(App.queryByText('Undo')).not.toBeTruthy()
                                    })
                                })
                            })
                        })

                        describe('Given remove request succeeds', () => {
                            test('Completely remove stored note', async () => {
                                AppCommands.deleteNote = jest.fn().mockResolvedValueOnce({})
                                const notes = [{ id: '1', title: 'first title' }]
                                AppCommands.getAllNotes = jest.fn().mockResolvedValueOnce({
                                    notes,
                                })

                                const App = render(<TestApp />)

                                await waitFor(() =>
                                    expect(App.queryByTestId('remove-note')).toBeTruthy()
                                )

                                fireEvent.press(App.queryByTestId('remove-note'))

                                await waitFor(() =>
                                    expect(App.queryByTestId('remove-box')).toBeEnabled()
                                )

                                fireEvent.press(App.queryByTestId('remove-box'))

                                await waitFor(() => {
                                    expect(App.queryByText('first title')).not.toBeTruthy()
                                    expect(App.queryAllByTestId(/NOTE_PREF/)).toHaveLength(0)
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    describe('Given user has no notes', () => {
        test('Click on ')
    })
})

const errorsToSilence = [
    'Warning: You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);',
    'Warning: An update to',
    "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in",
]

const consoleError = console.error
jest.spyOn(console, 'error').mockImplementation((message, ...optionalParams) => {
    if (!errorsToSilence.some((error) => message.includes(error)))
        consoleError(message, optionalParams)
})

jest.spyOn(console, 'warn').mockImplementation()
