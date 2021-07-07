import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Error from "./Error";

function EditProfileBtn(prop) {
  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false);
  const [emailPageIsOpen, setEmailPageIsOpen] = useState(false);
  const [passwordPageIsOpen, setPasswordPageIsOpen] = useState(false);
  const [newName, setNewName] = useState(prop.name);
  const [newPicture, setNewPicture] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editPicture, setEditPicture] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordVerify, setNewPasswordVerify] = useState("");
  const [button2Class, setbutton2Class] = useState("activePage");
  const [button3Class, setbutton3Class] = useState("");
  const [button4Class, setbutton4Class] = useState("");

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
    prop.setSuccessMessage("");
    setbutton2Class("activePage");
    setbutton3Class("");
    setbutton4Class("");
  }

  function closeEditProfile() {
    setEditProfileIsOpen(false);
  }

  function openEmailPage(e) {
    setEmailPageIsOpen(true);
    closeEditProfile();
    closePasswordPage();
    setEditPicture(false);
    setErrorMessage("");
    setNewEmail("");
    setOldPassword("");
    setNewPassword("");
    setNewPasswordVerify("");
    prop.setSuccessMessage("");
    console.log("Hello");
    setbutton2Class("");
    setbutton3Class("activePage");
    setbutton4Class("");
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
    prop.setSuccessMessage("");
    setbutton2Class("");
    setbutton3Class("");
    setbutton4Class("activePage");
  }

  function closePasswordPage() {
    setPasswordPageIsOpen(false);
  }

  async function submitProfile(e) {
    try {
      e.preventDefault();
      const newUserData = new FormData();
      if (newPicture !== "") {
        newUserData.append("image", newPicture.target.files[0]);
      }
      newUserData.append("name", newName);
      // await axios
      //   .post("http://localhost:5000/update/userDetails/", newUserData)
      await axios
        .post(
          "https://momentsorbital.herokuapp.com/update/userDetails/",
          newUserData
        )
        .then((response) => {
          prop.setSuccessMessage(response.data.successMessage);
        });
      closeEditProfile();
      prop.renderUserProfile();
      document.getElementById("edit-profile-success").style.display = "block";
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("edit-profile-error").style.display = "block";
    }
  }

  async function submitEmail(e) {
    try {
      e.preventDefault();
      const newEmailData = { newEmail };
      // await axios
      //   .post("http://localhost:5000/update/email", newEmailData)
      await axios
        .post(
          "https://momentsorbital.herokuapp.com/update/email/",
          newEmailData
        )
        .then((response) => {
          prop.setSuccessMessage(response.data.successMessage);
        });
      closeEmailPage();
      document.getElementById("edit-profile-success").style.display = "block";
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
      // await axios
      //   .post("http://localhost:5000/update/password", newPasswordData)
      await axios
        .post(
          "https://momentsorbital.herokuapp.com/update/password/",
          newPasswordData
        )
        .then((response) => {
          prop.setSuccessMessage(response.data.successMessage);
        });
      closePasswordPage();
      document.getElementById("edit-profile-success").style.display = "block";
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("edit-password-alert").style.display = "block";
    }
  }

  const navSideBar = (
    <div id="edit-profile-page-navbar">
      <button id="button1">Account Settings</button>
      <button id="button2" className={button2Class} onClick={openEditProfile}>
        Profile
      </button>
      <button
        id="button3"
        className={button3Class}
        onClick={(e) => openEmailPage(e)}
      >
        Email
      </button>
      <button id="button4" className={button4Class} onClick={openPasswordPage}>
        Password
      </button>
    </div>
  );

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
          id="edit-profile-error"
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
        {navSideBar}
        <form onSubmit={submitProfile} id="public-profile-form">
          <h2>Public Profile</h2>
          <button id="edit-close-button" onClick={closeEditProfile}></button>
          <div id="public-name-container">
            <label className="edit-labels" for="change-name">
              Name
            </label>
            <input
              id="public-name-input"
              name="change-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <h5 className="edit-labels">Profile Picture</h5>
          <div id="image-preview" onClick={() => setEditPicture(true)}>
            <img
              src={`https://momentsorbital.herokuapp.com/images/${prop.profilePic}`}
              // src={`http://localhost:5000/images/${prop.profilePic}`}
              alt="profile-pic"
            />
            <i class="fas fa-edit" />
          </div>
          {editPicture && (
            <div id="upload-image">
              <input
                type="file"
                name="image"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => setNewPicture(e)}
              />
            </div>
          )}
          <input
            id="public-profile-submit-btn"
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
        {navSideBar}
        <form onSubmit={submitEmail} id="email-form">
          <h2>Emails</h2>
          <button id="edit-close-button" onClick={closeEmailPage}></button>
          <div>
            <label for="change-email">Change Email </label>
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
        {navSideBar}
        <form onSubmit={submitPassword} id="password-form">
          <h2>Change password</h2>
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
