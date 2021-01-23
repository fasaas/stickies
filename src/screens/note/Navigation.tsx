import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NoteScreen } from '../NoteScreen'
import { ExplorerScreen } from '../ExplorerScreen'
import { AntDesign, Feather } from '@expo/vector-icons'
import { AppProvider } from './AppContext'
import { POT_NAV } from '../../constants'

const { Navigator, Screen } = createBottomTabNavigator()

export const PotNavigation = () => {
    return (
        <AppProvider>
            <Navigator>
                <Screen
                    name={POT_NAV.Explorer}
                    component={ExplorerScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <AntDesign name='book' size={24} color='black' />
                        ),
                    }}
                />
                <Screen
                    name={POT_NAV.Note}
                    component={NoteScreen}
                    options={{
                        tabBarIcon: () => <Feather name='plus-circle' size={24} color='black' />,
                    }}
                />
            </Navigator>
        </AppProvider>
    )
}


