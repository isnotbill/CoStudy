//import React from "react";
import "../css/HomePage.css"; 
import imageHero from '../images/heroimage.svg';
const HomePage = () => {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content no-select">
          <h1 className="hero-title">Study Together, Stress-Free</h1>
          <p className="hero-subtitle">
            Join virtual study groups, stay motivated, and collaborate with friends.
          </p>
          <img src={imageHero} className="hero-image" alt="Blob characters graduation illustration" draggable="false"/>

        </div>

        <div className="register-section">
          <h2>Create Your Account</h2>
          <form className="register-form">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" placeholder="Choose a username" />
            
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Create a password" />
            
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" placeholder="Re-enter password" />
            
            <button type="submit" className="register-button">Sign Up</button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default HomePage;