import React, { Fragment, useState } from 'react'
import { Note, Notes } from '../../interfaces'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { ActivityIndicator, Button, Pressable, Text, View } from 'react-native'
import { useDeleteNote } from '../../context/AppContext'

export const ExplorerNotes = ({ notes }: { notes: Notes }) => {
    console.log('🚀 ~ file: ExplorerNotes.tsx ~ line 8 ~ ExplorerNotes ~ notes', notes)
    return (
        <View>
            {notes.map((note: Note, index: number) => (
                <View testID={note.id} key={`note-${index}`}>
                    <ExplorerNote note={note} />
                </View>
            ))}
        </View>
    )
}

enum ExplorerNoteStatus {
    DISPLAY = 'display',
    PRE_REMOVE = 'pre-remove',
    REMOVING = 'removing',
    REJECTED = 'rejected',
    RESOLVED = 'resolved',
}

const ExplorerNote = ({ note }: { note: Note }) => {
    const [status, setStatus] = useState(ExplorerNoteStatus.DISPLAY)
    console.log(
        '🚀 ~ file: ExplorerNotes.tsx ~ line 30 ~ ExplorerNote ~ status',
        note.id,
        status.toString()
    )
    const deleteNote = useDeleteNote()

    switch (status) {
        case ExplorerNoteStatus.DISPLAY: {
            return (
                <Fragment>
                    <FontAwesome
                        testID='remove-note'
                        name='trash-o'
                        size={24}
                        color='black'
                        onPress={() => setStatus(ExplorerNoteStatus.PRE_REMOVE)}
                    />
                    <Pressable>
                        <Text>{note.title}</Text>
                    </Pressable>
                </Fragment>
            )
        }

        case ExplorerNoteStatus.PRE_REMOVE: {
            return (
                <Fragment>
                    <Button title='Undo' onPress={() => setStatus(ExplorerNoteStatus.DISPLAY)} />
                    <AntDesign
                        testID='remove-box'
                        name='close'
                        size={24}
                        color='grey'
                        onPress={async () => {
                            console.log('Deleting', note.id)
                            setStatus(ExplorerNoteStatus.REMOVING)
                            const failed = await deleteNote(note.id)
                            if (failed) {
                                setStatus(ExplorerNoteStatus.REJECTED)
                            }
                        }}
                    />
                </Fragment>
            )
        }

        case ExplorerNoteStatus.REMOVING: {
            console.log('On removing state', note.id)
            return (
                <Fragment>
                    <ActivityIndicator />
                    <Button title='Removing' disabled={true} />
                </Fragment>
            )
        }

        case ExplorerNoteStatus.REJECTED: {
            return (
                <Fragment>
                    <Text>Removing {note.title} failed</Text>
                    <Button title='Got it' onPress={() => setStatus(ExplorerNoteStatus.DISPLAY)} />
                </Fragment>
            )
        }

        case ExplorerNoteStatus.RESOLVED: {
            return null
        }
    }
}
