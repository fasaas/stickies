import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { Button, Text, View } from 'react-native'
import { IPot, supportedLocales } from '../../constants'
import { usePots } from '../../contexts/pots'
import { OptionsPicker } from '../../components/LocalePicker'

export const Home = ({ navigation }: { navigation: any }) => {
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

    return (
        <View>
            <View key={`${pot.locale} heading`}>
                {pot.locale}
            </View>
            <View key='content'>

            </View>
        </View>
    )
}

const NO_POT = ''
const PotPicker = () => {
    const { pots, setPots } = usePots()

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
                                    const pot: IPot = { id, locale: selectedPot }
                                    await AsyncStorage.setItem(`@pot-${id}`, JSON.stringify(pot))
                                    const _pots = pots ? Array.from(pots) : []
                                    _pots.push(pot)
                                    setPots(_pots)
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