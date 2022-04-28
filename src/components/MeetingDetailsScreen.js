/* Built-in Imports */
import React, { useState } from "react";

import Navbar from "./Navbar";
import svg from "../assets/main-svg.svg";

/* Internal Imports */
import './CSS/MeetingDetailsScreen.css';

export function MeetingDetailsScreen({ onClickJoin, onClickCreateMeeting }){

  const [meetingId, setMeetingId] =useState("");

  return (
        <div className="homeContainer" id="home">

          <Navbar/>

          <section className="container p-0 pt-5 pb-5 d-flex justify-content-between align-items-center homeSection">
        
            <div className="main-text w-50">
              <h1 className="font-main font-blue">Premium high quality video sharing platform.</h1>
              <h5 className="font-main font-light-orange pt-3">
                Hired.CO is a free interview scheduling video calling application. Hired.CO has a inbuilt draw board support and much more cool features.
              </h5>

              <div className="btn-container container p-0">
                <div className="d-flex align-items-center">
                  {/*<MainButton text="Call Interview" class__="mt-3" func = {() => callUser(idToCall)} />*/}
                  <input 
                    className="input font-main mt-3 shadow-nones font-barlow ml-0" 
                    placeholder='Enter the joining code' 
                    required
                    onChange={(e) => {
                      setMeetingId(e.target.value);
                    }}
                    value={meetingId}
                  />
                  <button
                    className="btn btn-primary font-main shadow-none mt-3"
                    onClick={(e) => onClickJoin(meetingId)}
                    id={"btnJoin"}>
                    Join
                  </button>
                </div>
                <p className='mt-3 font-blue'>OR</p>
                <div>
                  <button
                    className="btn p-0 font-blue create-meeting-btn shadow-none"
                    onClick={(e) => {
                      onClickCreateMeeting();
                    }}>
                    Create Meeting
                  </button>
                </div>
              </div>

              <hr/>

              <p className="font-barlow font-light-orange">Enter the ID and press enter to call the interview.</p>

            </div>

            <div className="main-img w-50">
              <img className="svg" src={svg}/>
            </div>

          </section>
          
        </div>
  );
}
