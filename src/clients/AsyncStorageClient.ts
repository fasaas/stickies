import AsyncStorage from '@react-native-async-storage/async-storage'

const createOrUpdate = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value)
}

const erase = async (key: string) => {
    await AsyncStorage.removeItem(key)
}

const readAllKeys = async () => {
    return await AsyncStorage.getAllKeys()
}

const multiRead = async (keys: string[]) => {
    return await AsyncStorage.multiGet(keys)
}
export default { createOrUpdate, erase, readAllKeys, multiRead }
