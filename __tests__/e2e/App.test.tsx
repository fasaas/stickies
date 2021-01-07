import '@testing-library/jest-native/extend-expect'
import {
    cleanup,
    fireEvent,
    render,
    RenderAPI,
    waitFor,
    within,
} from '@testing-library/react-native'
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

const errorsToSilence = [
    'Warning: You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);',
    'Warning: An update to',
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
