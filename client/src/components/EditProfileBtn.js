import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Error from "./Error";

function EditProfileBtn(prop) {
  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newName, setNewName] = useState("");
  const [newPicID, setNewPicID] = useState(0);

  const editProfileStyle = {
    overlay: { zIndex: 9999 },
    content: {
      top: "15%",
      bottom: "40%",
      left: "10%",
      right: "10%",
    },
  };

  function openEditProfile() {
    setEditProfileIsOpen(true);
  }

  function closeEditProfile() {
    setEditProfileIsOpen(false);
  }

  async function onSubmit(e) {
    try {
      e.preventDefault();
      const newUserData = { newName, newPicID };
      // await axios.post(
      //   "http://localhost:5000/update/userDetails/",
      //   newUserData
      // );
      await axios.post(
        "https://momentsorbital.herokuapp.com/update/userDetails/",
        newUserData
      );
      closeEditProfile();
      prop.renderUserProfile();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("edit-profile-alert").style.display = "block";
    }
  }

  function handleClick(key) {
    setNewPicID(key);
    for (var i = 0; i < prop.images.length; i++) {
      document.getElementById(i).style.border = "none";
    }
    document.getElementById(key).style.border = "2px solid black";
  }

  return (
    <>
      <Error id="edit-profile-alert" errorMessage={errorMessage} />
      <button id="edit-profile-btn" onClick={openEditProfile}>
        Edit Profile
      </button>
      <Modal
        isOpen={editProfileIsOpen}
        onRequestClose={closeEditProfile}
        style={editProfileStyle}
      >
        <form onSubmit={onSubmit} id="edit-profile-form">
          <h2 id="edit-profile-header">Edit Profile Page</h2>
          <button id="edit-close-button" onClick={closeEditProfile}></button>
          <div id="edit-name-container">
            <label className="edit-labels" for="change-name">
              Change Name:
            </label>
            <input
              id="edit-name-input"
              name="change-name"
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <h5 className="edit-labels">Pick a Profile Picture:</h5>
          <div id="profile-images-list">
            {prop.images.map((image) => {
              return (
                <img
                  id={image.key}
                  src={image.name}
                  key={image.key}
                  alt="Profile Pic Option"
                  onClick={() => handleClick(image.key)}
                />
              );
            })}
          </div>
          <input
            id="edit-profile-submit-btn"
            type="submit"
            value="Submit Changes"
          />
        </form>
      </Modal>
    </>
  );
}

export default EditProfileBtn;
