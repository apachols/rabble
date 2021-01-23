import React from "react";
import styles from "./navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul className={styles.Nav}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <h3 className={styles.title}>Rabble</h3>
        </li>
        <li>
          <Link to="/create">Create</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
