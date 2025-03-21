import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { database, ref, onValue } from "../configs/firebaseConfig";
import styles from "../styles/styles";
import { ShippingStatus, ShippingStatusColor } from "../enum/shippingStatus";

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
        setHistorique(ordersArray.reverse());
      } else {
        setHistorique([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Text style={styles.idText}>📦 {item.id}</Text>
      <Text style={[styles.status, getStatusTextColor(item.status)]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
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

const getStatusTextColor = (status: any) => {
  switch (status) {
    case ShippingStatus.Pending:
      return { color: ShippingStatusColor.Pending_color };
    case ShippingStatus.Shipped:
      return { color: ShippingStatusColor.Shipped_color };
    case ShippingStatus.Rejected:
      return { color: ShippingStatusColor.Rejected_color };
    default:
      return { color: "black" };
  }
};
