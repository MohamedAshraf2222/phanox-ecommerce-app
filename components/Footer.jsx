import React from 'react';
import { AiFillInstagram, AiOutlineTwitter} from 'react-icons/ai';

const Footer = () => {
  const date = new Date();
  return (
    <div className="footer-container">
      <p>&copy; {date.getFullYear()} Phanox All rights reserverd</p>
      <p className="icons">
        <AiFillInstagram />
        <AiOutlineTwitter />
      </p>
    </div>
  )
}

export default Footer