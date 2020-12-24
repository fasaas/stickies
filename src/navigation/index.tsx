import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NoteScreen } from '../note/Screen'

const { Navigator, Screen } = createBottomTabNavigator()

export const AppNavigation = () => {
    return (
        <Navigator>
            <Screen name='Note' component={NoteScreen} />
        </Navigator>
    )
}
