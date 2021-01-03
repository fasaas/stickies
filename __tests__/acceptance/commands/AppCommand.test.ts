import AsyncStorage from '@react-native-async-storage/async-storage'
import AppCommands from '../../../src/commands/AppCommands'
import { NOTE_PREFIX } from '../../../src/constants'

describe('App Commands', () => {
    beforeEach(() => jest.restoreAllMocks())

    describe('saveNote', () => {
        describe('Returns failed', () => {
            test('Given id is invalid', async () => {
                for (const invalidId of [null, undefined, '', ' ', '  ']) {
                    const result = await AppCommands.saveNote(invalidId)

                    expect(result.failed).toBeTruthy()
                }
            })

            test('Given title is invalid', async () => {
                for (const invalidTitle of [null, undefined, '', ' ', '  ']) {
                    const result = await AppCommands.saveNote('valid Id', { title: invalidTitle })

                    expect(result.failed).toBeTruthy()
                }
            })

            test('Given createdAt is not a number', async () => {
                for (const invalidCreatedAt of [null, undefined, '', '7']) {
                    const result = await AppCommands.saveNote('valid Id', {
                        title: 'valid title',
                        createdAt: invalidCreatedAt,
                    })

                    expect(result.failed).toBeTruthy()
                }
            })

            test('Given lastModifiedAt is not a number', async () => {
                for (const invalidLastModifiedAt of [null, undefined, '', '7']) {
                    const result = await AppCommands.saveNote('valid Id', {
                        title: 'valid title',
                        createdAt: 12345,
                        lastModifiedAt: invalidLastModifiedAt,
                    })

                    expect(result.failed).toBeTruthy()
                }
            })

            test('Given sections are invalid', async () => {
                for (const invalidSections of [null, undefined, '', [], [{}]]) {
                    const result = await AppCommands.saveNote('valid Id', {
                        title: 'valid title',
                        createdAt: 12345,
                        lastModifiedAt: 54321,
                        sections: invalidSections,
                    })

                    expect(result.failed).toBeTruthy()
                }
            })

            test('Given sections are unstringifiable', async () => {
                jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
                    throw new Error('Unstringifiable content')
                })

                const result = await AppCommands.saveNote('valid Id', {
                    title: 'valid title',
                    createdAt: 12345,
                    lastModifiedAt: 54321,
                    sections: [{ name: 'Translation' }],
                })

                expect(result.failed).toBeTruthy()
            })

            test('Given AsyncStorage setItem fails', async () => {
                AsyncStorage.setItem = jest
                    .fn()
                    .mockRejectedValueOnce(new Error('Error setting item'))

                const result = await AppCommands.saveNote('valid Id', {
                    title: 'valid title',
                    createdAt: 12345,
                    lastModifiedAt: 54321,
                    sections: [{ name: 'Translation' }],
                })

                expect(result.failed).toBeTruthy()
            })
        })

        describe('Returns succeeded', () => {
            test('Given content is valid', async () => {
                const result = await AppCommands.saveNote('valid Id', {
                    title: 'valid title',
                    createdAt: 12345,
                    lastModifiedAt: 54321,
                    sections: [{ name: 'Translation' }],
                })

                expect(result.failed).toBeFalsy()
            })
        })
    })

    describe('getItems', () => {
        describe('Returns failed', () => {
            test('Given AsyncStorage getAllKeys fails', async () => {
                AsyncStorage.getAllKeys = jest
                    .fn()
                    .mockRejectedValueOnce(new Error('getAllKeys error'))

                const result = await AppCommands.getAllNotes()

                expect(AsyncStorage.getAllKeys).toHaveBeenCalled()
                expect(result.failed).toBeTruthy()
            })

            test('Given AsyncStorage multiGet fails', async () => {
                AsyncStorage.getAllKeys = jest.fn().mockResolvedValueOnce([`${NOTE_PREFIX}key-1`])
                AsyncStorage.multiGet = jest.fn().mockRejectedValueOnce(new Error('multiGet error'))

                const result = await AppCommands.getAllNotes()

                expect(AsyncStorage.multiGet).toHaveBeenCalled()
                expect(result.failed).toBeTruthy()
            })
        })

        describe('Returns empty notes', () => {
            test('Given AsyncStorage getAllKeys has no note related keys', async () => {
                const noteUnrelatedKeys = [[], ['unrelated-note-key-1']]

                for (const unrelatedKeys of noteUnrelatedKeys) {
                    AsyncStorage.getAllKeys = jest.fn().mockResolvedValueOnce(unrelatedKeys)

                    const result = await AppCommands.getAllNotes()

                    expect(AsyncStorage.getAllKeys).toHaveBeenCalled()
                    expect(result.notes).toStrictEqual([])
                }
            })
        })

        describe('Returns notes', () => {
            test('Given AsyncStorage multiGet returns notes', async () => {
                const noteRelatedKeys = ['unrelated-note-key-1', `${NOTE_PREFIX}id-1`]

                AsyncStorage.getAllKeys = jest.fn().mockResolvedValueOnce(noteRelatedKeys)
                AsyncStorage.multiGet = jest
                    .fn()
                    .mockResolvedValueOnce([
                        [`${NOTE_PREFIX}id-1`, JSON.stringify({ any: 'content' })],
                    ])

                const result = await AppCommands.getAllNotes()

                expect(AsyncStorage.multiGet).toHaveBeenCalledWith([`${NOTE_PREFIX}id-1`])
                expect(result.notes).toHaveLength(1)
                expect(result.notes).toMatchObject([{ any: 'content' }])
            })
        })
    })
})
