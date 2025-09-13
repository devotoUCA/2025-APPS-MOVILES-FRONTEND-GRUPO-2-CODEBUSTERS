// gallery.tsx
import React, { useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type Product = {
  id: string;
  title: string;
  price: string;
  image: any;
  description: string;
};

const initialProducts: Product[] = [
  {
    id: "1",
    title: "Palo de Golf",
    price: "$1200",
    image: require("../../assets/palo-golf-anti-kuka.webp"),
    description: "Palo de Golf.",
  },
  {
    id: "2",
    title: "Cámara Digital",
    price: "$25000",
    image: { uri: "https://imgs.search.brave.com/6FpVx34500zLh6PirIPmZ2sFeOrZpiJEkIobpQaoK3s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzczNjI0Ni1DQlQ5/MDYyNjYxOTU2OV8w/ODIwMjUtVi1jYW1h/cmEtZGlnaXRhbC00/ay1wYXJhLWZvdG9n/cmFmaWEteS12aWRl/b2dyYWZpYS1jYW1h/cmEud2VicA" },
    description: "Cámara de alta resolución con zoom óptico.",
  },
  {
    id: "3",
    title: "Auriculares",
    price: "$3500",
    image: { uri: "https://imgs.search.brave.com/VAI0c0EPExusk0GC9dRfHp0yRIuH-UVO8VmW85nh7Tc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQy/Mjg1MTMxNi9lcy92/ZWN0b3IvYXVyaWN1/bGFyZXMtcmVhbGlz/dGFzLTNkLWJsYW5j/b3MtYWlzbGFkb3Mt/c29icmUtZm9uZG8t/YmxhbmNvLWlsdXN0/cmFjaSVDMyVCM24t/dmVjdG9yaWFsLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz00/dWQ0RE5FTTRteWl1/eGpGaHRLMGZUUl9N/OXNjb2RwR3NyMXh4/OGJBa3prPQ" },
    description: "Auriculares con cancelación de ruido.",
  },
  {
    id: "4",
    title: "Notebook",
    price: "$150000",
    image: require("../../assets/notebook.webp"),
    description: "Notebook ultraliviana con 16GB RAM.",
  },
  {
    id: "5",
    title: "Smartwatch",
    price: "$12000",
    image: { uri: "https://imgs.search.brave.com/nn21wj7wCXMFDC1CQ365t8Veu1btlxi-IRaEdFRXMt4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bWVnYXRvbmUubmV0/L2ltYWdlcy8vQXJ0/aWN1bG9zL3pvb20v/MjM5L01LVDIxNDdC/SUQtMS5qcGc_dmVy/c2lvbj0zNQ" },
    description: "Reloj inteligente con monitor cardíaco.",
  },
];

export default function GalleryScreen() {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [resizeMode, setResizeMode] = useState<"cover" | "contain" | "stretch">("cover");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar producto..."
        value={filter}
        onChangeText={setFilter}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              favorites.includes(item.id) && styles.favoriteCard,
            ]}
            onPress={() => setSelected(item)}
            onLongPress={() => toggleFavorite(item.id)}
          >
            <Image source={item.image} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </Pressable>
        )}
      />

      <Modal
        visible={!!selected}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <>
                <Image
                  source={selected.image}
                  style={styles.modalImage}
                  resizeMode={resizeMode}
                />
                <Text style={styles.modalTitle}>{selected.title}</Text>
                <Text style={styles.modalDescription}>{selected.description}</Text>

                <View style={styles.resizeRow}>
                  <Pressable
                    style={styles.resizeButton}
                    onPress={() => setResizeMode("cover")}
                  >
                    <Text>Cover</Text>
                  </Pressable>
                  <Pressable
                    style={styles.resizeButton}
                    onPress={() => setResizeMode("contain")}
                  >
                    <Text>Contain</Text>
                  </Pressable>
                  <Pressable
                    style={styles.resizeButton}
                    onPress={() => setResizeMode("stretch")}
                  >
                    <Text>Stretch</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setSelected(null)}
                >
                  <Text style={styles.closeText}>Cerrar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
    gap: 10,
  },
  favoriteCard: {
    borderColor: "gold",
    borderWidth: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 15,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  resizeRow: {
    flexDirection: "row",
    gap: 10,
  },
  resizeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
