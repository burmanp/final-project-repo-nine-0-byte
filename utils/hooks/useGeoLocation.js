import { useState, useEffect } from "react";
export default function useGeoLocation() {
  const [location, setLocation] = useState([51.505, -0.09]);
  const [error, setError] = useState(null);

  const onChange = ({ coords }) => {
    setLocation([coords.latitude, coords.longitude]);
  };
  const onError = (error) => {
    setError(error.message);
    setLocation([51.505, -0.09]); // Default if error
  };
  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError("Geolocation is not supported");
      return;
    }
    let watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);

  return [location, setLocation];
}
