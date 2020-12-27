import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native'
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
            console.log('Mocked ionicons props', props)
            return <nativeButton {...props} />
        },
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
    })
})
