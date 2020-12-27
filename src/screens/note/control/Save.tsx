import React, { useState, useEffect, useRef } from 'react'
import { ActivityIndicator, Button, Modal, Text, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useDispatch, useNote } from '../context'
import SaveClient from '../../../clients/NoteClient'

enum SaveStatus {
    Unsaved,
    Saving,
    Failed,
    Saved,
}

export const SaveControl = () => {
    const [state, setState] = useState(SaveStatus.Unsaved)
    const [reasonForSaveFailure, setReasonForSaveFailure] = useState('')
    const { id, title, sections, can } = useNote()

    if (state === SaveStatus.Saving) {
        return (
            <View>
                <ActivityIndicator testID='saving-activity' />
                <Button title='Saving' disabled={true} />
            </View>
        )
    }

    if (state === SaveStatus.Failed) {
        return (
            <View>
                <Modal
                    testID='failed-view'
                    visible={state === SaveStatus.Failed}
                    onDismiss={() => {
                        setReasonForSaveFailure('')
                        setState(SaveStatus.Unsaved)
                    }}
                >
                    <View>
                        <Text>Saving failed</Text>
                        <Text>{reasonForSaveFailure}</Text>
                        <Button title='Got it' onPress={() => setState(SaveStatus.Unsaved)} />
                    </View>
                </Modal>
            </View>
        )
    }

    if (state === SaveStatus.Saved) {
        return <Saved setState={setState} />
    }

    return (
        <Button
            title='Save'
            disabled={!can.save}
            onPress={async () => {
                setState(SaveStatus.Saving)
                const saveResult = await SaveClient.save(id, { title, sections })
                if (saveResult.failed) {
                    setReasonForSaveFailure(saveResult.failed.reason)
                    setState(SaveStatus.Failed)
                } else {
                    setState(SaveStatus.Saved)
                }
            }}
        />
    )
}

const Saved = ({ setState }) => {
    const dispatch = useDispatch()
    useInterval(() => {
        dispatch({ type: 'save' })
        setState(SaveStatus.Unsaved)
    }, 2000)
    return (
        <View>
            <AntDesign testID='saved-checkmark' name='check' size={24} color='green' />
            <Button title='Saved!' />
        </View>
    )
}

function useInterval(callback, delay) {
    const savedCallback = useRef()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}
