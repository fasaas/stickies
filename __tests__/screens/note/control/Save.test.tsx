import '@testing-library/jest-native/extend-expect'
import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { SaveControl } from '../../../../src/screens/note/control/Save'
import * as Context from '../../../../src/screens/note/context'
import SaveClient from '../../../../src/screens/note/control/SaveClient'

const errorToSilence =
    'Warning: You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);'

const consoleError = console.error
jest.spyOn(console, 'error').mockImplementation((message, ...optionalParams) => {
    if (!message.includes(errorToSilence)) consoleError(message, optionalParams)
})

jest.spyOn(console, 'warn').mockImplementation()

describe('Save button', () => {
    beforeEach(() => {
        jest.restoreAllMocks()

        jest.spyOn(console, 'error').mockImplementation((message, ...optionalParams) => {
            if (!message.includes(errorToSilence)) consoleError(message, optionalParams)
        })
        jest.spyOn(console, 'warn').mockImplementation()

        SaveClient.save = jest.fn()
    })

    describe('When saving', () => {
        test('Show a Saving text with an activity indicator', async () => {
            jest.spyOn(Context, 'useNote').mockImplementation(() => ({ can: { save: true } }))
            jest.spyOn(Context, 'useDispatch').mockImplementation()

            const { queryByText, queryByTestId } = render(<SaveControl />)

            fireEvent.press(queryByText('Save'))

            await waitFor(() => {
                expect(queryByTestId('saving-activity')).toBeTruthy()
                expect(queryByText('Saving')).toBeTruthy()
            })

            expect(queryByText('Save')).not.toBeTruthy()
        })

        test('Call save client', async () => {
            const noteState = {
                id: 'any id',
                title: 'any title',
                sections: [{ type: '@native/translation' }, { type: '@native/translation' }],
                can: { save: true },
            }

            jest.spyOn(Context, 'useNote').mockImplementation(() => noteState)
            jest.spyOn(Context, 'useDispatch').mockImplementation()
            SaveClient.save = jest.fn()

            const { queryByText } = render(<SaveControl />)

            fireEvent.press(queryByText('Save'))

            await waitFor(() => {
                expect(SaveClient.save).toHaveBeenCalledWith(noteState.id, {
                    title: noteState.title,
                    sections: noteState.sections,
                })
            })
        })

        describe('Given save failed', () => {
            test('Show a dialog indicating Save was not possible', async () => {
                const noteState = {
                    id: 'any id',
                    title: 'any title',
                    sections: [{ type: '@native/translation' }, { type: '@native/translation' }],
                    can: { save: true },
                }

                jest.spyOn(Context, 'useNote').mockImplementation(() => noteState)
                jest.spyOn(Context, 'useDispatch').mockImplementation()
                jest.spyOn(SaveClient, 'save').mockResolvedValueOnce({ failed: { reason: 'any reason' } })

                const { queryByText } = render(<SaveControl />)

                fireEvent.press(queryByText('Save'))

                await waitFor(() => {
                    expect(queryByText('Saving failed')).toBeTruthy()
                    expect(queryByText('any reason')).toBeTruthy()
                    expect(queryByText('Got it')).toBeEnabled()
                })
            })

            describe('After dismissing dialog by hardware backbutton', () => {
                test('Enable save button again', async () => {
                    const noteState = {
                        id: 'any id',
                        title: 'any title',
                        sections: [{ type: '@native/translation' }, { type: '@native/translation' }],
                        can: { save: true },
                    }

                    jest.spyOn(Context, 'useNote').mockImplementation(() => noteState)
                    jest.spyOn(Context, 'useDispatch').mockImplementation()
                    jest.spyOn(SaveClient, 'save').mockResolvedValueOnce({ failed: true })

                    const { queryByText, queryByTestId } = render(<SaveControl />)

                    fireEvent.press(queryByText('Save'))

                    await waitFor(() => {
                        expect(queryByText('Saving failed')).toBeTruthy()
                    })

                    fireEvent(queryByTestId('failed-view'), 'dismiss')

                    await waitFor(() => {
                        expect(queryByTestId('failed-view')).toBeNull()
                        expect(queryByText('Save')).toBeEnabled()
                    })
                })
            })

            describe('After dismissing dialog by dialog button', () => {
                test('Enable save button again', async () => {
                    const noteState = {
                        id: 'any id',
                        title: 'any title',
                        sections: [{ type: '@native/translation' }, { type: '@native/translation' }],
                        can: { save: true },
                    }

                    jest.spyOn(Context, 'useNote').mockImplementation(() => noteState)
                    jest.spyOn(Context, 'useDispatch').mockImplementation()
                    jest.spyOn(SaveClient, 'save').mockResolvedValueOnce({ failed: true })

                    const { queryByText, queryByTestId } = render(<SaveControl />)

                    fireEvent.press(queryByText('Save'))

                    await waitFor(() => {
                        expect(queryByText('Got it')).toBeEnabled()
                    })

                    fireEvent.press(queryByText('Got it'))

                    await waitFor(() => {
                        expect(queryByTestId('failed-view')).toBeNull()
                        expect(queryByText('Save')).toBeEnabled()
                    })
                })
            })
        })

        describe('Given save succeeded', () => {
            test('Show saved with a checkmark', async () => {
                const noteState = {
                    id: 'any id',
                    title: 'any title',
                    sections: [{ type: '@native/translation' }, { type: '@native/translation' }],
                    can: { save: true },
                }

                jest.spyOn(Context, 'useNote').mockImplementation(() => noteState)
                jest.spyOn(Context, 'useDispatch').mockImplementation()
                jest.spyOn(SaveClient, 'save').mockResolvedValueOnce({ failed: false })

                const { queryByText, queryByTestId } = render(<SaveControl />)

                fireEvent.press(queryByText('Save'))

                await waitFor(() => {
                    expect(queryByTestId('saved-checkmark')).toBeTruthy()
                    expect(queryByText('Saved!')).toBeTruthy()
                })
            })

            describe('Given saved has been shown for two seconds', () => {
                test('Show disabled Save button', async () => {
                    const enabledState = {
                        id: 'any id',
                        title: 'any title',
                        sections: [{ type: '@native/translation' }, { type: '@native/translation' }],
                        can: { save: true },
                    }

                    const disabledState = {
                        id: 'any id',
                        title: 'any title',
                        sections: [{ type: '@native/translation' }, { type: '@native/translation' }],
                        can: { save: false },
                    }

                    jest.spyOn(Context, 'useNote')
                        .mockImplementationOnce(() => enabledState)
                        .mockImplementationOnce(() => enabledState)
                        .mockImplementationOnce(() => enabledState)
                        .mockImplementationOnce(() => disabledState)
                    jest.spyOn(Context, 'useDispatch').mockImplementation(() => () => {})
                    jest.spyOn(SaveClient, 'save').mockResolvedValueOnce({ failed: false })

                    const { queryByText } = render(<SaveControl />)

                    fireEvent.press(queryByText('Save'))

                    await waitFor(() => {
                        expect(queryByText('Save')).toBeTruthy()
                        expect(queryByText('Save')).toBeDisabled()
                    })
                })
            })
        })
    })
})
