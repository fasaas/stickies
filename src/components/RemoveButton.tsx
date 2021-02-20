import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { Text } from './Text';

enum RemoveState {
    IDLE,
    AWAIT_CONFIRMATION,
    TERMINATED
}

type RemoveButtonProps = {
    onTerminate: Function
}

export const RemoveButton = ({ onTerminate }: RemoveButtonProps) => {
    const [state, setState] = React.useState(RemoveState.IDLE)
    let timeout
    const [counter, setCounter] = React.useState(5)
    React.useEffect(() => {
        if (state === RemoveState.AWAIT_CONFIRMATION) {
            if (counter > 0) {
                timeout = setTimeout(() => setCounter(counter - 1), 1000)
                timeout
            } else {
                setCounter(5)
                setState(RemoveState.IDLE)
            }
        }

        return () => timeout && clearTimeout(timeout)
    }, [state, counter])

    switch (state) {
        case RemoveState.IDLE: {
            return <FontAwesome name="remove" size={24} color="black" onPress={() => setState(RemoveState.AWAIT_CONFIRMATION)} />
        }
        case RemoveState.AWAIT_CONFIRMATION: {
            return <Pressable style={{ flexDirection: 'row' }} onPress={async () => {
                setState(RemoveState.TERMINATED)
                await onTerminate()
            }}>
                <Text>({counter}) </Text>
                <FontAwesome name="check-square-o" size={24} color="black" />
            </Pressable>
        }
        case RemoveState.TERMINATED: return null
    }
}