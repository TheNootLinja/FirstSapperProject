<script>
  import meetups from "../../meetups-store";
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";

  import { notEmpty, isValidEmail } from "../../helpers/validation";

  export let id = null;

  let title = "";
  let subtitle = "";
  let address = "";
  let imageUrl = "";
  let email = "";
  let description = "";

  const dispatch = createEventDispatcher();

  // Dynamic expressions for checking if data user entered is valid
  $: titleValid = notEmpty(title);
  $: subtitleValid = notEmpty(subtitle);
  $: addressValid = notEmpty(address);
  $: imageUrlValid = notEmpty(imageUrl);
  $: emailValid = isValidEmail(email);
  $: descValid = notEmpty(description);
  $: formValid =
    titleValid &&
    subtitleValid &&
    addressValid &&
    imageUrlValid &&
    emailValid &&
    descValid;

  if (id) {
    const unsubscribe = meetups.subscribe((items) => {
      const selectedMeetup = items.find((i) => i.id === id);
      title = selectedMeetup.title;
      subtitle = selectedMeetup.subtitle;
      address = selectedMeetup.address;
      imageUrl = selectedMeetup.image;
      email = selectedMeetup.contactEmail;
      description = selectedMeetup.description;
    });
    unsubscribe();
  }
  // Function for submitting the new meetup form
  function submitForm() {
    const meetupData = {
      title: title,
      subtitle: subtitle,
      address: address,
      image: imageUrl,
      contactEmail: email,
      description: description,
    };
    if (id) {
      // Don't forget to put the . back in the url before com
      fetch(`https://svelte-course-e7a24.firebaseio.com/meetups/${id}.json`, {
        method: "PATCH",
        body: JSON.stringify(meetupData),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("An error occured, please try again");
          }
          meetups.updateMeetup(id, meetupData);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch("https://svelte-course-e7a24.firebaseio.com/meetups.json", {
        method: "POST",
        body: JSON.stringify({ ...meetupData, isFavorite: false }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("An error occured, please try again");
          }
          return res.json();
        })
        .then((data) => {
          meetups.addMeetup({
            ...meetupData,
            isFavorite: false,
            id: data.name,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    dispatch("save");
  }

  function deleteMeetup() {
    fetch(`https://svelte-course-e7a24.firebaseio.com/meetups/${id}.json`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("An error has occured. Please try again!");
        }
        meetups.deleteMeetup(id);
      })
      .catch((err) => {
        alert(err);
      });
    dispatch("closemodal");
  }

  // Function for closing the modal
  function closeModal() {
    dispatch("closemodal");
  }

  document.onkeydown = function (event) {
    if (event.key === "Enter") {
      submitForm();
    } else if (event.key === "Escape") {
      closeModal();
    }
  };
</script>

<style>
  form {
    width: 100%;
  }
</style>

<Modal title="Edit Meetup" on:closemodal>
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      id="title"
      label="Title"
      valid={titleValid}
      validityMessage={'Please enter a valid title!'}
      value={title}
      on:input={(event) => (title = event.target.value)} />
    <TextInput
      id="subtitle"
      label="Subtitle"
      valid={subtitleValid}
      validityMessage={'Please enter a valid subtitle!'}
      value={subtitle}
      on:input={(event) => (subtitle = event.target.value)} />
    <TextInput
      id="address"
      label="Address"
      valid={addressValid}
      validityMessage={'Please enter a valid address!'}
      value={address}
      on:input={(event) => (address = event.target.value)} />
    <TextInput
      id="imageUrl"
      label="Image URL"
      valid={imageUrlValid}
      validityMessage={'Please enter a valid image URL!'}
      value={imageUrl}
      on:input={(event) => (imageUrl = event.target.value)} />
    <TextInput
      id="email"
      label="E-Mail"
      valid={emailValid}
      validityMessage={'Please enter a valid email address!'}
      type="email"
      value={email}
      on:input={(event) => (email = event.target.value)} />
    <TextInput
      controlType="textarea"
      id="description"
      label="Description"
      valid={descValid}
      validityMessage={'Please enter a valid description!'}
      type="description"
      value={description}
      on:input={(event) => (description = event.target.value)} />
  </form>
  <div>
    <Button type="button" mode="outline" on:click={closeModal}>Cancel</Button>
    <Button type="button" on:click={submitForm} disabled={!formValid}>
      Save
    </Button>
    {#if id}
      <Button type="button" on:click={deleteMeetup}>Delete</Button>
    {/if}
  </div>
</Modal>
