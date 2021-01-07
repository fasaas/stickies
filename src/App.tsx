import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ActivityIndicator, View } from 'react-native'
import { AppNavigation } from './navigation'
import { AppProvider } from './AppContext'

enum AppStatus {
    IDLE,
    PENDING,
}

export default () => {
    const [appStatus, setAppStatus] = useState(AppStatus.IDLE)

    useEffect(() => {
        const effect = async () => {
            setAppStatus(AppStatus.PENDING)
        }

        effect()
    }, [])

    return (
        <NavigationContainer>
            <AppProvider>
                <AppNavigation />
            </AppProvider>
        </NavigationContainer>
    )
}
