import React from 'react'
import { Button, View } from 'react-native'
import { useDispatch, useSections } from './sections/Context'

export const FormControl = () => {
    const { isChanged } = useSections()
    const dispatch = useDispatch()

    return (
        <View key='submit-view'>
            <Button
                testID='save-note'
                title='Save'
                accessibilityLabel='Save note'
                disabled={!isChanged}
                onPress={() => dispatch({ type: 'save' })}
            />
            <Button
                testID='cancel-note'
                title='Cancel'
                accessibilityLabel='Cancel'
                disabled={!isChanged}
                onPress={() => dispatch({ type: 'cancel' })}
            />
        </View>
    )
}
