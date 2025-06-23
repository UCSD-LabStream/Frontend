import { labSlots } from "../Firebase/firebase"; // Ensure this path is correct
import { collection, getDocs } from "firebase/firestore";

const readSlots = async () => {
  try {
    const slotsCollection = collection(labSlots, 'slots');
    const querySnapshot = await getDocs(slotsCollection);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return[];
  }
}

const readBrewsterSlots = async () => {
  try {
    const brewsterCollection = collection(labSlots, 'Brewster');
    const querySnapshot = await getDocs(brewsterCollection);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error("Error fetching Brewster data:", error);
    return [];
  }
};

export { readSlots, readBrewsterSlots };