import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import ExplorerClient from '../clients/ExplorerClient'
import { Ionicons } from '@expo/vector-icons'

export const ExplorerScreen = () => {
    const [state, setState] = useState('idle')

    useEffect(() => {
        const effect = async () => {
            setState('pending')
            const result = await ExplorerClient.getExplorerContent()
            if (result.failed) {
                setState('rejected')
            }
        }

        effect()
    }, [])

    if (state === 'pending') {
        return <ActivityIndicator testID='pending-content' />
    }

    if (state === 'rejected') {
        return (
            <View>
                <Ionicons name='refresh' size={24} color='black' testID='retry-fetching-notes' onPress={() => {}} />
                <Text>Unable to retrieve notes</Text>
            </View>
        )
    }

    return <View testID='idle' />
}
