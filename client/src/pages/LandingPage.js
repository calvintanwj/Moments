import React from "react";
import { Link } from "react-router-dom";
import photo1 from "../images/photo1.jpg";
import photo2 from "../images/photo2.jpg";
import photo3 from "../images/photo3.jpg";
import photo4 from "../images/photo4.jpg";
import photo5 from "../images/photo5.jpg";

function LandingPage() {
  return (
    <div id="home-page-container">
      <div id="home-page-left-container">
        <h1>Moments</h1>
        <h3>Journal + Planner + Calendar</h3>
        <h2>Some inspirational text to get People to use the app</h2>
        <Link id="home-page-link" to="/sign-up">
          <button>Sign-up</button>
        </Link>
      </div>
      <div id="home-page-slideshow">
        <div id="home-page-slides">
          <input type="radio" name="r" id="r1" />
          <input type="radio" name="r" id="r2" />
          <input type="radio" name="r" id="r3" />
          <input type="radio" name="r" id="r4" />
          <input type="radio" name="r" id="r5" />
          <div className="home-page-slide s1">
            <img src={photo1} alt="Slide 1" />
          </div>
          <div className="home-page-slide">
            <img src={photo2} alt="Slide 2" />
          </div>
          <div className="home-page-slide">
            <img src={photo3} alt="Slide 3" />
          </div>
          <div className="home-page-slide">
            <img src={photo4} alt="Slide 4" />
          </div>
          <div className="home-page-slide">
            <img src={photo5} alt="Slide 5" />
          </div>
        </div>
        <div id="home-page-slider-nav">
          <label for="r1" className="home-page-bar"></label>
          <label for="r2" className="home-page-bar"></label>
          <label for="r3" className="home-page-bar"></label>
          <label for="r4" className="home-page-bar"></label>
          <label for="r5" className="home-page-bar"></label>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
