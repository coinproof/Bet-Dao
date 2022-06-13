import React from 'react'
import {validateData} from "./ValidateData"
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Countdown from 'react-countdown';
import validateEvent from '../../assets/images/validateevent.png';
import {AiOutlineLink} from 'react-icons/ai'

const ValidatePage2 = () => {
    // Renderer callback with condition
const renderer = ({ hours, minutes, seconds }) => {
   
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
                        duration={248}
                        colors={["#b1350c"]}
                        size={380}
                        trailColor="#ff42031a"
                    >
                        {()=><Countdown date={Date.now() + 248000} renderer={renderer}   />}
                           
                    </CountdownCircleTimer>
                    
                </div>
                <div className="validate_timer_data">
                    <div className="validate_events_show">
                        <div className="validate_events_show_content">
                            <h4>Events</h4>
                            Chealsea  vs  Machester City
                            <h4 style={{marginTop: "50px"}}>Link <AiOutlineLink/></h4>
                            <a href="#">https://verificationdemo.com/event</a>
                            <h4 style={{marginTop: "50px"}}>PREFERED ODD</h4>
                            <form>
                            <input type="radio" value="chealsea"  name="name" /> CHEALSEA<br/>
                            <input type="radio" value="machester"  name="name" /> MACHESTER<br/>
                            <input type="radio" value="chealsea"  name="name" /> DRAW<br/>
                            </form>

                        </div>
                        <div style={{display: "flex", alignItems: "end"}}>
                            <img src={validateEvent}/>
                        </div>
                    </div>
                    <div style={{marginTop: "50px", marginBottom: "30px"}}>
                    <input type="checkbox"/> i verify my selection on this event is accurate and in line with the actual outcome of the event
                    </div>
                    <div  style={{display : "flex"}}>
                        <button>Validate</button>
                        <button className="skip">Skip</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ValidatePage2