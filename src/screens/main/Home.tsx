import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { Button, Modal, Pressable, ScrollView, View } from 'react-native'
import { INote, IPot, MAIN_NAV, NOTE_PREFIX, supportedLocales } from '../../constants'
import { usePots } from '../../contexts/pots'
import { OptionsPicker } from '../../components/OptionsPicker'
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '../../components/Text'
import { RemoveButton } from '../../components/RemoveButton'

export const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const { pots } = usePots()
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text styles={{ color: 'red' }} >Click to REMOVE EVERYTHING -></Text>
                    <RemoveButton onTerminate={async () => await AsyncStorage.clear()} />
                </View>
                {
                    !!pots?.length
                        ? pots.map((pot, index) => <PotDisplay key={index} pot={pot} />)
                        : <Text>No pot chosen, go ahead and pick one!</Text>

                }
                <PotPicker />
            </ScrollView>
        </SafeAreaView>
    )
}

const PotDisplay = ({ pot }: { pot: IPot }) => {
    const [modalVisible, setModalVisible] = React.useState(false)
    const { dispatch } = usePots()
    const { navigate } = useNavigation()
    return (
        <View>
            <View key={`${pot.locale} heading`}>
                <Text>{pot.id} - {pot.locale}</Text>
                <AntDesign name="addfile" size={24} color="black" onPress={() => setModalVisible(true)} />
                <NewPotTitleModal pot={pot} modalVisible={modalVisible} setModalVisible={setModalVisible} />
                <FontAwesome name="remove" size={24} color="black" />
            </View>
            <View key='content'>
                {pot.notes.length ?
                    pot.notes.map((note, index) =>
                        <Pressable key={index} style={{ borderWidth: 3, borderColor: 'orange' }} onPress={() => { navigate(MAIN_NAV.Note, { noteId: note.id, potId: pot.id }) }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <Pressable onPress={() => { navigate(MAIN_NAV.Note, { noteId: note.id, potId: pot.id }) }}>
                                    <Text>{note.title}</Text>
                                </Pressable>
                                <View style={{ borderWidth: 2, borderColor: 'red' }}>
                                    <RemoveButton onTerminate={async () => {
                                        dispatch({ type: 'remove-note', event: { noteId: note.id } })
                                        await AsyncStorage.removeItem(`${NOTE_PREFIX}-${note.id}`)
                                    }} />
                                </View>
                            </View>
                        </Pressable>
                    )
                    : <Text>You have no notes for {pot.locale}</Text>}
            </View>
        </View>
    )
}

const NewPotTitleModal = (props: { pot: IPot; modalVisible: boolean; setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [title, setTitle] = React.useState('')
    const { dispatch } = usePots()
    return (
        <View>
            <Modal
                visible={props.modalVisible}
                animationType='slide'
                onRequestClose={() => props.setModalVisible(false)}
            >
                <Text>Which title</Text>
                <TextInput value={title} onChangeText={setTitle} placeholder='Title for the note' />
                <Button title='Create' disabled={!title} onPress={async () => {
                    const id = Date.now().toString()
                    const newNote: INote = { id, locale: props.pot.locale, title, sections: [] }
                    await AsyncStorage.setItem(`${NOTE_PREFIX}-${id}`, JSON.stringify(newNote))

                    dispatch({ type: 'add-note', event: { note: newNote, pot: props.pot } })
                    setTitle('')
                    props.setModalVisible(false)
                }} />
                <Button title='Cancel' onPress={() => { props.setModalVisible(false) }} />
            </Modal>
        </View>
    )
}

const NO_POT = ''
const PotPicker = () => {
    const { pots, dispatch } = usePots()

    const potLocales = pots?.map((pot) => pot.locale)
    const freePotOptions = potLocales
        ? supportedLocales.filter((supportedLocale) => !potLocales.includes(supportedLocale.value))
        : supportedLocales

    const [selectedPot, setSelectedPot] = React.useState<string>(NO_POT)

    const options = [{ label: 'Pick a language', value: NO_POT }].concat(freePotOptions)
    return (
        <View>
            {
                freePotOptions.length
                    ? (
                        <>
                            <OptionsPicker selection={selectedPot} onValueChange={setSelectedPot} options={options} />

                            <Button
                                disabled={selectedPot === NO_POT}
                                title='add pot'
                                onPress={async () => {
                                    const id = Date.now().toString()
                                    const pot: IPot = { id, locale: selectedPot, notes: [] }
                                    await AsyncStorage.setItem(`@pot-${id}`, JSON.stringify(pot))
                                    dispatch({ type: 'add-pot', event: { pot } })
                                    setSelectedPot(NO_POT)
                                }}
                            />
                        </>
                    )
                    : (
                        <Text>
                            We don't have any more languages to choose from, if we forgot yours, please send us an email blabla
                        </Text>
                    )
            }
        </View >
    )
}
