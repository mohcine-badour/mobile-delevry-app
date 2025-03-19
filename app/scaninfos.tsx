import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { database, ref, set } from "./configs/firebaseConfig";
import Toast from "react-native-toast-message";
interface ScanIfosProps {
  data: any; // The scanned data to display
  onClose: () => void; // Function to close the sheet
}

export default function ScanIfos({ data, onClose }: ScanIfosProps) {
  const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen

  const showToast = () => {
    Toast.show({
      type: "success", // 'success', 'error', 'info'
      text1: "Hello",
      text2: "This is a success message!",
    });
  };

  useEffect(() => {
    // Slide up when the component mounts
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  // Slide down and call onClose when done
  const handleValidate = () => {
    showToast();
    if (data.status === "rejected") {
      const updatedData = { ...data, status: "shipped" };
      console.log("updatedData", updatedData);

      set(ref(database, `orders/${data.ID}`), updatedData)
        .then(() => {
          console.log("Status updated to 'shipped' successfully!");
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    }

    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleReject = () => {
    if (data.status === "pending") {
      const updatedData = { ...data, status: "rejected" };
      console.log("updatedData", updatedData);
      set(ref(database, `orders/${data.ID}`), updatedData)
        .then(() => {
          console.log("Status updated to 'rejected' successfully!");
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    }

    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Animated.View
      style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}
    >
      {/* Content */}
      {data.error ? (
        <Text style={styles.errorText}>{data.error}</Text>
      ) : (
        <View style={styles.dataContainer}>
          <View style={styles.header}>
            <Text style={styles.bottomSheetTitle}>{data.ID}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{data.Address}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Customer Name</Text>
            <Text style={styles.value}>{data.customerName}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Customer Tel</Text>
            <Text style={styles.value}>{data.customerTel}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[
                styles.value,
                data.status === "pending"
                  ? styles.statusPending
                  : styles.statusOther,
              ]}
            >
              {data.status}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.validateButton}
          onPress={handleValidate}
        >
          <Text style={styles.buttonText}>Validate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 380, // dependece for content
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  bottomSheetTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  dataContainer: {
    paddingVertical: 15,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  statusPending: {
    color: "#FFA500", // Orange for pending
    fontWeight: "600",
  },
  statusOther: {
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "#DC3545", // Red for error
    textAlign: "center",
    paddingVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  validateButton: {
    backgroundColor: "#048DFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    shadowColor: "#048DFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  rejectButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    shadowColor: "#048DFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
