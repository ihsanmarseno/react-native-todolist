import { FontAwesome } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
