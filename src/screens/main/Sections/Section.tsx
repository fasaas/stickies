import { ISection } from "../../../constants";
import React from 'react'
import { Translation } from "./Translation";
import { View } from "react-native";
import { Verb } from "./Verb";
import { Text } from "./Text";
import { Adjective } from "./Adjective";

export const Section = ({ section, setSections, sections }: { section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {

    switch (section.type) {
        case '@native/translation': {
            return <Translation section={section} setSections={setSections} sections={sections} />
        }

        case '@native/verb': {
            return <Verb section={section} setSections={setSections} sections={sections} />
        }

        case '@native/text': {
            return <Text section={section} setSections={setSections} sections={sections} />
        }

        case '@native/adjective': {
            return <Adjective section={section} setSections={setSections} sections={sections} />
        }
    }

    return <View />
}