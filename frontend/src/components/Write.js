import { labSlots } from "../Firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";


const updateBookingData = async (slotId, bookedByArgs, otherEmailsArgs) => {
    try{
        console.log("trying to book");
        //const labSlotsRef = collection(labSlots, 'labSlots');
        const slotRef = doc(labSlots, 'slots', slotId);

        await updateDoc(slotRef, {
            bookedBy: bookedByArgs,
            otherEmails: otherEmailsArgs,
            status: true
        });
        console.log("Data updated successfully");
        window.location.reload();
        } catch (error) {
            console.error(error);
        }
}


export default updateBookingData;