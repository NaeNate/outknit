import { Tabs } from "expo-router"

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ tabBarLabel: "Knit" }} />
      <Tabs.Screen name="library" options={{ tabBarLabel: "Library" }} />
    </Tabs>
  )
}
