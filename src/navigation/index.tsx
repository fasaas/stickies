import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NoteScreen } from '../screens/NoteScreen'
import { ExplorerScreen } from '../screens/ExplorerScreen'

const { Navigator, Screen } = createBottomTabNavigator()

export const AppNavigation = () => {
    return (
        <Navigator>
            <Screen name='Explorer' component={ExplorerScreen} />
            <Screen name='Note' component={NoteScreen} />
        </Navigator>
    )
}
