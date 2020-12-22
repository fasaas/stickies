import React from 'react'
import { Button, View } from 'react-native'
import { useDispatch, useSections } from './sections/Context'

export const FormControl = () => {
    const { isChanged } = useSections()
    const dispatch = useDispatch()

    return (
        <View key='submit-view'>
            <Button testID='save-note' title='Save' disabled={!isChanged} onPress={() => dispatch({ type: 'save' })} />
            <Button title='Reset' disabled={!isChanged} onPress={() => dispatch({ type: 'reset' })} />
        </View>
    )
}
