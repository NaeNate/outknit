import storage from "@react-native-async-storage/async-storage"
import { copyAsync, deleteAsync, documentDirectory } from "expo-file-system"
import { launchImageLibraryAsync } from "expo-image-picker"
import { useEffect, useState } from "react"
import { Image, Pressable, Text, View } from "react-native"

export default function Library() {
  const [images, setImages] = useState<string[]>([])

  const loadImages = async () => {
    setImages(await getExisting())
  }

  useEffect(() => {
    loadImages()
  }, [])

  const getExisting = async () => {
    return JSON.parse((await storage.getItem("images")) || "[]") as string[]
  }

  const addClothing = async () => {
    const result = await launchImageLibraryAsync({
      allowsMultipleSelection: true,
    })

    if (result.canceled) return

    let existing = await getExisting()

    for (const { uri } of result.assets) {
      const name = uri.split("/").pop()

      await copyAsync({
        from: uri,
        to: documentDirectory! + name,
      })

      existing = [...existing, name!]
    }

    await storage.setItem("images", JSON.stringify(existing))
    setImages(existing)
  }

  const deleteClothing = async (name: string) => {
    await deleteAsync(documentDirectory + name)

    const existing = await getExisting()
    const updated = existing.filter((image: string) => image !== name)
    await storage.setItem("images", JSON.stringify(updated))

    setImages(updated)
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Library</Text>

      <Pressable onPress={addClothing}>
        <Text>Add Clothing</Text>
      </Pressable>

      {images.map((name) => {
        return (
          <View key={name}>
            <Image
              source={{ uri: documentDirectory + name }}
              width={40}
              height={40}
            />

            <Pressable onPress={() => deleteClothing(name)}>
              <Text>Delete</Text>
            </Pressable>
          </View>
        )
      })}
    </View>
  )
}
