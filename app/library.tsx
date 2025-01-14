import Icons from "@expo/vector-icons/Ionicons"
import storage from "@react-native-async-storage/async-storage"
import { Picker } from "@react-native-picker/picker"
import { copyAsync, deleteAsync, documentDirectory } from "expo-file-system"
import { launchImageLibraryAsync } from "expo-image-picker"
import { useEffect, useState } from "react"
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { Clothing } from "./index"

export default function Library() {
  const [images, setImages] = useState<Clothing>([])
  const [showModal, setShowModal] = useState(false)
  const [uri, setUri] = useState("")
  const [type, setType] = useState("top")

  useEffect(() => {
    const x = async () => {
      setImages(await getExisting())
    }

    x()
  }, [])

  const getExisting = async () => {
    return JSON.parse((await storage.getItem("images")) || "[]") as Clothing
  }

  const selectImage = async () => {
    const result = await launchImageLibraryAsync({ allowsEditing: true })
    if (!result.canceled) setUri(result.assets[0].uri)
  }

  const submitClothing = async () => {
    const name = uri.split("/").pop()!
    const existing = [...(await getExisting()), { name, type }]

    await copyAsync({ from: uri, to: documentDirectory + name })
    await storage.setItem("images", JSON.stringify(existing))

    setImages(existing)
    setShowModal(false)
  }

  const deleteClothing = async (name: string) => {
    await deleteAsync(documentDirectory + name)

    const existing = await getExisting()
    const updated = existing.filter((image) => image.name !== name)
    await storage.setItem("images", JSON.stringify(updated))

    setImages(updated)
  }

  return (
    <View>
      <View>
        {images.map(({ name }) => {
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

      <Pressable onPress={() => setShowModal(true)}>
        <Text>Add Clothing</Text>
      </Pressable>

      {showModal && (
        <Modal animationType="slide">
          <View style={{ margin: 20 }}>
            <Pressable onPress={() => setShowModal(false)}>
              <Icons
                name="close"
                size={24}
                color="black"
                style={{ textAlign: "right", marginTop: 20 }}
              />
            </Pressable>

            <Pressable onPress={selectImage} style={styles.button}>
              <Text>Select Image</Text>
            </Pressable>

            <Picker
              selectedValue={type}
              onValueChange={(value) => setType(value)}
            >
              <Picker.Item value="top" label="Top" />
              <Picker.Item value="bottom" label="Bottom" />
            </Picker>

            <Pressable onPress={submitClothing} style={styles.button}>
              <Text>Submit</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#7582d6",
    borderRadius: 10,
    padding: 10,
  },
})
