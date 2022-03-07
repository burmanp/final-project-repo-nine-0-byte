import {
  Circle,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
} from "react-leaflet";
import { Rate } from "antd";
import { AiFillThunderbolt } from "react-icons/ai";

const center = [51.505, -0.09];
const rectangle = [
  [51.49, -0.08],
  [51.5, -0.06],
];

export default function LayersControlExample() {
  return (
    <MapContainer center={center} zoom={13}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay name="Marker with popup">
          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
              <br />
              <Rate
                defaultValue={3}
                character={<AiFillThunderbolt />}
              />
            </Popup>
          </Marker>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Layer group with circles">
          <LayerGroup>
            <Circle
              center={center}
              pathOptions={{ fillColor: "blue" }}
              radius={200}
            />
            <Circle
              center={center}
              pathOptions={{ fillColor: "red" }}
              radius={100}
              stroke={false}
            />
            <LayerGroup>
              <Circle
                center={center}
                pathOptions={{ color: "green", fillColor: "green" }}
                radius={4000}
              />
            </LayerGroup>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Feature group">
          <FeatureGroup pathOptions={{ color: "purple" }}>
            <Popup>Popup in FeatureGroup</Popup>
            <Circle center={[51.51, -0.06]} radius={200} />
            <Rectangle bounds={rectangle} />
          </FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
