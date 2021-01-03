export type Notes = Note[]
export type Note = {
    id: string
    title: string
    createdAt: number
    lastMofidiedAt: number
    sections: Sections
}

export type Sections = Section[]
export type Section = {
    type: string
    id: string
    name: string
    props: any
}
