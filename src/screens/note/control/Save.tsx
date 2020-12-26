import React from 'react'
import { Button } from 'react-native'
import { useDispatch, useNote } from '../context'

export const SaveNote = () => {
    const { can } = useNote()
    const dispatch = useDispatch()

    return <Button title='Save' disabled={!can.save} onPress={() => dispatch({ type: 'save' })} />
}
