import { Stack } from 'expo-router';

export default function HomepageLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="detail" />
        </Stack>
    );
}
