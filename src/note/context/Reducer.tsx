import { useReducer } from 'react'
import { ISection, State, Action } from '../Types'

const init = ({ title, sections }: { title?: string; sections?: ISection[] }): State => {
    const defaultSections: ISection[] = [
        { type: '@native/translation', name: 'Translation', id: Date.now().toString(), props: { from: '', to: '' } },
    ]

    const initialTitle = title || ''
    const initialSections = sections || defaultSections
    return {
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

            const canSaveOrReset = initial.sections !== JSON.stringify(sections)

            return { title, sections, initial, can: { save: canSaveOrReset, reset: canSaveOrReset } }
        }

        case 'remove-section': {
            const { sections, initial, title } = state

            const { id } = event
            const filteredSections = sections.filter((section) => section.id !== id)

            return { title, sections: filteredSections, initial, can: { save: true, reset: true } }
        }

        case 'add-section': {
            const { sections, initial, title } = state
            sections.push({
                type: '@native/translation',
                name: 'Translation',
                id: Date.now().toString(),
                props: { from: '', to: '' },
            })

            return { title, sections, initial, can: { save: true, reset: true } }
        }

        case 'reset': {
            const { initial } = state
            return {
                title: initial.title,
                sections: JSON.parse(initial.sections),
                initial,
                can: { save: false, reset: false },
            }
        }

        case 'save': {
            const { sections, title } = state
            return {
                title,
                sections,
                initial: { sections: JSON.stringify(sections), title },
                can: { save: false, reset: false },
            }
        }

        case 'update-title': {
            const { sections, initial } = state

            const canReset = initial.title !== event.title
            const canSave = canReset && !!event.title.trim()
            return { sections, title: event.title, initial, can: { save: canSave, reset: canReset } }
        }

        default: {
            throw new Error(`Type ${type} unsupported`)
        }
    }
}

export const useContextReducer = ({ title, sections }: { title?: string; sections?: ISection[] }) => {
    return useReducer(noteReducer, { title, sections }, init)
}
