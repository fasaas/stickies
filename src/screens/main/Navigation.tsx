import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Home } from './Home'
import { MAIN_NAV } from '../../constants'
import { Settings } from './Settings'
import { Note } from './Note'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons';

const { Navigator, Screen } = createMaterialBottomTabNavigator()

export const MainScreenNavigator = () => {
    return (
        <NavigationContainer>
            <Navigator shifting={false}>
                <Screen
                    name={MAIN_NAV.Home}
                    component={Home}
                    options={{ tabBarIcon: ({ focused }) => <FontAwesome5 name="home" size={24} color={focused ? 'white' : 'black'} /> }} />
                <Screen
                    name={MAIN_NAV.Note}
                    component={Note}
                    options={{ tabBarIcon: ({ focused }) => <AntDesign name="form" size={24} color={focused ? 'white' : 'black'} /> }} />
                <Screen
                    name={MAIN_NAV.Settings}
                    component={Settings}
                    options={{ tabBarIcon: ({ focused }) => <MaterialIcons name="settings" size={24} color={focused ? 'white' : 'black'} /> }} />
            </Navigator>
        </NavigationContainer>
    )
}
