import AsyncStorage from '@react-native-async-storage/async-storage'
import { NOTE_PREFIX } from '../constants'
import { Notes, Section, Sections } from '../interfaces'

const succeeded = { failed: false }

const saveNote = async (
    id: string,
    content: { title: string; createdAt: number; lastModifiedAt: number; sections: Sections }
) => {
    if (!id || id.trim().length === 0) {
        return { failed: { reason: `Id ${id} is invalid` } }
    }

    const { title } = content
    if (!title || title.trim().length === 0) {
        return { failed: { reason: `Title ${title} is invalid` } }
    }
    const { createdAt } = content
    if (!Number.isInteger(createdAt)) {
        return { failed: { reason: `CreatedAt ${createdAt} is not a number` } }
    }

    const { lastModifiedAt } = content
    if (!Number.isInteger(lastModifiedAt)) {
        return { failed: { reason: `LastModifiedAt ${lastModifiedAt} is not a number` } }
    }

    const { sections } = content
    if (
        !Array.isArray(sections) ||
        sections.length === 0 ||
        sections.some((section: Section) => Object.keys(section).length === 0)
    ) {
        return { failed: { reason: `Sections ${sections} are invalid` } }
    }

    let contentToSet
    try {
        contentToSet = JSON.stringify(content)
    } catch (e) {
        return {
            failed: { reason: `Content is unstringifiable ${e.message || e} type ${typeof e}` },
        }
    }

    try {
        await AsyncStorage.setItem(`${NOTE_PREFIX}${id}`, contentToSet)
    } catch (e) {
        const prettyContent = JSON.stringify(content, null, 4)
        const message = e.message || e
        return {
            failed: {
                reason: `Error AsyncStorage.setItem with key: ${NOTE_PREFIX}${id} - value: ${prettyContent}, ${message}`,
            },
        }
    }

    return succeeded
}

const getAllNotes = async (): Promise<{ failed?: { reason: string }; notes?: Notes }> => {
    let storedKeys = []
    try {
        storedKeys = await AsyncStorage.getAllKeys()
    } catch (e) {
        const message = e.message || e
        return { failed: { reason: `Error AsyncStorage.getAllNotes, ${message}` } }
    }

    const noteRelatedKeys = storedKeys.filter((key) => key.startsWith(NOTE_PREFIX))
    if (noteRelatedKeys.length === 0) return { notes: [] }

    try {
        const noteContents: [string, string | null][] = await AsyncStorage.multiGet(noteRelatedKeys)
        const filteredContents = []
        for (const [_, content] of noteContents) {
            if (!!content) filteredContents.push(JSON.parse(content))
        }

        return { notes: filteredContents }
    } catch (e) {
        const message = e.message || e
        return { failed: { reason: `Error AsyncStorage.multiGet, ${message}` } }
    }
}

export default { saveNote, getAllNotes }
