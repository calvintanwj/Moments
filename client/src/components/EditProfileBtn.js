import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Error from "./Error";

function EditProfileBtn(prop) {
  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false);
  const [emailPageIsOpen, setEmailPageIsOpen] = useState(false);
  const [passwordPageIsOpen, setPasswordPageIsOpen] = useState(false);
  const [newName, setNewName] = useState(prop.name);
  const [newEmail, setNewEmail] = useState("");
  const [newPicID, setNewPicID] = useState(0);
  const [editPicture, setEditPicture] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordVerify, setNewPasswordVerify] = useState("");

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
    closeEmailPage();
    closePasswordPage();
    setEditPicture(false);
    setErrorMessage("");
    setNewEmail("");
    setOldPassword("");
    setNewPassword("");
    setNewPasswordVerify("");
  }

  function closeEditProfile() {
    setEditProfileIsOpen(false);
  }

  function openEmailPage() {
    setEmailPageIsOpen(true);
    closeEditProfile();
    closePasswordPage();
    setEditPicture(false);
    setErrorMessage("");
    setNewEmail("");
    setOldPassword("");
    setNewPassword("");
    setNewPasswordVerify("");
  }

  function closeEmailPage() {
    setEmailPageIsOpen(false);
  }

  function openPasswordPage() {
    setPasswordPageIsOpen(true);
    closeEmailPage();
    closeEditProfile();
    setEditPicture(false);
    setErrorMessage("");
    setNewEmail("");
    setOldPassword("");
    setNewPassword("");
    setNewPasswordVerify("");
  }

  function closePasswordPage() {
    setPasswordPageIsOpen(false);
  }

  async function submitProfile(e) {
    try {
      e.preventDefault();
      const newUserData = { newName, newPicID };
      await axios.post(
        "http://localhost:5000/update/userDetails/",
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

  async function submitEmail(e) {
    try {
      e.preventDefault();
      const newEmailData = { newEmail };
      await axios.post("http://localhost:5000/update/email", newEmailData);
      closeEmailPage();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("edit-email-alert").style.display = "block";
    }
  }

  async function submitPassword(e) {
    try {
      e.preventDefault();
      const newPasswordData = { oldPassword, newPassword, newPasswordVerify };
      await axios.post(
        "http://localhost:5000/update/password",
        newPasswordData
      );
      closePasswordPage();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("edit-password-alert").style.display = "block";
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
      <button id="edit-profile-btn" onClick={openEditProfile}>
        Edit Profile
      </button>
      <Modal
        isOpen={editProfileIsOpen}
        onRequestClose={closeEditProfile}
        style={editProfileStyle}
      >
        <Error
          id="edit-profile-alert"
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
        <div>
          <button onClick={openEditProfile}>Profile</button>
          <button onClick={openEmailPage}>Email</button>
          <button onClick={openPasswordPage}>Password</button>
        </div>
        <form onSubmit={submitProfile} id="edit-profile-form">
          <h2 id="edit-profile-header">Public Profile</h2>
          <button id="edit-close-button" onClick={closeEditProfile}></button>
          <div id="edit-name-container">
            <label className="edit-labels" for="change-name">
              Name
            </label>
            <input
              id="edit-name-input"
              name="change-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <h5 className="edit-labels">Profile Picture</h5>
          <div id="profile-images-list">
            {/* {prop.images.map((image) => {
              return (
                <img
                  id={image.key}
                  src={image.name}
                  key={image.key}
                  alt="Profile Pic Option"
                  onClick={() => handleClick(image.key)}
                />
              );
            })} */}
            <img
              src={prop.profilePic.name}
              alt="profile-pic"
              onClick={() => setEditPicture(true)}
            />
            {editPicture && (
              <div>
                <label> Public URL </label>
                <input></input>
                <input value="Upload an image" />
                <input type="submit" onClick={() => setEditPicture(false)} />
              </div>
            )}
          </div>
          <input
            id="edit-profile-submit-btn"
            type="submit"
            value="Update Profile"
          />
        </form>
      </Modal>
      <Modal
        isOpen={emailPageIsOpen}
        onRequestClose={closeEmailPage}
        style={editProfileStyle}
      >
        <Error
          id="edit-email-alert"
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
        <div>
          <button onClick={openEditProfile}>Profile</button>
          <button onClick={openEmailPage}>Email</button>
          <button onClick={openPasswordPage}>Password</button>
        </div>
        <form onSubmit={submitEmail}>
          <h2 id="edit-profile-header">Emails</h2>
          <button id="edit-close-button" onClick={closeEmailPage}></button>
          <div>
            <label for="change-email">Change Email: </label>
            <input
              name="change-email"
              type="email"
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input type="submit" value="Update email" />
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={passwordPageIsOpen}
        onRequestClose={closePasswordPage}
        style={editProfileStyle}
      >
        <Error
          id="edit-password-alert"
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
        <div>
          <button onClick={openEditProfile}>Profile</button>
          <button onClick={openEmailPage}>Email</button>
          <button onClick={openPasswordPage}>Password</button>
        </div>
        <form onSubmit={submitPassword}>
          <h2 id="edit-profile-header">Change password</h2>
          <button id="edit-close-button" onClick={closePasswordPage}></button>
          <div>
            <label for="old-pass">Old password</label>
            <input
              type="password"
              name="old-pass"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <label for="new-pass">New password</label>
            <input
              type="password"
              name="new-pass"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label for="new-pass-verify">Confirm new password</label>
            <input
              type="password"
              name="new-pass-verify"
              onChange={(e) => setNewPasswordVerify(e.target.value)}
            />
            <input type="submit" value="Update password" />
          </div>
        </form>
      </Modal>
    </>
  );
}

export default EditProfileBtn;
