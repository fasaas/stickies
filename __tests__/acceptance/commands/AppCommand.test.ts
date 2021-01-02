import AsyncStorage from '@react-native-async-storage/async-storage'
import AppCommands from '../../../src/commands/AppCommands'

describe('App Commands', () => {
    describe('Save', () => {
        describe('Return failed', () => {
            test.each([null, undefined, '', ' ', '  '])('Given id is invalid', async (invalidId) => {
                const result = await AppCommands.saveNote(invalidId)

                expect(result.failed).toBeTruthy()
            })

            test.each([null, undefined, '', ' ', '  '])('Given title is invalid', async (invalidTitle) => {
                const result = await AppCommands.saveNote('valid Id', { title: invalidTitle })

                expect(result.failed).toBeTruthy()
            })

            test.each([null, undefined, '', '7'])('Given createdAt is not a number', async (invalidCreatedAt) => {
                const result = await AppCommands.saveNote('valid Id', {
                    title: 'valid title',
                    createdAt: invalidCreatedAt,
                })

                expect(result.failed).toBeTruthy()
            })

            test.each([null, undefined, '', '7'])('Given lastModifiedAt is not a number', async (invalidLastModifiedAt) => {
                const result = await AppCommands.saveNote('valid Id', {
                    title: 'valid title',
                    createdAt: 12345
                    lastModifiedAt: invalidLastModifiedAt,
                })

                expect(result.failed).toBeTruthy()
            })

            test('Given AsyncStorage save fails', async () => {
                AsyncStorage.setItem = jest.fn().mockRejectedValueOnce(new Error('Error setting item'))

                await AppCommands.saveNote('any id', {})
            })
        })
    })
})
