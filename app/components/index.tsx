import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import ScanInfos from "./scaninfos";
import { fetchData } from "../services/apiService";
import { useNavigation } from "expo-router";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [apiData, setApiData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getScannerPermissions();
  }, []);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const data = await fetchData("/orders");
        setApiData(data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data from API");
      }
    };
    retrieveData();
  }, [scanned]);

  const handleBarCodeScanned = ({ data }: { type: string; data: any }) => {
    const matchedItem = Object.values(apiData).find((item: any) => {
      return item.ID === data; 
    });
    if (matchedItem) {
      setScannedData(matchedItem);
    } else {
      Alert.alert("Error", "Aucune correspondance trouvée pour cet ID.");
    }
    setScanned(true);
  };

  const closeScanResult = () => {
    setScannedData(null); 
    setScanned(false);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      const matchedItem = Object.values(apiData).find(
        (item: any) => item.ID === manualInput
      );
      if (matchedItem) {
        setScannedData(matchedItem);
      } else {
        console.log("No match found");
      }
    } else {
      Alert.alert("Error", "Please enter a value");
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("historique" as never)}
        >
          <Image
            source={require("../assets/images/archiver.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </CameraView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={manualInput}
          onChangeText={setManualInput}
          placeholder="Or enter code manually"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleManualSubmit}
        >
          <Text style={styles.submitButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {scannedData && (
        <ScanInfos data={scannedData} onClose={closeScanResult} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logo: {
    width: 100,
    height: 40,
  },
  buttonImage: {
    width: 24,
    height: 24,
  },
  camera: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statusText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#048DFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
