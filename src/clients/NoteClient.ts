import { ISection } from '../screens/note/Types'

const save = async (id: string, content: { title: string; sections: ISection[] }) => {
    return { failed: false }
}

export default { save }
