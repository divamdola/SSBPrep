import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <footer>
        <div className="social">
          <a href="www.facebook.com">
            {/* Facebook svg */}
            <img src="/images/facebook.svg" alt="facebook" />
          </a>
          <a href="www.instagram.com">
            {/* Instagram svg */}
            <img src="/images/instagram.svg" alt="instagram" />
          </a>
          <a href="www.twitter.com">
            {/* twitter svg */}
            <img src="/images/twitter.svg" alt="twitter" />
          </a>
          <a href="www.linkedin.com">
            {/* linkedin svg */}
            <img src="/images/linkedin.svg" alt="linkedin" />
          </a>
        </div>
        <div className="add">
          <div>
            <p>Peerumadara Ramnagar Nainital, 244715 Uttarakhand</p>
            <p>Email : divyanshuamdola01@gmail.com</p>
            <p>&copy; SSBPrep : All rights reserved</p>
          </div>
          <div className="designed">
            <p>Designed & Developed by &copy;Divyanshu Amdola</p>
          </div>
        </div>
        <p className="motivate">
          "सफलता वह है जब तू सब कुछ खोकर भी कुछ ना खोया।"
        </p>
      </footer>
    </Fragment>
  );
};

export default Footer;
