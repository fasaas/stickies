import '@testing-library/jest-native/extend-expect'
import { fireEvent, render, RenderAPI, waitFor, within } from '@testing-library/react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import App from '../../src/App'
import AppCommands from '../../src/commands/AppCommands'

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
    afterEach(async () => await AsyncStorage.clear())

    xtest('Renders', () => App.debug())

    test('I see a loading animation that hints the app is loading stored notes', () => {
        expect(App.queryByTestId('loading-app'))
    })

    describe('When the loading animation stops', () => {
        test('I see some bottom tabs', async () => {
            await waitFor(() => {
                expect(App.queryByA11yLabel(/Explorer/)).toBeEnabled()
                expect(App.queryByA11yLabel(/Note/)).toBeEnabled()
            })
        })

        test("I'm initially in the Explorer tab (default)", async () => {
            await waitFor(() => expect(App.queryByA11yLabel(/Explorer/)).toBeTruthy())

            const ExplorerTab = within(App.queryByA11yLabel(/Explorer/))
            expect(ExplorerTab.queryByA11yState({ selected: true })).toBeTruthy()
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

    describe('Given I already have a created note', () => {
        beforeEach(async () => {
            await AppCommands.save('id1', {
                title: 'id1 title',
                sections: [
                    {
                        type: '@native/translation',
                        name: 'Translation',
                        id: Date.now().toString(),
                        props: { from: 'From value', to: 'To value' },
                    },
                ],
            })

            App = render(<TestApp />)
        })

        describe('When I click on that note', () => {
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

    xdescribe('Given I want to create a new note', () => {
        test('I first use the Create new note to go to Note tab', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            const NoteTab = within(App.queryByA11yLabel(/Note/))

            await waitFor(() => expect(NoteTab.queryByA11yState({ selected: true })))
        })

        test('I see an empty title with a placeholder', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            await waitFor(() => expect(App.queryByPlaceholderText('Note title')).toHaveTextContent(''))
        })

        test('I enable the Save button by typing something in the title input', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            await waitFor(() => expect(App.queryByPlaceholderText('Note title')).toHaveTextContent(''))
            const NoteView = within(App.queryByTestId('note-view'))
            fireEvent.changeText(NoteView.queryByPlaceholderText('Note title'), 'Any title')

            await waitFor(() => expect(NoteView.queryByText('Save')).toBeEnabled())
        })

        test('I get the confirmation that the note has been saved after clicking Save button', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            await waitFor(() => expect(App.queryByPlaceholderText('Note title')).toHaveTextContent(''))
            const NoteView = within(App.queryByTestId('note-view'))
            fireEvent.changeText(NoteView.queryByPlaceholderText('Note title'), 'Any title')

            await waitFor(() => expect(NoteView.queryByText('Save')).toBeEnabled())
            fireEvent.press(NoteView.queryByText('Save'))

            await waitFor(() => expect(NoteView.queryByText('Saved!')).toBeTruthy())
        })

        test('I see the new note in the explorer tab', async () => {
            await waitFor(() => expect(App.queryByText(/Create new note/)).toBeEnabled())
            fireEvent.press(App.queryByText(/Create new note/))

            await waitFor(() => expect(App.queryByPlaceholderText('Note title')).toHaveTextContent(''))
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
    })

    xdescribe('Given I want to delete a created note', () => {
        test('I should first have a note', async () => {})
    })
})

const errorsToSilence = [
    'Warning: You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);',
    'Warning: An update to',
    "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in",
]

const consoleError = console.error
jest.spyOn(console, 'error').mockImplementation((message, ...optionalParams) => {
    if (!errorsToSilence.some((error) => message.includes(error))) consoleError(message, optionalParams)
})

jest.spyOn(console, 'warn').mockImplementation()
