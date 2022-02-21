import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import dummyData from "../../utils/dummy-data/index.js";

// const position = [51.505, -0.09];

export default function Map({ location }) {
  return (
    <MapContainer center={location} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={location}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily (ustomizable.
        </Popup>
      </Marker> */}
      dummyData.map(function(item, i)(
      <Marker position={[item.lat, item.long]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      ))
    </MapContainer>
  );
}
