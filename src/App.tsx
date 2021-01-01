import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppNavigation } from './navigation'
import { AppProvider } from './context/AppContext'

export default () => {
    return (
        <AppProvider>
            <NavigationContainer>
                <AppNavigation />
            </NavigationContainer>
        </AppProvider>
    )
}
