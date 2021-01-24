import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { Button, Modal, Text, View } from 'react-native'
import { INote, IPot, MAIN_NAV, NOTE_PREFIX, supportedLocales } from '../../constants'
import { usePots } from '../../contexts/pots'
import { OptionsPicker } from '../../components/LocalePicker'
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler'
import { NavigationProp, useNavigation } from '@react-navigation/native'

export const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const { pots } = usePots()
    return (
        <View>
            {
                pots
                    ? pots.map((pot, index) => <PotDisplay pot={pot} />)
                    : <Text>No pot chosen, go ahead and pick one!</Text>

            }
            <PotPicker />
        </View>
    )
}

const PotDisplay = ({ pot }: { pot: IPot }) => {
    const [modalVisible, setModalVisible] = React.useState(false)
    return (
        <View>
            <View key={`${pot.locale} heading`}>
                {pot.locale}
                <AntDesign name="addfile" size={24} color="black" onPress={() => setModalVisible(true)} />
                <NewPotTitleModal pot={pot} modalVisible={modalVisible} setModalVisible={setModalVisible} />
                <FontAwesome name="remove" size={24} color="black" />
            </View>
            <View key='content'>
                {pot.notes.length ?
                    pot.notes.map((note) => <Text>{JSON.stringify(note)}</Text>)
                    : <Text>You have no notes for {pot.locale}</Text>}
            </View>
        </View>
    )
}

const NewPotTitleModal = (props: { pot: IPot; modalVisible: boolean; setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [title, setTitle] = React.useState('')
    const navigation = useNavigation()
    return (
        <View>
            <Modal
                visible={props.modalVisible}
                onRequestClose={() => props.setModalVisible(false)}
            >
                <Text>Which title</Text>
                <TextInput value={title} onChangeText={setTitle} placeholder='Title for the note, can be empty' />
                <Button title='Create' onPress={async () => {
                    const id = Date.now().toString()
                    const newNote: INote = { id, locale: props.pot.locale, title }
                    await AsyncStorage.setItem(`${NOTE_PREFIX}-${id}`, JSON.stringify(newNote))
                    // append note to pot (easier with a reducer)
                    // navigate to note
                }} />
                <Button title='Cancel' onPress={() => { }} />
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
