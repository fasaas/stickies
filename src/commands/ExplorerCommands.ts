import AsyncStorageClient from '../clients/AsyncStorageClient'
import { NOTE_PREFIX } from '../constants'

const getItems = async () => {
    let allKeys = []
    try {
        allKeys = await AsyncStorageClient.readAllKeys()
    } catch (e) {
        return { failed: { reason: `AsyncStorage readAll failed: ${e.message || e}` } }
    }

    const filteredKeys = allKeys.filter((key) => key.startsWith(NOTE_PREFIX))
    if (filteredKeys.length === 0) return { notes: [] }

    try {
        const noteKeyValues = await AsyncStorageClient.multiRead(filteredKeys)

        return {
            notes: noteKeyValues
                .map(([_, value]) => !!value && JSON.parse(value))
                .filter(Boolean)
                .sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1)),
        }
    } catch (e) {
        return { failed: { reason: `Async storage multiRead failed: ${e.message || e}` } }
    }
}

export default { getItems }
