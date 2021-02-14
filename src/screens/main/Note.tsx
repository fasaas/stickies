import React from 'react'
import { NavigationProp, RouteProp } from '@react-navigation/native'
import { Button, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { INote, MAIN_NAV } from '../../constants'
import { usePots } from '../../contexts/pots'

type RouteProps = {
    'Note': {
        potId?: string,
        noteId?: string
    }
}

export const Note = ({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<RouteProps, 'Note'> }) => {
    const [hasParams, setHasParams] = React.useState(!!route.params)
    const [potId, setPotId] = React.useState(route?.params?.potId || undefined)
    const [note, setNote] = React.useState<INote | undefined>(undefined)
    const { pots } = usePots()

    React.useEffect(() => {
        const hasParams = !!route.params
        if (hasParams) {
            const { potId, noteId } = route.params
            const foundNote = pots?.find((pot) => pot.id === potId)?.notes.find((note) => note.id === noteId)

            setPotId(potId)
            setNote(foundNote)

        } else {
            setPotId(undefined)
            setNote(undefined)
        }
        setHasParams(!!route.params)

    }, [route.params])

    if (!hasParams) {
        return (
            <SafeAreaView>
                <View>
                    <Text>Create a new note in the Home screen</Text>
                    <Button title='Take me there' onPress={() => navigation.navigate(MAIN_NAV.Home)} />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView>
            <Text>Here you'll see the content for pot {potId} - {noteId}</Text>
            <Text>{JSON.stringify(note, null, 4)}</Text>
        </SafeAreaView>
    )
}