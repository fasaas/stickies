import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import Note from '../../../../../src/screens/note'

jest.spyOn(console, 'warn').mockImplementation()

describe('Translation section', () => {
    test('Renders a from input', () => {
        const { queryByPlaceholderText } = render(<Note sections={[ATranslationSection({ id: '1' })]} />)

        expect(queryByPlaceholderText('Например ...'))
    })

    test('Renders a to input', () => {
        const { queryByPlaceholderText } = render(<Note sections={[ATranslationSection({ id: '1' })]} />)

        expect(queryByPlaceholderText('Por ejemplo ...'))
    })

    test('Updates the from input with the typed values', () => {
        const { queryByPlaceholderText, queryByDisplayValue } = render(
            <Note sections={[ATranslationSection({ id: '1' })]} />
        )

        fireEvent.changeText(queryByPlaceholderText('Например ...'), 'From input updated value')

        expect(queryByDisplayValue('From input updated value')).toBeTruthy()
    })

    test('Updates the to input with the typed values', () => {
        const { queryByPlaceholderText, queryByDisplayValue } = render(
            <Note sections={[ATranslationSection({ id: '1' })]} />
        )

        fireEvent.changeText(queryByPlaceholderText('Por ejemplo ...'), 'To input updated value')

        expect(queryByDisplayValue('To input updated value')).toBeTruthy()
    })
})

const ATranslationSection = ({ id, from = '', to = '' }: { id: string; from?: string; to?: string }): ISection => {
    return {
        type: '@native/translation',
        id,
        name: 'Translation',
        props: { from, to },
    }
}
