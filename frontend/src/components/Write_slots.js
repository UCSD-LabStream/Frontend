import { labSlots } from "../Firebase/firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";
import dayjs, { Dayjs } from 'dayjs';


const writeSlots = async (startTimeInput, endTimeInput) => {
    try{
        console.log("trying to write");
        //const labSlotsRef = collection(labSlots, 'labSlots');
        //const slotRef = doc(labSlots, 'slots');
        const labSlotsCollection = collection(labSlots, "slots");
        const slotData = {
            startTime: Timestamp.fromDate(startTimeInput.toDate()),
            endTime: Timestamp.fromDate(endTimeInput.toDate()),
            bookedBy: "",
            otherEmails: "",
            status: false
        }
        const docRef = await addDoc(labSlotsCollection, slotData);
        console.log("Data written successfully");
        } catch (error) {
            console.error(error);
        }
}


export default writeSlots;