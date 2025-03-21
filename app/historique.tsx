import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { database, ref, onValue } from "./configs/firebaseConfig";

export default function HistoriqueScreen() {
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    const ordersRef = ref(database, "orders");

    const unsubscribe = onValue(ordersRef, (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const ordersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        })) as any;
        setHistorique(ordersArray.reverse()); // Afficher les plus récents en premier
      } else {
        setHistorique([]);
      }
    });

    return () => unsubscribe(); // Nettoyage lors du démontage du composant
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Text style={styles.idText}>📦 {item.id}</Text>
      <Text style={[styles.status, getStatusStyle(item.status)]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>📜 Historique des scans</Text> */}
      {historique.length > 0 ? (
        <FlatList
          data={historique}
          keyExtractor={(item: any) => item.ID}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noData}>Aucun scan enregistré.</Text>
      )}
    </View>
  );
}

const getStatusStyle = (status: any) => {
  switch (status) {
    case "pending":
      return { color: "orange" };
    case "shipped":
      return { color: "green" };
    case "rejected":
      return { color: "red" };
    default:
      return { color: "black" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "gray",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  idText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// export default function HistoriqueScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Ici historique</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
// });
