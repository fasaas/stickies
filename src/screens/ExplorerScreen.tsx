import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Explorer } from './explorer'

export const ExplorerScreen = ({ navigation }: { navigation: any }) => {
    return (
        <SafeAreaView>
            <Explorer navigation={navigation} />
        </SafeAreaView>
    )
}
