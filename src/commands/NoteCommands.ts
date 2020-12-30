import NoteAsyncStorageClient from '../clients/AsyncStorageClient'
import { NOTE_PREFIX } from '../constants'
import { ISection } from '../screens/note/Types'

const save = async (id: string, content: { title: string; sections: ISection[] }) => {
    if (!id || !id.trim()) {
        return { failed: { reason: `Id '${id}' is invalid` } }
    }

    if (!content) {
        return { failed: { reason: `Content '${content}' is invalid` } }
    }

    if (!content.title || !content.title.trim()) {
        return { failed: { reason: `Title '${content.title}' is invalid` } }
    }

    if (!content.sections || content.sections.length === 0) {
        return { failed: { reason: `Sections are invalid: ${content.sections}` } }
    }

    let stringifiedContent = ''
    try {
        stringifiedContent = JSON.stringify({ ...content, id })
    } catch (e) {
        return { failed: { reason: `Content is not stringifiable: ${e.message || e}` } }
    }

    try {
        await NoteAsyncStorageClient.createOrUpdate(`${NOTE_PREFIX}${id}`, stringifiedContent)
    } catch (e) {
        return { failed: { reason: `AsyncStorage write failed: ${e.message || e}` } }
    }

    return { failed: false }
}

const erase = async (id: string) => {
    if (!id || !id.trim()) {
        return { failed: { reason: `Id '${id}' is invalid` } }
    }

    try {
        await NoteAsyncStorageClient.erase(`${NOTE_PREFIX}${id}`)
    } catch (e) {
        return { failed: { reason: `AsyncStorage erase failed: ${e.message || e}` } }
    }

    return { failed: false }
}

export default { save, erase }
