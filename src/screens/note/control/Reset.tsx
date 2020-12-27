import React from 'react'
import { Button } from 'react-native'
import { useDispatch, useNote } from '../context'

export const ResetControl = () => {
    const { can } = useNote()
    const dispatch = useDispatch()

    return <Button title='Reset' disabled={!can.reset} onPress={() => dispatch({ type: 'reset' })} />
}