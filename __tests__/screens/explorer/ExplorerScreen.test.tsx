import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/react-native'
import { ExplorerScreen } from '../../../src/screens/ExplorerScreen'
import ExplorerClient from '../../../src/clients/ExplorerClient'
import { Button as nativeButton } from 'react-native'

const errorToSilence =
    'Warning: You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);'

const consoleError = console.error
jest.spyOn(console, 'error').mockImplementation((message, ...optionalParams) => {
    if (!message.includes(errorToSilence)) consoleError(message, optionalParams)
})

jest.spyOn(console, 'warn').mockImplementation()

jest.mock('@expo/vector-icons', () => {
    return {
        Ionicons: (props: any) => {
            console.log('Mocked ionicons')
            return <nativeButton {...props} />
        },
        FontAwesome: (props: any) => <nativeButton {...props} />,
        AntDesign: (props: any) => <nativeButton {...props} />,
    }
})

describe('Explorer', () => {
    beforeEach(() => {
        cleanup()
        jest.resetAllMocks()
        ExplorerClient.getExplorerContent = jest.fn()
    })

    test('Renders a loading indicator while fetching notes', async () => {
        const { queryByTestId } = render(<ExplorerScreen />)

        await waitFor(() => expect(queryByTestId('pending-content')).toBeTruthy())
    })

    test('Calls explorer client to fetch notes', async () => {
        render(<ExplorerScreen />)

        await waitFor(() => expect(ExplorerClient.getExplorerContent).toHaveBeenCalled())
    })

    describe('Given explorer client fails to fetch notes', () => {
        test('Render a message explaining inability to fetch notes', async () => {
            ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({ failed: true })
            const { queryByText } = render(<ExplorerScreen />)

            await waitFor(() => expect(queryByText('Unable to retrieve notes')).toBeTruthy())
        })

        test('Render a refresh button to hint a retry by pressing it', async () => {
            ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({ failed: true })
            const { queryByTestId } = render(<ExplorerScreen />)

            await waitFor(() => expect(queryByTestId('retry-fetching-notes')).toBeTruthy())
        })

        describe('When clicking on refresh button', () => {
            test('Calls explorer again client to fetch notes', async () => {
                ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({ failed: true })
                const { queryByTestId } = render(<ExplorerScreen />)

                await waitFor(() => expect(queryByTestId('retry-fetching-notes')).toBeTruthy())

                fireEvent.press(queryByTestId('retry-fetching-notes'))

                expect(ExplorerClient.getExplorerContent).toHaveBeenCalledTimes(2)
            })

            test('Renders again a loading indicator while fetching notes', async () => {
                ExplorerClient.getExplorerContent = jest.fn().mockResolvedValue({ failed: true })

                const { queryByTestId } = render(<ExplorerScreen />)

                await waitFor(() => expect(queryByTestId('retry-fetching-notes')).toBeTruthy())

                fireEvent.press(queryByTestId('retry-fetching-notes'))

                expect(queryByTestId('pending-content')).toBeTruthy()
            })
        })
    })

    describe('Given user has no stored notes', () => {
        test('Render a message indicating user has no notes', async () => {
            ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                notes: [],
            })

            const { queryByText } = render(<ExplorerScreen />)

            await waitFor(() => {
                expect(queryByText("You don't have any saved notes")).toBeTruthy()
            })
        })

        test('Render a button to create a new note in notes screen', async () => {
            ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                notes: [],
            })

            const { queryByText } = render(<ExplorerScreen />)

            await waitFor(() => {
                expect(queryByText('Create new note')).toBeEnabled()
            })
        })

        describe('When clicking on create new note button', () => {
            test('Navigates to note screen', async () => {
                ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                    notes: [],
                })

                const spy = jest.fn()
                const { queryByText } = render(<ExplorerScreen navigation={{ navigate: spy }} />)

                await waitFor(() => {
                    expect(queryByText('Create new note')).toBeEnabled()
                })

                fireEvent.press(queryByText('Create new note'))

                expect(spy).toHaveBeenCalled()
            })
        })
    })

    describe('Given user has stored notes', () => {
        test('Render a heading', async () => {
            ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                notes: [
                    { id: '1', title: 'repeated title' },
                    { id: '2', title: 'repeated title' },
                ],
            })

            const { queryByText } = render(<ExplorerScreen />)

            await waitFor(() => expect(queryByText('Stored notes')).toBeTruthy())
        })

        test('Render each note title', async () => {
            ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                notes: [
                    { id: '1', title: 'repeated title' },
                    { id: '2', title: 'repeated title' },
                ],
            })

            const { queryAllByText } = render(<ExplorerScreen />)

            await waitFor(() => expect(queryAllByText('repeated title')).toHaveLength(2))
        })

        test('Render a remove icon with each note tile', async () => {
            const notes = [
                { id: '1', title: 'first title' },
                { id: '2', title: 'second title' },
            ]
            ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                notes,
            })

            const { queryByTestId, queryAllByTestId } = render(<ExplorerScreen />)

            await waitFor(() => expect(queryAllByTestId('remove-note')).toHaveLength(2))

            const withins = notes.map((note) => within(queryByTestId(`note-${note.id}`)))
            await waitFor(() =>
                withins.forEach((within) => expect(within.queryAllByTestId('remove-note')).toHaveLength(1))
            )
        })

        describe('When clicking on the remove icon', () => {
            test('Render an Undo step before completely removing the note', async () => {
                const notes = [{ id: '1', title: 'first title' }]
                ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                    notes,
                })

                const { queryByText, queryByTestId } = render(<ExplorerScreen />)

                await waitFor(() => expect(queryByTestId('remove-note')).toBeTruthy())

                fireEvent.press(queryByTestId('remove-note'))

                await waitFor(() => {
                    expect(queryByText('Undo')).toBeTruthy()
                    expect(queryByTestId('remove-note')).not.toBeTruthy()
                })
            })

            describe('When clicking on the Undo button', () => {
                test('Render stored note again', async () => {
                    const notes = [{ id: '1', title: 'first title' }]
                    ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                        notes,
                    })

                    const { queryByText, queryByTestId } = render(<ExplorerScreen />)

                    await waitFor(() => expect(queryByTestId('remove-note')).toBeTruthy())
                    fireEvent.press(queryByTestId('remove-note'))

                    await waitFor(() => expect(queryByText('Undo')).toBeEnabled())

                    fireEvent.press(queryByText('Undo'))

                    await waitFor(() => {
                        expect(queryByText('first title')).toBeTruthy()
                        expect(queryByText('Undo')).not.toBeTruthy()
                    })
                })
            })

            describe('When clicking on the cross button', () => {
                test('Completely remove stored note', async () => {
                    const notes = [{ id: '1', title: 'first title' }]
                    ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                        notes,
                    })

                    const { queryByText, queryAllByTestId, queryByTestId } = render(<ExplorerScreen />)

                    await waitFor(() => expect(queryByTestId('remove-note')).toBeTruthy())
                    fireEvent.press(queryByTestId('remove-note'))

                    await waitFor(() => expect(queryByTestId('remove-box')).toBeEnabled())

                    fireEvent.press(queryByTestId('remove-box'))

                    await waitFor(() => {
                        expect(queryByText('first title')).not.toBeTruthy()
                        expect(queryByText("You don't have any saved notes")).toBeTruthy()
                        expect(queryByText('Create new note')).toBeEnabled()
                    })
                })
            })
        })

        describe('When clicking on any stored note', () => {
            test.each([0, 1])("Navigate over to note screen to show %s'd stored note", async (pressedIndex) => {
                const notes = [
                    { id: '1', title: 'repeated title' },
                    { id: '2', title: 'repeated title' },
                ]
                ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                    notes,
                })

                const spy = jest.fn()
                const { queryAllByText } = render(<ExplorerScreen navigation={{ navigate: spy }} />)

                await waitFor(() => expect(queryAllByText('repeated title')).toHaveLength(2))

                fireEvent.press(queryAllByText('repeated title')[pressedIndex])

                expect(spy).toHaveBeenCalledWith('Note', { id: notes[pressedIndex].id })
            })
        })

        test('Render a button to create a new note in notes screen', async () => {
            ExplorerClient.getExplorerContent = jest.fn().mockResolvedValueOnce({
                notes: [
                    { id: '1', title: 'repeated title' },
                    { id: '2', title: 'repeated title' },
                ],
            })

            const spy = jest.fn()
            const { queryByText } = render(<ExplorerScreen navigation={{ navigate: spy }} />)

            await waitFor(() => expect(queryByText('Create new note')).toBeEnabled())

            fireEvent.press(queryByText('Create new note'))

            expect(spy).toHaveBeenCalled()
        })
    })
})
