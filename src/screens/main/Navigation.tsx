import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Home } from './Home'
import { MAIN_NAV } from '../../constants'
import { Settings } from './Settings'
import { Note } from './Note'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

export const MainScreenNavigator = () => {
    return (
        <NavigationContainer>
            <Navigator shifting={false}>
                <Screen name={MAIN_NAV.Home} component={Home} />
                <Screen name={MAIN_NAV.Note} component={Note} />
                <Screen name={MAIN_NAV.Settings} component={Settings} />
            </Navigator>
        </NavigationContainer>
    )
}
