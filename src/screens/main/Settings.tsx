import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useUserContext } from '../../contexts/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser, USER_FILE } from '../../constants';

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
                <Text >Example text for size</Text>
                <Text style={{ fontSize }}>Example text for size</Text>
                <View >
                    <Slider
                        step={2}
                        minimumValue={2}
                        maximumValue={36}
                        value={fontSize}
                        onValueChange={setFontSize}
                        minimumTrackTintColor="#000000"
                        maximumTrackTintColor="#FFFFFF"
                    />
                    <Text>{fontSize}</Text>
                </View>
            </View>

        </SafeAreaView>
    );
};
