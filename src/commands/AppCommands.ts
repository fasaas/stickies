const saveNote = async (id: string, content: { title: string; createdAt: number; lastModifiedAt: number }) => {
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
}

export default { saveNote }
