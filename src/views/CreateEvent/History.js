import React, { useState, useEffect } from 'react'
import { AiOutlineFileSearch } from 'react-icons/ai'
import { NavLink } from 'react-router-dom'
import { historyData } from './HistoryData'

const History = () => {
    // Filter Items
    const [items, setItems] = useState(historyData);

    const filterItems = (category) => {
        const newItem = historyData.filter((item) => item.category === category);
        setItems(newItem)
    }
    useEffect(() => {
        const active = historyData.filter((val) => val.category === "completed");
        setItems(active)
    }, [])
    const handleChange = (evt) => {
        filterItems(evt.target.value)
    }
    return (
        <div className="history">
            <div className="create_event_history">
                <NavLink to="/createevent/history"> <span><AiOutlineFileSearch /></span> History</NavLink>
            </div>
            <div className="history_content">
                <select className="activate_button" onChange={handleChange}>
                    <option value="completed" >Completed</option>
                    <option value="pending">Panding</option>

                </select>
                <div className="data">
                    {
                        items.map((val, ind) => {
                            return (
                                <div className="history_box_content" key={ind}>
                                    <div className="history_box_content_team">
                                        <h6>#SPORTS <span> #SOCCER</span></h6>
                                        <h3>{val.team1} VS {val.team2}</h3>
                                        <h6>Starts {val.start} <span>Ends {val.end}</span></h6>
                                    </div>
                                    <div className="history_box_content_details">
                                        <h4>ODDS</h4>
                                        <p>{val.team1}</p>
                                        <p>{val.team2}</p>
                                        <p>Draw</p>
                                        <h4 style={{ marginTop: "30px" }}>POOL SIZE</h4>
                                        <p>{val.poolSize}</p>
                                        <h4 style={{ marginTop: "30px" }}>CREATOR’S REWARD</h4>
                                        <p>{val.reward}</p>
                                    </div>
                                    <div className="pending_btn">
                                        {val.category === "pending" ? <button>Placed Bet</button> : null}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default History