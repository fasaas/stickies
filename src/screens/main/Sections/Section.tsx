import { ISection } from "../../../constants";
import React from 'react'
import { Sentence } from "./Sentence";
import { View } from "react-native";
import { Verb } from "./Verb";

export const Section = ({ section, setSections, sections }: { section: ISection, setSections: React.Dispatch<React.SetStateAction<ISection[]>>, sections: ISection[] }) => {

    switch (section.type) {
        case '@native/sentence': {
            return <Sentence section={section} setSections={setSections} sections={sections} />
        }

        case '@native/verb': {
            return <Verb section={section} setSections={setSections} sections={sections} />

        }
    }

    return <View />
}