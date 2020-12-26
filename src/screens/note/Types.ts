export type ISection = {
    type: string
    name: string
    id: string
    props: any
}

export type State = {
    id: string
    title: string
    sections: ISection[]
    initial: { title: string; sections: string }
    can: { save: boolean; reset: boolean }
}
export type Action = {
    type: 'update-prop' | 'remove-section' | 'add-section' | 'reset' | 'save' | 'update-title'
    event?: any
}

export type Dispatch = (action: Action) => void
