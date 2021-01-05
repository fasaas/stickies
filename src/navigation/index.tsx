import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NoteScreen } from '../screens/NoteScreen'
import { ExplorerScreen } from '../screens/ExplorerScreen'
import { AntDesign, Feather } from '@expo/vector-icons'
import { TABS } from '../constants'

const { Navigator, Screen } = createBottomTabNavigator()

export const AppNavigation = () => {
    return (
        <Navigator>
            <Screen
                name={TABS.Explorer}
                component={ExplorerScreen}
                options={{
                    tabBarIcon: ({ focused }) => <AntDesign name='book' size={24} color='black' />,
                }}
            />
            <Screen
                name={TABS.Note}
                component={NoteScreen}
                options={{
                    tabBarIcon: () => <Feather name='plus-circle' size={24} color='black' />,
                }}
            />
        </Navigator>
    )
}
