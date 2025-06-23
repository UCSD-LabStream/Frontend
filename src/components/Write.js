import { labSlots } from "../Firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const updateBookingData = async (slotId, bookedByArgs, otherEmailsArgs) => {
  try {
    console.log("Trying to book in slots");
    const slotRef = doc(labSlots, 'slots', slotId);

    await updateDoc(slotRef, {
      bookedBy: bookedByArgs,
      otherEmails: otherEmailsArgs,
      status: true,
    });

    console.log("Data updated successfully");
    window.location.reload();
  } catch (error) {
    console.error("Error updating slot booking:", error);
  }
};

const updateBrewsterBookingData = async (slotId, bookedByArgs, otherEmailsArgs) => {
  try {
    console.log("Trying to book in Brewster");
    const slotRef = doc(labSlots, 'Brewster', slotId);

    await updateDoc(slotRef, {
      bookedBy: bookedByArgs,
      otherEmails: otherEmailsArgs,
      status: true,
    });

    console.log("Brewster data updated successfully");
    window.location.reload();
  } catch (error) {
    console.error("Error updating Brewster booking:", error);
  }
};

export { updateBookingData, updateBrewsterBookingData };
