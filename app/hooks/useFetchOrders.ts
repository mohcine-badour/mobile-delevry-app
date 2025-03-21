import { useState, useEffect } from "react";
import { fetchData } from "../services/apiService";
import { Alert } from "react-native";

export function useFetchOrders(trigger: boolean) {
  const [apiData, setApiData] = useState<any[]>([]);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const data = await fetchData("/orders");
        setApiData(data);
      } catch (error) {
        Alert.alert("Erreur", "Échec de la récupération des données API");
      }
    };
    retrieveData();
  }, [trigger]);

  return apiData;
}
