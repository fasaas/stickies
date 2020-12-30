import React from 'react'
import { TextInput, View } from 'react-native'
import { Picker } from './control/Picker'
import { useDispatch, useNote } from './context'
import { ISection } from './Types'
import Section from './section'
import { SaveControl } from './control/Save'
import { ResetControl } from './control/Reset'

export const Note = () => {
    const { sections, title } = useNote()
    const dispatch = useDispatch()
    return (
        <View key='note-view' testID='note-view'>
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
            <View key='submit-view'>
                <SaveControl />
                <ResetControl />
            </View>
        </View>
    )
}
