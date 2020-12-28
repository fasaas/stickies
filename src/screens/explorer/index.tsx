import React, { Fragment, useEffect, useState } from 'react'
import { ActivityIndicator, Button, Modal, Pressable, Text, View } from 'react-native'
import ExplorerClient from '../../clients/ExplorerClient'
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons'
import NoteClient from '../../clients/NoteClient'

enum ExplorerState {
    Idle,
    Pending,
    Rejected,
    Resolved,
}

export const Explorer = ({ navigation }: { navigation: any }) => {
    const [state, setState] = useState(ExplorerState.Idle)
    const [notes, setNotes] = useState([])

    const effect = async () => {
        setState(ExplorerState.Pending)
        const result = await ExplorerClient.getExplorerContent()
        if (result.failed) {
            setState(ExplorerState.Rejected)
        }

        if (result.notes) {
            setNotes(result.notes)
            setState(ExplorerState.Resolved)
        }
    }

    const erase = async (id: string) => {
        const result = await NoteClient.erase(id)
        if (result.failed) return true

        const filteredNotes = notes.filter((note: any) => note.id !== id)
        setNotes(filteredNotes)
    }

    useEffect(() => {
        effect()
    }, [])

    if (state === ExplorerState.Pending) {
        return <ActivityIndicator testID='pending-content' />
    }

    if (state === ExplorerState.Rejected) {
        return (
            <View>
                <Ionicons
                    name='refresh'
                    size={24}
                    color='black'
                    testID='retry-fetching-notes'
                    onPress={async () => {
                        await effect()
                    }}
                />
                <Text>Unable to retrieve notes</Text>
            </View>
        )
    }

    if (state === ExplorerState.Resolved) {
        const hasNotes = notes.length > 0
        if (hasNotes) {
            return (
                <View testID='explorer-tree'>
                    <Text>Stored notes</Text>
                    {notes.map((note, index) => {
                        return <ExplorerItem note={note} key={`note-${index}`} navigation={navigation} erase={erase} />
                    })}
                    <Button title='Create new note' onPress={() => navigation.navigate('Note')} />
                </View>
            )
        } else {
            return (
                <View>
                    <Text>You don't have any saved notes</Text>
                    <Button title='Create new note' onPress={() => navigation.navigate('Note')} />
                </View>
            )
        }
    }

    return <View testID='idle' />
}

const ExplorerItem = ({
    note,
    navigation,
    erase,
}: {
    note: { id: string; title: string }
    navigation: any
    erase: Function
}): JSX.Element => {
    const [canShow, show] = useState(true)
    const [onError, setOnError] = useState(false)
    const { id, title } = note
    return (
        <View testID={`note-${id}`}>
            {canShow ? (
                <Fragment>
                    <FontAwesome
                        testID='remove-note'
                        name='trash-o'
                        size={24}
                        color='black'
                        onPress={() => show(false)}
                    />
                    <Pressable
                        style={{ backgroundColor: 'lightblue' }}
                        onPress={() => {
                            navigation.navigate('Note', { id })
                        }}
                    >
                        <Text>{title}</Text>
                    </Pressable>
                </Fragment>
            ) : (
                <Fragment>
                    <Button title='Undo' onPress={() => show(true)} />
                    <AntDesign
                        testID='remove-box'
                        name='close'
                        size={24}
                        color='grey'
                        onPress={async () => {
                            const failed = await erase(id)
                            if (failed) {
                                setOnError(true)
                            }
                        }}
                    />
                </Fragment>
            )}
            <Modal
                testID='erase-failed-view'
                visible={onError === true}
                onDismiss={() => {
                    show(true)
                    setOnError(false)
                }}
            >
                <View>
                    <Text>{`Erasing ${title} failed`}</Text>
                    <Button
                        title='Got it'
                        onPress={() => {
                            show(true)
                            setOnError(false)
                        }}
                    />
                </View>
            </Modal>
        </View>
    )
}
