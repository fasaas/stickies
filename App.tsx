import 'react-native-gesture-handler'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import App from './src/App'
import { AppearanceProvider } from 'react-native-appearance'

export default () => {
    return (
        <AppearanceProvider>
            <App />
        </AppearanceProvider>
    )
}
