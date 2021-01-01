import AsyncStorageClient from '../../../src/clients/AsyncStorageClient'
import AppCommands from '../../../src/commands/AppCommands'
import { NOTE_PREFIX } from '../../../src/constants'

describe('App commands', () => {
    describe('Get Items', () => {
        test('Calls AsyncStorageClient to get all stored keys first', async () => {
            AsyncStorageClient.readAllKeys = jest.fn().mockResolvedValueOnce([])

            await AppCommands.getItems()

            expect(AsyncStorageClient.readAllKeys).toHaveBeenCalled()
        })

        describe('Given AsyncStorageClient rejects', () => {
            test('Return failed', async () => {
                AsyncStorageClient.readAllKeys = jest.fn().mockRejectedValueOnce(new Error())

                const result = await AppCommands.getItems()

                expect(result.failed).toBeTruthy()
            })
        })

        describe('Given AsyncStorageClient resolves no keys', () => {
            test('Do not call AsyncStorageClient to multi get stored note values', async () => {
                AsyncStorageClient.readAllKeys = jest.fn().mockResolvedValueOnce([])
                AsyncStorageClient.multiRead = jest.fn()

                await AppCommands.getItems()

                expect(AsyncStorageClient.multiRead).not.toHaveBeenCalled()
            })

            test('Return empty note values', async () => {
                AsyncStorageClient.readAllKeys = jest.fn().mockResolvedValueOnce([])

                const result = await AppCommands.getItems()

                expect(result.notes).toStrictEqual([])
            })
        })

        describe('Given AsyncStorageClient resolves keys unrelated to notes', () => {
            test('Do not call AsyncStorageClient to multi get stored note values', async () => {
                AsyncStorageClient.readAllKeys = jest.fn().mockResolvedValueOnce(['not-a-note-1', 'not-a-note-2'])
                AsyncStorageClient.multiRead = jest.fn()

                await AppCommands.getItems()

                expect(AsyncStorageClient.multiRead).not.toHaveBeenCalled()
            })

            test('Return empty note values', async () => {
                AsyncStorageClient.readAllKeys = jest.fn().mockResolvedValueOnce(['not-a-note-1', 'not-a-note-2'])

                const result = await AppCommands.getItems()

                expect(result.notes).toStrictEqual([])
            })
        })

        describe('Given AsyncStorageClient resolves note related and note unrelated keys', () => {
            test.each`
                allKeys                                                     | expectedMultiReadKeys
                ${[`${NOTE_PREFIX}id1`, 'not-a-note', `${NOTE_PREFIX}id2`]} | ${[`${NOTE_PREFIX}id1`, `${NOTE_PREFIX}id2`]}
                ${[`${NOTE_PREFIX}id1`, 'not-a-note']}                      | ${[`${NOTE_PREFIX}id1`]}
                ${[`${NOTE_PREFIX}id1`]}                                    | ${[`${NOTE_PREFIX}id1`]}
                ${['not-a-note-1', `${NOTE_PREFIX}id1`, 'not-a-note-2']}    | ${[`${NOTE_PREFIX}id1`]}
            `(
                'Calls AsyncStorageClient to multi get stored note values only',
                async ({ allKeys, expectedMultiReadKeys }) => {
                    AsyncStorageClient.readAllKeys = jest.fn().mockResolvedValueOnce(allKeys)
                    AsyncStorageClient.multiRead = jest.fn()

                    await AppCommands.getItems()

                    expect(AsyncStorageClient.multiRead).toHaveBeenCalledWith(expectedMultiReadKeys)
                }
            )

            describe('Given multi get rejects', () => {
                test('Return failed', async () => {
                    AsyncStorageClient.readAllKeys = jest.fn().mockResolvedValueOnce([`${NOTE_PREFIX}id1`])
                    AsyncStorageClient.multiRead = jest.fn().mockRejectedValueOnce(new Error())

                    const result = await AppCommands.getItems()

                    expect(result.failed).toBeTruthy()
                })
            })

            describe('Given multi get resolves', () => {
                test('Returns notes ordered by last modified date descending', async () => {
                    AsyncStorageClient.readAllKeys = jest
                        .fn()
                        .mockResolvedValueOnce([`${NOTE_PREFIX}id1`, `${NOTE_PREFIX}id2`, `${NOTE_PREFIX}id3`])

                    const firstIdStoredValue = {
                        id: 'id1',
                        title: 'id 1 title',
                        sections: [],
                        lastModified: '1609255251295',
                    }
                    const secondIdStoredValue = {
                        id: 'id2',
                        title: 'id 2 title',
                        sections: [],
                        lastModified: '1609255251294',
                    }
                    const thirdIdStoredValue = {
                        id: 'id3',
                        title: 'id 3 title',
                        sections: [],
                        lastModified: '1609255251296',
                    }

                    AsyncStorageClient.multiRead = jest.fn().mockResolvedValueOnce([
                        [`${NOTE_PREFIX}id1`, JSON.stringify(firstIdStoredValue)],
                        [`${NOTE_PREFIX}id2`, JSON.stringify(secondIdStoredValue)],
                        [`${NOTE_PREFIX}id3`, JSON.stringify(thirdIdStoredValue)],
                    ])

                    const result = await AppCommands.getItems()

                    expect(result.notes).toStrictEqual([thirdIdStoredValue, firstIdStoredValue, secondIdStoredValue])
                })
            })
        })
    })
})
