import React from 'react'
import {AiOutlineFileSearch} from 'react-icons/ai'
import {NavLink} from 'react-router-dom'

const Page2 = () => {
  return (
    <div className="create_event">
        <div className="create_event_history">
            <NavLink to="/createevent_history"> <span><AiOutlineFileSearch/></span> History</NavLink>
        </div>
        <div className="create_event_content">
        <div className="create_event_box_content">
            <div className="page">
                              <div className="page_length"  >
                                  1
                              </div>
                              <div className="page_length" style={{border : "1px solid red"}} >
                                  2
                              </div>
                              <div className="page_length" >
                                  3
                              </div>
                          </div>
                          <div className="create_event_heading">
                          Create events on  literally anything verifiable
                          </div>
                          <div className="input">
                            <p>NUMBER OF OUTCOMES</p>
                            <input type="text" />
                            <p>PREFERRED OUTCOME</p>
                            <input type="text" />
                            <p>OPPOSING OUTCOME</p>
                            <input type="text" /> 
                          </div>
                          <div className="nxt_btn">
                              <button><NavLink to="/createevent_page3">Next</NavLink></button>
                          </div>
                </div>
        </div>
    </div>
  )
}

export default Page2