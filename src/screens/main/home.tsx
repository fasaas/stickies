import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { Button, Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { IPot, supportedLocales } from '../../constants'
import { usePots } from '../../contexts/pots'

export const Home = ({ navigation }: { navigation: any }) => {
    const { pots, setPots } = usePots()
    const potLocales = pots?.map((pot) => pot.locale)

    const freePotLocales = potLocales
        ? supportedLocales.filter((supportedLocale) => !potLocales.includes(supportedLocale.locale))
        : supportedLocales

    const [selectedPot, setSelectedPot] = React.useState<string | undefined>(undefined)

    return (
        <View>
            {
                pots
                    ? pots.map((pot, index) => <Button key={index} title={pot.locale} onPress={() => navigation.navigate('Stickies')} />)
                    : <Text>No pot chosen, go ahead and pick one!</Text>

            }
            {
                freePotLocales.length
                    ? (
                        <>
                            <Picker selectedValue={selectedPot} onValueChange={(value) => setSelectedPot(value.toString())}>
                                <Picker.Item label='Pick a language' value={undefined} />
                                {freePotLocales.map(({ label, locale }) =>
                                    <Picker.Item label={label} value={locale} />
                                )}
                            </Picker>
                            <Button
                                disabled={!selectedPot}
                                title='add pot'
                                onPress={async () => {
                                    const id = Date.now().toString()
                                    const pot: IPot = { id, locale: selectedPot }
                                    await AsyncStorage.setItem(`@pot-${id}`, JSON.stringify(pot))
                                    const _pots = pots ? Array.from(pots) : []
                                    _pots.push(pot)
                                    setPots(_pots)
                                    setSelectedPot(undefined)
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
        </View>
    )
}