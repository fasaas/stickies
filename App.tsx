import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import App from './src/App'
import AppCommands from './src/commands/AppCommands'
import AsyncStorage from '@react-native-async-storage/async-storage'

// export default () => {
//     return (
//         <SafeAreaProvider>
//             <App />
//         </SafeAreaProvider>
//     )
// }

export default () => {
    const [load, setLoad] = useState(false)

    useEffect(() => {
        const effect = async () => {
            await AsyncStorage.clear()
            await AppCommands.saveNote('id1', {
                title: 'id1 title',
                createdAt: 12345,
                lastModifiedAt: 23456,
                sections: [
                    {
                        type: '@native/translation',
                        name: 'Translation',
                        id: Date.now().toString(),
                        props: { from: 'From value', to: 'To value' },
                    },
                ],
            })

            await AppCommands.saveNote('id2', {
                title: 'id2 title',
                createdAt: 98765,
                lastModifiedAt: 87654,
                sections: [
                    {
                        type: '@native/translation',
                        name: 'Translation',
                        id: Date.now().toString(),
                        props: { from: 'From value 2', to: 'To value 2' },
                    },
                ],
            })
            await AppCommands.saveNote('id3', {
                title: 'id3 title',
                createdAt: 98765,
                lastModifiedAt: 87654,
                sections: [
                    {
                        type: '@native/translation',
                        name: 'Translation',
                        id: Date.now().toString(),
                        props: { from: 'From value 3', to: 'To value 3' },
                    },
                ],
            })
            setLoad(true)
        }

        effect()
    }, [])

    if (!load) return null
    return (
        <SafeAreaProvider>
            <App />
        </SafeAreaProvider>
    )
}
