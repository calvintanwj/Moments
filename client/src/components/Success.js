import React from "react";

function Success(props) {
  function hideElement() {
    var x = document.getElementById(props.id);
    x.style.display = "none";
    props.setSuccessMessage("");
  }

  function renderAlert(message) {
    if (!message) {
      return null;
    } else {
      return (
        <div class="success-message" id={props.id}>
          <span>Success: {props.successMessage}</span>
          <span class="fas fa-times" onClick={hideElement}></span>
        </div>
      );
    }
  }

  return <>{renderAlert(props.successMessage)}</>;
}

export default Success;