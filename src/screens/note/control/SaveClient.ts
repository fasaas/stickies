import { ISection } from '../Types'

const save = async (id: string, content: { title: string; sections: ISection[] }) => {
    return { failed: false }
}

export default { save }
