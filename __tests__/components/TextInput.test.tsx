import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { TextInput } from '../../src/components/TextInput'

describe('Customized react native Text Input', () => {
    describe('Given empty text input', () => {
        describe('When typing a whitespace', () => {
            test('Do not call inner onChangeText method', () => {
                const spy = jest.fn()
                const { queryByTestId } = render(<TextInput testID='test-id' onChangeText={spy} />)

                fireEvent.changeText(queryByTestId('test-id'), ' ')

                expect(spy).not.toHaveBeenCalled()
            })
        })
        describe('When typing a char', () => {
            test('Call inner onChangeText method', () => {
                const spy = jest.fn()
                const { queryByTestId } = render(<TextInput testID='test-id' onChangeText={spy} />)

                fireEvent.changeText(queryByTestId('test-id'), 'text')

                expect(spy).toHaveBeenCalledWith('text')
            })
        })
    })
})
