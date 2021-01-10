import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppNavigation } from './navigation'
import { AppProvider } from './AppContext'

export default () => {
    return (
        <NavigationContainer>
            <AppProvider>
                <AppNavigation />
            </AppProvider>
        </NavigationContainer>
    )
}
