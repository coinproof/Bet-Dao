import React, { useEffect, useState } from "react";
import { priceData, betData } from "./BetData";
import "./BetSlip.css";

const BetSlip = () => {
  // Filter Items
  const [items, setItems] = useState(betData);

  const filterItems = (category) => {
    const newItem = betData.filter((item) => item.category === category);
    setItems(newItem);
  };
  useEffect(() => {
    const active = betData.filter((val) => val.category === "active");
    setItems(active);
  }, []);
  const handleChange = (evt) => {
    filterItems(evt.target.value);
  };
  return (
    <div className="overview bet_slip">
      <div className="price bet_category">
        {priceData.map((val, ind) => {
          return (
            <div
              className="price_box_content"
              style={{ borderLeft: val.color }}
              key={ind}
            >
              <div className="border">
                <p className="description">{val.desc}</p>
                <p className="name" style={{ borderBottom: val.border }}>
                  {val.name}
                </p>
                <p className="box_content_price">${val.price}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bet_slip_content">
        <select className="activate_button" onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">In Active</option>
          <option value="history">History</option>
        </select>
        <div className="data">
          {items.map((val, ind) => {
            return (
              <>
                <div className="bet_slip_box_content" key={ind}>
                  <div className="bet_slip_active">
                    <div className="circle_box">
                      <div
                        className="circle"
                        style={{
                          background: `${
                            val.active === "active" ? "green" : "red"
                          }`,
                        }}
                      ></div>
                      {val.active}
                    </div>
                    <p>#Soccer</p>
                  </div>
                  <div className="event">
                    <p>
                      {val.team1}
                      <span> VS </span>
                      {val.team2}
                    </p>
                    <p className="pool_size">Pool Size</p>
                    <p className="pool_size_price">${val.poolSize}</p>
                  </div>
                  <div className="bet_slip_content_detail">
                    <div className="bet_slip_details">
                      <p>
                        {val.team1Percent}% {val.team1}
                      </p>
                      <p>
                        {val.team2Percent}% {val.team2}
                      </p>
                      <p>{val.draw}% Draw</p>
                    </div>
                    <div className="bet_slip_btn">
                      <div style={{ marginBottom: "10px" }}>
                        {val.leftTime} Days Left
                      </div>
                      <button
                        style={{
                          background: `${
                            val.btn === "CLAIM" ? "green" : "#FF9A02"
                          }`,
                        }}
                      >
                        {val.btn}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BetSlip;
