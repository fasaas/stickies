import React, { Fragment, useState } from 'react'
import { Button, Modal, Pressable, Text, View } from 'react-native'
import { FontAwesome, AntDesign } from '@expo/vector-icons'

export const ExplorerItem = ({
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
                visible={onError}
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
