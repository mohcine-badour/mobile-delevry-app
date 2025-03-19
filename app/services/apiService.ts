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

// import axios from "axios";

// const API_URL = "https://api.jsonsilo.com/5eb7429b-0558-4700-9af3-7beca8f1c5d4";
// const HEADERS = {
//   "X-SILO-KEY": "ZBybvpWcuE42AU39QbAFgEPLbSM08zNnQLB5diIkHk",
//   "Content-Type": "application/json",
// };

// export const fetchData = async () => {
//   try {
//     const response = await axios.get(API_URL, { headers: HEADERS });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };
