import React from 'react'
import { Button, View } from 'react-native'
import { useDispatch, useNote } from './context'

export const FormControl = () => {
    const { can } = useNote()
    const dispatch = useDispatch()

    return (
        <View key='submit-view'>
            <Button title='Save' disabled={!can.save} onPress={() => dispatch({ type: 'save' })} />
            <Button title='Reset' disabled={!can.reset} onPress={() => dispatch({ type: 'reset' })} />
        </View>
    )
}
