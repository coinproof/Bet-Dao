import React, { useState } from 'react'
import {validateData} from "./ValidateData"
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Countdown from 'react-countdown';
import validateEvent from '../../assets/images/validateevent.png';
import { NavLink } from 'react-router-dom';
import './ValidateEvents.css';


const ValidateEvents = () => {
    // Renderer callback with condition
const renderer = ({ hours, minutes, seconds,}) => {
   
      return <span>{hours}:{minutes}:{seconds}</span>;
    
  };

  
  return (
    <div className="overview bet_slip">
        <div className="price bet_category">
            {validateData.map((val, ind)=>{
            return (
                <div className="price_box_content" style={{borderLeft: val.color}} key={ind}>
                <div className="border">
                        <p className="description">{val.desc}</p>
                        <p className="name" style={{borderBottom: val.color}}>{val.name}</p>
                        <p className="box_content_price">${val.price}</p>
                </div>
                </div>
            )
            })}
        </div>
        <div className="validate_events">
            <div className="validate_events_content">
                <div className="timer">
                <CountdownCircleTimer
                    isPlaying
                    duration={0}
                    colors={["rgba(255, 64, 3, 0.1)"]}
                    size={300}
                    trailColor ="#ff42031a"
                >
                    {()=> <Countdown date={Date.now() + 0 } renderer={renderer} intervalDelay={1000} zeroPadTime ={1} />}
                </CountdownCircleTimer>

                </div>
                <div className="validate_timer_data">
                    <div className="validate_events_show justify">
                        <img src={validateEvent}/>
                    </div>
                    <div style={{marginTop: "50px", marginBottom: "30px"}}>
                    <input type="checkbox"/> I UNDERSTAND THE RULES AND I WOULD OBEY THEM
                    </div>
                    <NavLink to="/validateevent_page2"><button >Start</button></NavLink>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ValidateEvents