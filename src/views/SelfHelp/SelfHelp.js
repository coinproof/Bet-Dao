import React, { useState } from 'react'
import { CountdownCircleTimer, } from 'react-countdown-circle-timer'
import {BiDonateHeart} from 'react-icons/bi'
import {RiContactsFill} from 'react-icons/ri'
import './SelfHelp.css'


const SelfHelp = () => {
    const [pause , setPause] = useState(0)

  return (
    <div className="self_help">
       <div className="box">
            <div className="self_help_duration">
                <div className="self_help_duration_box">
                    <p>want to take a break from betting? set a temporary restriction on your account using the custom selector below to pause betting on your profile, note once this is turned on you wont be able to make or create bets on betswamp for the selected period but you would be able to validate events and use other betswamp features.</p>
                    <select className="activate_button self_help_activate">
                        <option value="completed" >Select Duration</option>
                        <option value="pending">Panding</option>
                    </select>
                    {pause===0 ? <button onClick={()=>setPause(60)}>Pause Betting</button> : <button onClick={()=>setPause(0)}>Resume Betting</button>}
                </div>
                <div className="self_help_duration_timer">
                    <CountdownCircleTimer
                        isPlaying
                        duration={pause}
                        colors={["#b1350c"]}
                        size={380}
                        trailColor="#ff42031a"
                    >
                        {({ remainingTime })=>`${remainingTime} /60 Days`}
                    </CountdownCircleTimer>
                </div>
            </div>
       </div>
        <div className="box box2" >
            <div className="self_help_donate">
                <div className="self_help_donate">
                    <div className="donate_box">
                        <p className="donate_box_heading"><BiDonateHeart/> DONATE</p>
                        <p className="donate_box_p">JOIN US AND BE PART OF THE SOLUTION TO GAMBLING ADDICTION, MAKE A SMALL DONATION TO OUR PARTNERS WORKING HARD TO HELP PEOPLE WITH ADDICTIONS.</p>
                        <p>Total Donations : $500</p>
                    </div>
                    <div className="donation_amount">
                        <p>Choose Donation Amount</p>
                        <div className="donation_amount_box">
                            <button  style={{marginLeft: "0px"}}>$5</button>
                            <button>$25</button>
                            <button>$75</button>
                            <button>$100</button>
                            <button>Others</button>
                           
                        </div>
                        <div className="donation_input">
                                <input type="text" placeholder='BUSD'/>
                            </div>
                            <button className="donate_btn">Donate</button>
                    </div>
                </div>

            </div>
            <div className="self_help_donate">
                <div className="speak_to_someone">
                    <div className="speak_to_someone_donate_box">
                        <p className="donate_box_heading"> <RiContactsFill/>  <span>SPEAK TO SOMEONE</span></p>
                        <p className="donate_box_p"> Connect to a trained, compasionate listiner online who can  offer you free, confidential advice on gambling addiction. Whether you need advice for yourself or to support a friend or relative, we’re here for you.</p>
                    </div>
                    <div className="donation_amount">
                        <div className="donation_amount_box">
                            
                            <button className="donate_btn">Connect Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default SelfHelp