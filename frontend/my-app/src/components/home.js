import React, { Fragment} from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "./layouts/MetaData";
const Home = () => {

  const navigate=useNavigate();

  const handleSelection=(exam)=>{
    navigate(`/${exam}`,{state:{selectedExam:exam}});
  }

  return (
    <Fragment>
      <MetaData title={"SSBPrep"} />
      <div className="h1-home">
        <p>Do You have it in You?</p>
        <div className="images-home">
          <div className="army">
            <img src='/images/armyLogo.png' alt="Army" />
          </div>
          <div className="airforce">
            <img src="/images/airforceLogo.png" alt="Airforce" />
          </div>
          <div className="navy">
            <img src="/images/navyLogo.png" alt="Navy" />
          </div>
        </div>
      </div>
      <div className="quote-home">
        {/* India flag svg */}
        <img src="/images/indiaflag.svg" alt="Indian Flag" />
        <img src="/images/Quote.png" alt="Quote" />
      </div>
      <div className="study-material-home">
        <p className="head-home">Study Material</p>
        <div className="material-home">
            <div className="exam-home" onClick={()=>handleSelection("NDA")}>
              <div>
                <img src="/images/NDA.png" alt="NDA" />
                <p>National Defence Academy (NDA)</p>
              </div>
            </div>
            <div className="exam-home" onClick={()=>handleSelection("CDS")}>
              <div>
                <img src="/images/CDS.png" alt="CDS" />
                <p>Combined Defence Services Examination (CDSE)</p>
              </div>
            </div>
            <div className="exam-home" onClick={()=>handleSelection("SSB")}>
              <div>
                <img src="/images/SSB.png" alt="SSB" />
                <p>Services Selection Board (SSB)</p>
              </div>
            </div>
        </div>
      </div>
      <div className="about-home">
        <p className="head-home">About SSBPrep</p>
        <div className="content-home">
          <p className="text-home">
            Welcome to SSBPrep, your premier destination for free resources
            tailored to help you excel in various defense exams. Whether you're
            preparing for entrance exams, officer recruitment tests, or
            advancement in military careers, we're here to support you every
            step of the way. <br />
            <br />
            We understand the importance of rigorous preparation and the
            challenges that come with it.That's why we offer a comprehensive
            range of study materials, including practice tests, study guides,
            exam tips,and expert advice. Our mission is to empower aspiring
            defense personnel with the knowledge and skills needed to succeed.
            <br />
            <br />
            Explore our extensive collection of resources, curated by experts in
            the field, designed to cover all aspects of defense exams. Whether
            you're studying for the Army, Navy, Air Force, or any other branch,
            we have something for everyone. Best of all, our resources are
            completely free, ensuring that quality education is accessible to
            all.
            <br />
            <br />
            Empowering your defense career starts here!!!
          </p>
          <div className="soldier-home">
            <img src="/images/soldier.png" alt="Soldier" />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
