import React, { Fragment, useState } from 'react'
import { Button, Text, View } from 'react-native'
import { ISection, useDispatch } from './Context'
import { Translation } from './Translation'
import { AntDesign, FontAwesome } from '@expo/vector-icons'

export default ({ section }: { section: ISection }) => {
    const { name, id } = section
    const [canShow, show] = useState(true)
    const dispatch = useDispatch()
    return (
        <View key='section' testID='section'>
            {canShow ? (
                <Fragment>
                    <Text>{name}</Text>
                    <FontAwesome
                        testID='remove-section'
                        name='trash-o'
                        size={24}
                        color='black'
                        onPress={() => show(false)}
                    />
                    <Translation {...section} />
                </Fragment>
            ) : (
                <Fragment>
                    <Button testID='undo-button' title='Undo' onPress={() => show(true)} />
                    <AntDesign
                        testID='remove-box'
                        name='close'
                        size={24}
                        color='grey'
                        onPress={() => {
                            dispatch({ type: 'remove-section', event: { id } })
                        }}
                    />
                </Fragment>
            )}
        </View>
    )
}
