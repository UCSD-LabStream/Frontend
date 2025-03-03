import { labSlots } from "../Firebase/firebase";
import { doc, collection, deleteDoc} from "firebase/firestore";

const DeleteSlots = async (slotId) => {
    const labSlotsCollection = collection(labSlots, "slots");
    try{
        await deleteDoc(doc(db, "slots", slotId));
    }
    catch (error){
        console.error("Error deleting slot:", error);
    }

}