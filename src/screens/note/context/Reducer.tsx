import { useReducer } from 'react'
import { ISection, State, Action } from '../Types'

const init = ({ id, title, sections }: { id?: string; title?: string; sections?: ISection[] }): State => {
    const defaultSections: ISection[] = [
        { type: '@native/translation', name: 'Translation', id: Date.now().toString(), props: { from: '', to: '' } },
    ]

    const initialTitle = title || ''
    const initialSections = sections || defaultSections
    const initialId = id || `note-${Date.now().toString()}`
    return {
        id: initialId,
        title: initialTitle,
        sections: initialSections,
        initial: { sections: JSON.stringify(initialSections), title: initialTitle },
        can: { save: false, reset: false },
    }
}

const noteReducer = (state: State, action: Action): State => {
    const { type, event } = action

    switch (type) {
        case 'update-prop': {
            const { id, path, value } = event
            const { initial, sections, title } = state
            const section: ISection | undefined = sections.find((section) => section.id === id)
            if (section) {
                section.props[path] = value
            }

            const sectionsAreChanged = initial.sections !== JSON.stringify(sections)
            const thereAreSections = sections.length > 0
            const thereIsTitle = title.trim().length > 0

            const canSave = thereIsTitle && thereAreSections && sectionsAreChanged
            const canReset = sectionsAreChanged

            return { id: state.id, title, sections, initial, can: { save: canSave, reset: canReset } }
        }

        case 'remove-section': {
            const { sections, initial, title, id } = state

            const filteredSections = sections.filter((section) => section.id !== event.id)

            const thereIsTitle = title.trim().length > 0
            const thereAreSections = filteredSections.length > 0
            const canSave = thereIsTitle && thereAreSections

            return { id, title, sections: filteredSections, initial, can: { save: canSave, reset: true } }
        }

        case 'add-section': {
            const { sections, initial, title, id } = state
            sections.push({
                type: '@native/translation',
                name: 'Translation',
                id: Date.now().toString(),
                props: { from: '', to: '' },
            })

            const thereIsTitle = title.trim().length > 0
            const canSave = thereIsTitle

            return { id, title, sections, initial, can: { save: canSave, reset: true } }
        }

        case 'reset': {
            const { initial, id } = state
            return {
                id,
                title: initial.title,
                sections: JSON.parse(initial.sections),
                initial,
                can: { save: false, reset: false },
            }
        }

        case 'save': {
            const { sections, title, id } = state
            return {
                id,
                title,
                sections,
                initial: { sections: JSON.stringify(sections), title },
                can: { save: false, reset: false },
            }
        }

        case 'update-title': {
            const { sections, initial } = state

            const canReset = initial.title !== event.title
            const thereAreSections = sections.length > 0
            const thereIsTitle = event.title.trim().length > 0

            const canSave = canReset && thereAreSections && thereIsTitle
            return { sections, title: event.title, initial, can: { save: canSave, reset: canReset } }
        }

        default: {
            throw new Error(`Type ${type} unsupported`)
        }
    }
}

export const useContextReducer = ({ id, title, sections }: { id?: string; title?: string; sections?: ISection[] }) => {
    return useReducer(noteReducer, { id, title, sections }, init)
}
