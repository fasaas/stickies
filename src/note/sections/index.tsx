import React from 'react'
import { TextInput, View } from 'react-native'
import { FormControl } from '../FormControl'
import { Picker } from '../Picker'
import { ISection, useDispatch, useSections } from './Context'
import Section from './Section'

export default () => {
    const { sections, title } = useSections()
    const dispatch = useDispatch()
    return (
        <View key='note-view'>
            <View>
                <TextInput
                    placeholder='Note title'
                    value={title}
                    onChangeText={(title) => dispatch({ type: 'update-title', event: { title } })}
                />
            </View>
            <View key='sections-view' testID='sections-view'>
                {sections.map((section: ISection, index) => {
                    const { type, id } = section
                    return <Section key={`${type}-${id}-${index}`} section={section} />
                })}
            </View>
            <Picker />
            <FormControl />
        </View>
    )
}
