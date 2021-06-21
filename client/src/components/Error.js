import React from "react";

function Error(props) {
  function hideElement() {
    var x = document.getElementById(props.id);
    x.style.display = "none";
  }

  function renderAlert(message) {
    if (!message) {
      return null;
    } else {
      return (
        <div class="alert-message" id={props.id}>
          <span>Error: {props.errorMessage}</span>
          <span class="fas fa-times" onClick={hideElement}></span>
        </div>
      );
    }
  }

  return <>{renderAlert(props.errorMessage)}</>;
}

export default Error;
