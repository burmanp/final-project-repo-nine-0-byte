import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Style from "./map.module.css";
import Searchbar from "../Searchbar/index.js";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";

// const position = [51.505, -0.09];

const icon = L.icon({ iconUrl: "../../Icons/Bolt.svg", iconAnchor: [36, 30] });
const iconEvcar = L.icon({
  iconUrl: "../../Icons/evcar.svg",
  iconAnchor: [37, 35],
});

// function GetIcon(_iconSize) {
//   return L.icon( options: {
//     iconUrl: require("../Static/Icons/Bolt.svg"),
//     iconSize: [_iconSize]
//   })
// }

export default function Map({
  location,
  pointsNearby,
  setLocation,
  // searchSubmit,
  setPostcode,
}) {
  return (
    <>
      <div className={Style.searchOverlay}>
        <Searchbar
          setLocation={setLocation}
          // searchSubmit={searchSubmit}
          setPostcode={setPostcode}
        />
      </div>
      <div className={Style.mapContainer}>
        <MapContainer center={location} zoom={16} scrollWheelZoom={false}>
          {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> */}
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmluZS1vLWJ5dGUiLCJhIjoiY2wwNjIyMjJnMDJ5NTNib2MzZWY0ZW41eiJ9.usTwdk_9xWVtXNDBVk78dw`}
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          />

          <Marker position={location} icon={iconEvcar} alt="user-position">
            <Popup>You are here.</Popup>
          </Marker>

          {pointsNearby &&
            pointsNearby.map((item, i) => (
              <Marker position={[item.lat, item.long]} icon={icon} key={i} alt="charger-position">
                <Popup>
                  <h4>{item.name}</h4>
                  <p>
                    <b>Availability:</b>{" "}
                    {item.Available ? `Available` : `In-Use`}
                  </p>
                  <p>
                    <b>Time Left:</b>{" "}
                    {item.ETA > 0 ? `${item.ETA} min` : `None`}
                  </p>
                  <p>
                    <b>Price:</b>
                    {item.Price ? ` ${item.Price}` : ` Check at chargepoint`}
                  </p>
                  <p>
                    <b>Subscriptions: </b>
                    {item.Subscriptions ? item.Subscriptions.Title : ""}
                  </p>
                  <div className={Style.dropdown}>
                    <button className={Style.dropbtn}>
                      Connectors [{item.Connectors.length}]<DownOutlined />
                    </button>
                    <div className={Style.dropContent} id="connectorDrop">
                      {item.Connectors.map((connector, i) => (
                        <p key={i}>{connector.ConnectorType}</p>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </>
  );
}
