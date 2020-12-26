import React from 'react'
import { TextInput, View } from 'react-native'
import { FormControl } from './control'
import { Picker } from './control/Picker'
import { useDispatch, useNote } from './context'
import { ISection } from './Types'
import Section from './section'

export const Note = () => {
    const { sections, title } = useNote()
    const dispatch = useDispatch()
    return (
        <View key='note-view'>
            <View key='title-view'>
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
