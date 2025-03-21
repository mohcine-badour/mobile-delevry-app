import React, { useEffect, useRef, useState } from "react";
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isPanding, setIsPanding] = useState(data.status === 'pending');
  const [isValidating, setIsValidating] = useState(false);

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
    if (data.status === "rejected" || data.status === "pending") {
      setIsValidating(true);

      // Fade in the "Validated!" message
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        const updatedData = { ...data, status: "shipped" };
        set(ref(database, `orders/${data.ID}`), updatedData)
          .then(() => {
            console.log("Status updated to 'shipped' successfully!");
            // After validation, fade out and slide down
            Animated.sequence([
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(slideAnim, {
                toValue: 300,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setIsValidating(false);
              onClose();
            });
          })
          .catch((error) => {
            console.error("Error saving data:", error);
            setIsValidating(false);
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
          });
      });
    } else {
      // If no validation needed, just slide down
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onClose());
    }
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
      {isValidating ? (
        <Animated.View
          style={[styles.validationContainer, { opacity: fadeAnim }]}
        >
          <Text style={styles.validationText}>Validated!</Text>
        </Animated.View>
      ) : data.error ? (
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
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{data.customerName}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{data.customerTel}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[
                styles.value,
                data.status === "pending"
                  ? styles.statusPending
                  : data.status === "shipped"
                  ? styles.statusShipped
                  : data.status === "rejected"
                  ? styles.statusRejected
                  : styles.statusOther,
              ]}
            >
              {data.status}
            </Text>
          </View>
        </View>
      )}
      {!isValidating && (
        <>
          {isPanding ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.validateButton}
                onPress={handleValidate}
              >
                <Text style={styles.buttonText}>Validate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleReject}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.validateButton} onPress={onClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
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
  validationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  validationText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#048DFF",
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
    color: "#FFA500", 
    fontWeight: "600",
  },
  statusShipped: {
    color: "#28a745", 
    fontWeight: "600",
  },
  statusRejected: {
    color: "#dc3545", 
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
