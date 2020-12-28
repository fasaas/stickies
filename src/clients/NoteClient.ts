import { ISection } from '../screens/note/Types'

const save = async (id: string, content: { title: string; sections: ISection[] }) => {
    return { failed: false }
}

const erase = async (id: string) => {}

export default { save, erase }
