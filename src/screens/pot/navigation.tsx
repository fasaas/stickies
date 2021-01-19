import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NoteScreen } from '../NoteScreen'
import { ExplorerScreen } from '../ExplorerScreen'
import { AntDesign, Feather } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { AppProvider } from '../../AppContext'

const { Navigator, Screen } = createBottomTabNavigator()

export const PotNavigation = () => {
    return (
        <AppProvider>
            <Navigator>
                <Screen
                    name='Explorer'
                    component={ExplorerScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <AntDesign name='book' size={24} color='black' />
                        ),
                    }}
                />
                <Screen
                    name='Note'
                    component={NoteScreen}
                    options={{
                        tabBarIcon: () => <Feather name='plus-circle' size={24} color='black' />,
                    }}
                />

                <Screen
                    name='Settings'
                    component={Settings}
                    options={{
                        tabBarIcon: () => <Feather name='plus-circle' size={24} color='black' />,
                    }}
                />
            </Navigator>
        </AppProvider>
    )
}

const Settings = () => {
    return (
        <View>
            <Text>Esto serán los settings</Text>
        </View>
    )
}
