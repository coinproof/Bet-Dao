import React from 'react'
import {AiOutlineFileSearch} from 'react-icons/ai'
import { NavLink } from 'react-router-dom'

const Page4 = () => {
  return (
    <div className="create_event">
        <div className="create_event_history">
        <NavLink to="/createevent_history"> <span><AiOutlineFileSearch/></span> History</NavLink>
        </div>
        <div className="create_event_content">
        <div className="create_event_box_content">
                <div className="page page4">
                             <h1>Last Step</h1>
                          </div>
                          <div className="create_event_heading">
                          Place a bet on your preffered outcome
                          </div>
                          <div className="prefered_outcome">
                              <p>PREFFERED OUTCOME</p>
                              <div className="prefered_outcome_box">
                                <div className="prefered_outcome_content">
                                    <p className="team_name">Chealsea</p>
                                    <p className="participants">Participants : 0</p>
                                    <p>Total amount betted: $1,000,000</p>
                                </div>
                                <div className="page4_active">
                                    <div className="page4_active_content"></div>
                                </div>
                              </div>
                          </div>
                          <div className="input">
                            <p className='page4_p'>Enter amount to bet</p>
                            <input type="text" placeholder='max'/>
                          </div>
                          <div className="nxt_btn">
                              <button><NavLink to="/createevent_page4">Create Event</NavLink></button>
                          </div>
                </div>
        </div>
    </div>
  )
}

export default Page4