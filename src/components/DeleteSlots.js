import { labSlots } from "../Firebase/firebase";
import { doc, collection, deleteDoc } from "firebase/firestore";

// Delete from the general "slots" collection
const DeleteSlots = async (slotId) => {
  try {
    await deleteDoc(doc(labSlots, "slots", slotId));
  } catch (error) {
    console.error("Error deleting slot:", error);
  }
};

// Delete from the "brewster" subcollection
const DeleteBrewsterSlots = async (slotId) => {
  try {
    await deleteDoc(doc(labSlots, "Brewster", slotId));
  } catch (error) {
    console.error("Error deleting Brewster slot:", error);
  }
};

export { DeleteSlots, DeleteBrewsterSlots };
