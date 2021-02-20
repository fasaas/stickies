import React from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useUserContext } from '../../contexts/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser, USER_FILE } from '../../constants';
import { OptionsPicker } from '../../components/OptionsPicker';

const MIN_FONT_SIZE = 2;
const MAX_FONT_SIZE = 36
const FONT_SIZE_STEP = 2
const fontSizes: number[] = []
for (let fontSize = MIN_FONT_SIZE; fontSize <= MAX_FONT_SIZE; fontSize += FONT_SIZE_STEP) fontSizes.push(fontSize)

export const Settings = () => {
    const { state, dispatch } = useUserContext()
    const [fontSize, setFontSize] = React.useState(state.textSize);
    return (
        <SafeAreaView>
            <View>
                <Button
                    title='Save'
                    onPress={async () => {
                        dispatch({ type: 'update-text-size', newTextSize: fontSize })

                        const newUser: IUser = { ...state, textSize: fontSize }
                        await AsyncStorage.setItem(USER_FILE, JSON.stringify(newUser))
                    }}
                />
            </View>
            <View>
                <Text style={{ fontSize }}>Example text for size</Text>
                <Slider
                    minimumValue={MIN_FONT_SIZE}
                    maximumValue={MAX_FONT_SIZE}
                    step={FONT_SIZE_STEP}
                    value={fontSize}
                    onValueChange={setFontSize}
                    minimumTrackTintColor='#000000'
                    maximumTrackTintColor='#FFFFFF'
                />
                <OptionsPicker
                    selection={fontSize.toString()}
                    onValueChange={(value) => { setFontSize(parseInt(value.toString())) }}
                    options={fontSizes.map((size) => ({ label: size.toString(), value: size.toString() })
                    )}
                />
            </View>

        </SafeAreaView>
    );
};
