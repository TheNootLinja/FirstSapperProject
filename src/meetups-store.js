import { writable } from "svelte/store";

const meetups = writable([]);

const customerMeetupsStore = {
    subscribe: meetups.subscribe,
    setMeetups: (fetchedMeetups) => {
      meetups.set(fetchedMeetups);
    },
    addMeetup: (meetupData) => {
        const newMeetup = {
            ...meetupData,
        };
        meetups.update(items => {
            return [newMeetup, ...items]
        });
    },
    updateMeetup: (id, meetupData) => {
      meetups.update(items => {
        // Finding the index of the meetup we want to update
        const meetupIndex = items.findIndex(i => i.id === id);
        // Putting the data of the meetup we are editing into updatedMeetup
        const updatedMeetup = {...items[meetupIndex], ...meetupData}
        // Creating a new array of all of the old meetups
        const updatedMeetups = [...items];
        // Replacing the meetup with the new data using the meetupIndex again
        updatedMeetups[meetupIndex] = updatedMeetup;
        // Returning the updatedMeetups array which svelte will use to overwrite it.
        return updatedMeetups;
      })
    },
    toggleFavorite: (id) => {
        meetups.update(items => {
                // Grabbing the item that will be updated by matching the id variable to the
    // id in the array
    const updatedMeetup = { ...items.find((m) => m.id === id) };
      // Setting the value of the isFavorite prop to the opposite of whatever it
      // currently is set to.
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      // Finding the index of the item we are updating in the meetups array by
      // using the findIndex function and having it check for the id
      const meetupIndex = items.findIndex((m) => m.id === id);
      // setting the updatedMeetups var eaual to the spread of the old meetups array
      const updatedMeetups = [...items];
      // Swapping the item and the index of the old item to the new item in the updatedMeetups
      // array so it now includes our changes
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
        });
    },
    deleteMeetup: (id) => {
      meetups.update(items => {
        return items.filter(i => i.id !== id);
      })
    },
};

export default customerMeetupsStore;