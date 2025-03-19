import { ref, get } from "firebase/database";
import { database } from "../configs/firebaseConfig";

export const fetchData = async (path: string) => {
  try {
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef); 
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("Aucune donnée disponible pour ce chemin");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    throw error;
  }
};
