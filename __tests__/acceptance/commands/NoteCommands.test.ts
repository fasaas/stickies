import AsyncStorageClient from '../../../src/clients/AsyncStorageClient'
import NoteCommands from '../../../src/commands/NoteCommands'
import { NOTE_PREFIX } from '../../../src/constants'

describe('Note commands', () => {
    beforeEach(() => jest.restoreAllMocks())

    describe('Save command', () => {
        describe('Given no id is provided', () => {
            test.each([null, undefined, '', ' ', '  '])('Return failed', async (invalidId) => {
                const result = await NoteCommands.save(invalidId, {})

                expect(result.failed).toBeTruthy()
            })
        })

        describe('Given content is invalid', () => {
            test.each([null, undefined])('Return failed', async (invalidContent) => {
                const result = await NoteCommands.save('validId', invalidContent)

                expect(result.failed).toBeTruthy()
            })
        })
        describe('Given no title is provided', () => {
            test.each([null, undefined, '', ' ', '  '])('Return failed', async (invalidTitle) => {
                const result = await NoteCommands.save('validId', { title: invalidTitle })

                expect(result.failed).toBeTruthy()
            })
        })

        describe('Given no sections are provided', () => {
            test.each([null, undefined, []])('Return failed', async (invalidSections) => {
                const result = await NoteCommands.save('validId', { title: 'Valid title', sections: invalidSections })

                expect(result.failed).toBeTruthy()
            })
        })

        describe('Given content is not JSON stringifiable', () => {
            test('Return failed', async () => {
                jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
                    throw new Error('Any error stringifying')
                })

                const result = await NoteCommands.save('validId', { title: 'Valid title', sections: [] })

                expect(result.failed).toBeTruthy()
            })
        })

        describe('Given arguments are valid', () => {
            test('Call AsyncStorageClient', async () => {
                AsyncStorageClient.createOrUpdate = jest.fn()
                const content = { title: 'Valid title', sections: [{}] }

                await NoteCommands.save('validId', content)

                expect(AsyncStorageClient.createOrUpdate).toHaveBeenCalledWith(
                    `${NOTE_PREFIX}validId`,
                    JSON.stringify({ ...content, id: 'validId' })
                )
            })

            describe('Given AsyncStorageClient rejects', () => {
                test('Return failed', async () => {
                    AsyncStorageClient.createOrUpdate = jest.fn().mockRejectedValueOnce(new Error())
                    const content = { title: 'Valid title', sections: [{}] }

                    const result = await NoteCommands.save('validId', content)

                    expect(result.failed).toBeTruthy()
                })
            })

            describe('Given AsyncStorageClient resolves', () => {
                test('Return success', async () => {
                    AsyncStorageClient.createOrUpdate = jest.fn().mockResolvedValueOnce(undefined)
                    const content = { title: 'Valid title', sections: [{}] }

                    const result = await NoteCommands.save('validId', content)

                    expect(result.failed).toBeFalsy()
                })
            })
        })
    })

    describe('Erase command', () => {
        describe('Given no id is provided', () => {
            test.each([null, undefined, '', ' ', '  '])('Return failed', async (invalidId) => {
                const result = await NoteCommands.erase(invalidId)

                expect(result.failed).toBeTruthy()
            })
        })

        describe('Given argumenta are valid', () => {
            test('Call AsyncStorageClient', async () => {
                AsyncStorageClient.erase = jest.fn()

                await NoteCommands.erase('validId')

                expect(AsyncStorageClient.erase).toHaveBeenCalledWith(`${NOTE_PREFIX}validId`)
            })

            describe('Given AsyncStorageClient rejects', () => {
                test('Return failed', async () => {
                    AsyncStorageClient.erase = jest.fn().mockRejectedValueOnce(new Error())

                    const result = await NoteCommands.erase('validId')

                    expect(result.failed).toBeTruthy()
                })
            })

            describe('Given AsyncStorageClient resolves', () => {
                test('Return success', async () => {
                    AsyncStorageClient.createOrUpdate = jest.fn().mockResolvedValueOnce(undefined)

                    const result = await NoteCommands.erase('validId')

                    expect(result.failed).toBeFalsy()
                })
            })
        })
    })
})
