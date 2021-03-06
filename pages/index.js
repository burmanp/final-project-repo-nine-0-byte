import dynamic from "next/dynamic";
import useGeoLocation from "../utils/hooks/useGeoLocation";
import useGetPOI from "../utils/hooks/useGetPOI";
import useGetCoordsFromPostcode from "../utils/hooks/useGetCoordsFromPostcode";
import { useState, useEffect } from "react";
import Style from "../styles/Home.module.css";
import Filter from "../components/Filter";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import useBackend from "../utils/hooks/useBackend";
import { useUser } from "@auth0/nextjs-auth0";
import { loadFilter } from "../components/Drawers";


//import Map from "../components/Map";

//this is needed by the Drawers component
export let savedFilters = [];

export default function Home({ loadFilter }) {
  const { user } = useUser();
  const { addUser, deleteUser, updateUser, getUser, methods } = useBackend(
    user
      ? {
          user_id: user.sub,
          username: user.name,
        }
      : {}
  );

  console.log("initial savedFilters", savedFilters);
  console.log(loadFilter);
  let connectorsFilter = [
    "3-pin Type G (BS1363)",
    "JEVS G105 (CHAdeMO) DC",
    "Type 1 SAEJ1772 (IEC 62196)",
    "Type 2 Mennekes (IEC62196)",
    "Type 3 Scame (IEC62196)",
    "CCS Type 2 Combo (IEC62196)",
    "Type 2 Tesla (IEC62196) DC",
    "Commando 2P+E (IEC60309)",
    "Commando 3P+N+E (IEC60309)",
  ];
  const Map = dynamic(() => import("../components/Map"), { ssr: false });
  const [location, setLocation] = useGeoLocation(); // Location is either your current location or the default location of central london
  const [setPostcode] = useGetCoordsFromPostcode(setLocation);
  const [isLoading, setIsLoading] = useState(true);
  // const [markersOn, setMarkersOn] = useState([]);
  const [pointsNearby] = useGetPOI(location, setIsLoading);
  const [filteredMarkers, setFilteredMarkers] = useState(connectorsFilter);
  const [price, setPrice] = useState(0.45);
  const [isAvailable, setIsAvailable] = useState(false);

  const [filterMenu, setFilterMenu] = useState(false);
  function handleFilterMenu() {
    setFilterMenu(!filterMenu);
  }

  function handleFilter(connectorType) {
    if (filteredMarkers.includes(connectorType)) {
      let index = filteredMarkers.indexOf(connectorType);
      setFilteredMarkers([
        ...filteredMarkers.slice(0, index),
        ...filteredMarkers.slice(index + 1),
      ]);
      console.log([
        ...filteredMarkers.slice(0, index),
        ...filteredMarkers.slice(index + 1),
      ]);
    } else {
      setFilteredMarkers([...filteredMarkers, connectorType]);
      console.log([...filteredMarkers, connectorType]);
    }
  }

  function handlePrice(newPrice) {
    setPrice(newPrice);
  }

  function handleAvail() {
    setIsAvailable(!isAvailable);
  }

  function handleSaveFilters() {
    const newFilterObject = {
      price: price,
      connector_type: [...filteredMarkers],
      availability: isAvailable,
      filter_name: "User Created Filter",
    };
    savedFilters.push(newFilterObject);
    return newFilterObject;
  }
  //save savedFilter as spread array instead of an object
  //then map over in the Drawers.js component

  useEffect(() => {
    console.log("User is ", user);
    if (!user) {
      return;
    } else {
      (async () => {
        const listOfFilters = await getUser(methods.FILTER);
        if (listOfFilters.length === 0) {
          return;
        }
        const latestFilter = listOfFilters[listOfFilters.length - 1];
        setFilteredMarkers(() => latestFilter.connector_type);
        setPrice(() => latestFilter.price);
        setIsAvailable(() => latestFilter.availability);
        savedFilters = listOfFilters;
        console.log("Saved filters is ", savedFilters);
      })();
    }
  }, [user]);

  useEffect(() => {
    if (loadFilter === 0) {
      console.log("load filter empty");
      return;
    } else {
      (async () => {
        setFilteredMarkers(loadFilter.connector_type);
        setPrice(loadFilter.price);
        setIsAvailable(loadFilter.availability);
        setFilterMenu(false);
        console.log("Home. Loaded filter is ", loadFilter);
      })();
    }
  }, [loadFilter]);
  // useEffect(() => {
  //   if (pointsNearby) {
  //     setMarkersOn(
  const markersOn = pointsNearby?.filter((point) => {
    const numPrice =
      point.Price === "Free"
        ? 0
        : +point.Price.replace(/(.)(.....)(....)/, "$2"); //??00.18/Kwh
    // console.log(numPrice);

    for (let i = 0; i < point.Connectors.length; i++) {
      if (isAvailable) {
        if (
          filteredMarkers.includes(point.Connectors[i].ConnectorType) &&
          numPrice <= price &&
          point.Available === true
        ) {
          return true;
        }
      } else {
        if (
          filteredMarkers?.includes(point.Connectors[i].ConnectorType) &&
          numPrice <= price
        ) {
          return true;
        }
      }
    }
  });
  // );
  // }
  // console.log(markersOn);
  //   return markersOn;
  // }, [filteredMarkers, price, isAvailable]);

  const antIcon = <LoadingOutlined style={{ fontSize: 56 }} spin />;
  console.log("visible markers:", markersOn);
  return (
    <>

      <div className={Style.container}>
        {isLoading && (
          <div className={Style.loader}>
            <Spin alt="loading-circle" indicator={antIcon} />
            <h1>Loading...</h1>
          </div>
        )}
        {!isLoading && (
          <>
            <Filter
              handleFilter={handleFilter}
              handlePrice={handlePrice}
              handleAvail={handleAvail}
              isAvailable={isAvailable}
              handleSaveFilters={handleSaveFilters}
              price={price}
              addUser={addUser}
              updateUser={updateUser}
              user={user}
              methods={methods}
              filterMenu={filterMenu}
              handleFilterMenu={handleFilterMenu}
              filteredMarkers={filteredMarkers}
              connectorsFilter={connectorsFilter}
            />
            <Map
              location={location}
              setLocation={setLocation}
              setPostcode={setPostcode}
              pointsNearby={markersOn}
              filterMenu={filterMenu}
              handleFilterMenu={handleFilterMenu}
            />
          </>
        )}
      </div>
    </>
  );
}

//Dev 10.0
