import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}
      initialRouteName="in_progress"
    >
      <Tabs.Screen
        name="in_progress"
        options={{
          title: "Home",
          headerTitle: "Home",
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
