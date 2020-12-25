import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { useDispatch } from '../context'
import { ISection } from '../Types'

export const Translation = ({ props, id }: ISection) => {
    const dispatch = useDispatch()
    return (
        <View testID='@native/translation' data-sectiontType='@native/translation'>
            <Text>На русском</Text>
            <TextInput
                placeholder='Например ...'
                value={props.from}
                onChangeText={(text) => {
                    dispatch({ type: 'update-prop', event: { id, path: 'from', value: text } })
                }}
            />
            <Text>A castellano</Text>
            <TextInput
                placeholder='Por ejemplo ...'
                value={props.to}
                onChangeText={(text) => {
                    dispatch({ type: 'update-prop', event: { id, path: 'to', value: text } })
                }}
            />
        </View>
    )
}
