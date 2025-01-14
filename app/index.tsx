import storage from "@react-native-async-storage/async-storage"
import { documentDirectory } from "expo-file-system"
import { useEffect, useState } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"

export type Clothing = {
  name: string
  type: string
}[]

export default function Index() {
  const [clothes, setClothes] = useState<Clothing>([])
  const [top, setTop] = useState<Clothing[number]>()
  const [bottom, setBottom] = useState<Clothing[number]>()
  const [topLock, setTopLock] = useState(false)
  const [bottomLock, setBottomLock] = useState(false)

  useEffect(() => {
    const start = async () => {
      setClothes(JSON.parse((await storage.getItem("images")) || "[]"))
    }

    start()
  }, [])

  const randomize = () => {
    if (!topLock) {
      const tops = clothes
        .filter((piece) => piece.type === "top")
        .filter((piece) => piece !== top)

      setTop(tops[Math.floor(Math.random() * tops.length)])
    }

    if (!bottomLock) {
      const bottoms = clothes
        .filter((piece) => piece.type === "bottom")
        .filter((piece) => piece !== bottom)

      setBottom(bottoms[Math.floor(Math.random() * bottoms.length)])
    }
  }

  return (
    <View style={{ marginTop: 100 }}>
      <View style={styles.center}>
        {top && (
          <Pressable onPress={() => setTopLock(!topLock)}>
            <Image
              source={{ uri: documentDirectory + top.name }}
              width={275}
              height={275}
              style={{ borderWidth: topLock ? 8 : 0 }}
            />
          </Pressable>
        )}

        {bottom && (
          <Pressable onPress={() => setBottomLock(!bottomLock)}>
            <Image
              source={{ uri: documentDirectory + bottom!.name }}
              width={275}
              height={275}
              style={{ borderWidth: bottomLock ? 8 : 0 }}
            />
          </Pressable>
        )}
      </View>

      <Pressable onPress={randomize} style={styles.button}>
        <Text style={styles.buttonText}>Randomize</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  center: { alignItems: "center" },
  button: {
    backgroundColor: "#7582d6",
    borderRadius: 10,
    margin: 15,
    padding: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
  },
})
