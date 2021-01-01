import React, { Fragment, useState } from 'react'
import { Button, Modal, Pressable, Text, View } from 'react-native'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import { ISection } from '../note/Types'

export const ExplorerItem = ({
    note,
    navigation,
    erase,
}: {
    note: { id: string; title: string; sections: ISection[] }
    navigation: any
    erase: Function
}): JSX.Element => {
    const [canShow, show] = useState(true)
    const [onError, setOnError] = useState(false)
    const { id, title, sections } = note

    return (
        <View testID={id}>
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
                            navigation.navigate('Note', { id, title, sections })
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
            {onError ? (
                <Modal
                    testID='erase-failed-view'
                    onDismiss={() => {
                        setOnError(false)
                        show(true)
                    }}
                >
                    <View>
                        <Text>{`Erasing ${title} failed`}</Text>
                        <Button
                            title='Got it'
                            onPress={() => {
                                setOnError(false)
                                show(true)
                            }}
                        />
                    </View>
                </Modal>
            ) : null}
        </View>
    )
}
