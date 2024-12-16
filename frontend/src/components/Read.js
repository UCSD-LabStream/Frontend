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

export default readSlots;