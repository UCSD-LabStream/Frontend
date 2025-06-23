import { labSlots } from "../Firebase/firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 


const writeSlots = async (startTimeInput, endTimeInput) => {
    try{
        console.log("trying to write");
        //const labSlotsRef = collection(labSlots, 'labSlots');
        //const slotRef = doc(labSlots, 'slots');
        const labSlotsCollection = collection(labSlots, "slots");
        const auth = getAuth();
        const user = auth.currentUser;
        const slotData = {
            startTime: Timestamp.fromDate(startTimeInput),
            endTime: Timestamp.fromDate(endTimeInput),
            bookedBy: "",
            createdBy: user.email,
            otherEmails: "",
            status: false,
            labName: "Fourier"
        }
        const docRef = await addDoc(labSlotsCollection, slotData);
        console.log("Data written successfully");
        } catch (error) {
            console.error(error);
        }
}

const writeBrewsterSlots = async (startTimeInput, endTimeInput) => {
    try {
        console.log("trying to write to brewsterSlots");
        const brewsterCollection = collection(labSlots, "Brewster");
        const auth = getAuth();
        const user = auth.currentUser;
        const slotData = {
            startTime: Timestamp.fromDate(startTimeInput),
            endTime: Timestamp.fromDate(endTimeInput),
            bookedBy: "",
            createdBy: user.email,
            otherEmails: "",
            status: false,
            labName: "Brewster"
        };
        const docRef = await addDoc(brewsterCollection, slotData);
        console.log("Data written successfully to brewsterSlots");
    } catch (error) {
        console.error("Error writing to brewsterSlots:", error);
    }
};

export { writeSlots, writeBrewsterSlots };