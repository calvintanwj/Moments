import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Error from "./Error";
import { useHistory } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";

function EditProfileBtn(prop) {
  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false);
  const [emailPageIsOpen, setEmailPageIsOpen] = useState(false);
  const [passwordPageIsOpen, setPasswordPageIsOpen] = useState(false);
  const [deletePageIsOpen, setDeletePageIsOpen] = useState(false);
  const [newName, setNewName] = useState(prop.name);
  const [newPicture, setNewPicture] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editPicture, setEditPicture] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [button2Class, setbutton2Class] = useState("activePage");
  const [button3Class, setbutton3Class] = useState("");
  const [button4Class, setbutton4Class] = useState("");
  const [button5Class, setbutton5Class] = useState("");
  const [passwordLength, setPasswordLength] = useState(false);
  const [containsNumbers, setContainsNumbers] = useState(false);
  const [containsUppercase, setContainsUppercase] = useState(false);
  const [containsLowercase, setContainsLowercase] = useState(false);
  const [containsSpecial, setContainsSpecial] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showOldInput, setShowOldInput] = useState(false);

  const history = useHistory();

  const editProfileStyle = {
    overlay: { zIndex: 9999 },
    content: {
      top: "15%",
      bottom: "25%",
      left: "10%",
      right: "10%",
    },
  };

  function checkPasswordLength(e) {
    if (e.target.value.length > 7) {
      setPasswordLength(true);
    } else {
      setPasswordLength(false);
    }
  }

  function checkUpperCase(e) {
    if (/[A-Z]/.test(e.target.value)) {
      setContainsUppercase(true);
    } else {
      setContainsUppercase(false);
    }
  }

  function checkLowerCase(e) {
    if (/[a-z]/.test(e.target.value)) {
      setContainsLowercase(true);
    } else {
      setContainsLowercase(false);
    }
  }

  function checkNumber(e) {
    if (/\d/.test(e.target.value)) {
      setContainsNumbers(true);
    } else {
      setContainsNumbers(false);
    }
  }

  function checkSpecial(e) {
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(e.target.value)) {
      setContainsSpecial(true);
    } else {
      setContainsSpecial(false);
    }
  }

  function handlePasswordChange(e) {
    setNewPassword(e.target.value);
    checkPasswordLength(e);
    checkNumber(e);
    checkUpperCase(e);
    checkLowerCase(e);
    checkSpecial(e);
  }

  function toggleMasking(e) {
    e.preventDefault();
    setShowInput(!showInput);
  }

  function toggleOldMasking(e) {
    e.preventDefault();
    setShowOldInput(!showOldInput);
  }

  function openEditProfile() {
    setEditProfileIsOpen(true);
    closeEmailPage();
    closePasswordPage();
    closeDeletePage();
    setEditPicture(false);
    setErrorMessage("");
    setNewEmail("");
    setOldPassword("");
    setNewPassword("");
    prop.setSuccessMessage("");
    setbutton2Class("activePage");
    setbutton3Class("");
    setbutton4Class("");
    setbutton5Class("");
    setPasswordLength(false);
    setContainsLowercase(false);
    setContainsNumbers(false);
    setContainsSpecial(false);
    setContainsUppercase(false);
    setShowInput(false);
    setShowOldInput(false);
  }

  function closeEditProfile() {
    setEditProfileIsOpen(false);
  }

  function openEmailPage() {
    setEmailPageIsOpen(true);
    closeEditProfile();
    closePasswordPage();
    closeDeletePage();
    setEditPicture(false);
    setErrorMessage("");
    setNewEmail("");
    setOldPassword("");
    setNewPassword("");
    prop.setSuccessMessage("");
    setbutton2Class("");
    setbutton3Class("activePage");
    setbutton4Class("");
    setbutton5Class("");
    setPasswordLength(false);
    setContainsLowercase(false);
    setContainsNumbers(false);
    setContainsSpecial(false);
    setContainsUppercase(false);
    setShowInput(false);
    setShowOldInput(false);
  }

  function closeEmailPage() {
    setEmailPageIsOpen(false);
  }

  function openPasswordPage() {
    setPasswordPageIsOpen(true);
    closeEmailPage();
    closeEditProfile();
    closeDeletePage();
    setEditPicture(false);
    setErrorMessage("");
    setNewEmail("");
    setOldPassword("");
    setNewPassword("");
    prop.setSuccessMessage("");
    setbutton2Class("");
    setbutton3Class("");
    setbutton4Class("activePage");
    setbutton5Class("");
    setPasswordLength(false);
    setContainsLowercase(false);
    setContainsNumbers(false);
    setContainsSpecial(false);
    setContainsUppercase(false);
    setShowInput(false);
    setShowOldInput(false);
  }

  function closePasswordPage() {
    setPasswordPageIsOpen(false);
  }

  function openDeletePage() {
    setDeletePageIsOpen(true);
    closeEmailPage();
    closeEditProfile();
    closePasswordPage();
    setEditPicture(false);
    setErrorMessage("");
    setNewEmail("");
    setOldPassword("");
    setNewPassword("");
    prop.setSuccessMessage("");
    setbutton2Class("");
    setbutton3Class("");
    setbutton4Class("");
    setbutton5Class("activePage");
    setPasswordLength(false);
    setContainsLowercase(false);
    setContainsNumbers(false);
    setContainsSpecial(false);
    setContainsUppercase(false);
    setShowInput(false);
    setShowOldInput(false);
  }

  function closeDeletePage() {
    setDeletePageIsOpen(false);
  }

  async function submitProfile(e) {
    try {
      e.preventDefault();
      const newUserData = new FormData();
      if (newPicture !== "") {
        newUserData.append("image", newPicture.target.files[0]);
      }
      newUserData.append("name", newName);
      await axios
        .put("http://localhost:5000/userProfile/", newUserData)
        // await axios
        //   .put(
        //     "https://momentsorbital.herokuapp.com/userProfile/",
        //     newUserData
        //   )
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
      await axios
        .put("http://localhost:5000/userProfile/email", newEmailData)
        // await axios
        //   .put(
        //     "https://momentsorbital.herokuapp.com/userProfile/email/",
        //     newEmailData
        //   )
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
      const newPasswordData = { oldPassword, newPassword };
      await axios
        .put("http://localhost:5000/userProfile/password", newPasswordData)
        // await axios
        //   .put(
        //     "https://momentsorbital.herokuapp.com/userProfile/password/",
        //     newPasswordData
        //   )
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

  async function deleteAccount(e) {
    try {
      e.preventDefault();
      const passwordData = { deletePassword };
      await axios.post(
        "http://localhost:5000/userProfile/deleteAccount",
        passwordData
      );
      closeDeletePage();
      history.push("/deleteaccount");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response.data.errorMessage);
      document.getElementById("delete-account-alert").style.display = "block";
    }
  }

  const navSideBar = (
    <div id="edit-profile-page-navbar">
      <button id="button1">Account Settings</button>
      <button id="button2" className={button2Class} onClick={openEditProfile}>
        Profile
      </button>
      <button id="button3" className={button3Class} onClick={openEmailPage}>
        Email
      </button>
      <button id="button4" className={button4Class} onClick={openPasswordPage}>
        Password
      </button>
      <button id="button5" className={button5Class} onClick={openDeletePage}>
        Terminate
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
          <div id="image-preview" onClick={() => setEditPicture(!editPicture)}>
            <img
              // src={`https://momentsorbital.herokuapp.com/images/${prop.profilePic}`}
              src={`http://localhost:5000/images/${prop.profilePic}`}
              alt="profile-pic"
            />
            <i class="fas fa-edit" />
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
          </div>
          
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
          <div id="password-form-div">
            <label for="old-pass">Old password</label>
            <input
              type={showOldInput ? "text" : "password"}
              name="old-pass"
              required
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <div
              id="old-change-password-mask"
              onClick={(e) => toggleOldMasking(e)}
            >
              {showOldInput ? (
                <i class="fas fa-eye"></i>
              ) : (
                <i class="fas fa-eye-slash"></i>
              )}
            </div>
            <label for="new-pass">New password</label>
            <input
              type={showInput ? "text" : "password"}
              name="new-pass"
              required
              onChange={(e) => handlePasswordChange(e)}
            />
            <PasswordStrengthBar
              className="password-strength-bar"
              password={newPassword}
              minLength="8"
            />
            <div id="change-password-mask" onClick={(e) => toggleMasking(e)}>
              {showInput ? (
                <i class="fas fa-eye"></i>
              ) : (
                <i class="fas fa-eye-slash"></i>
              )}
            </div>
            <div id="change-passwordreqs">
              <div
                className={
                  passwordLength
                    ? "passwordreqmet eightchar"
                    : "passwordrequnmet eightchar"
                }
              >
                8 characters minimum
              </div>
              <div
                className={
                  containsNumbers
                    ? "passwordreqmet onenum"
                    : "passwordrequnmet onenum"
                }
              >
                One number
              </div>
              <div
                className={
                  containsUppercase
                    ? "passwordreqmet oneupp"
                    : "passwordrequnmet oneupp"
                }
              >
                One uppercase character
              </div>
              <div
                className={
                  containsLowercase
                    ? "passwordreqmet onelow"
                    : "passwordrequnmet onelow"
                }
              >
                One lowercase character
              </div>
              <div
                className={
                  containsSpecial
                    ? "passwordreqmet onespec"
                    : "passwordrequnmet onespec"
                }
              >
                One special character (!@#$...)
              </div>
            </div>
            <input type="submit" value="Update password" />
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={deletePageIsOpen}
        onRequestClose={closeDeletePage}
        style={editProfileStyle}
      >
        <Error
          id="delete-account-alert"
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
        {navSideBar}
        <form onSubmit={deleteAccount} id="delete-form">
          <h2>Delete Account</h2>
          <button id="edit-close-button" onClick={closeDeletePage}></button>
          <div>
            <p>
              Hi, <b>{prop.name}</b>.{" "}
            </p>
            <p>
              We're sorry to hear you'd like to delete your account. Once you
              delete your account, there is no going back. Please be certain.
            </p>
            <label for="delete-password">
              To continue, please enter your <b>password</b>:{" "}
            </label>
            <input
              type="password"
              name="delete-password"
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <div>
              <input name="terminate" type="submit" value="Terminate Account" />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default EditProfileBtn;
