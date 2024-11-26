import "./App.css";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import axios from "axios";
import { useState, useRef } from "react";

function App() {
  const [zoom, setZoom] = useState(3);
  const mapRef = useRef(null);

  const getBuildingNameFromCoords = async (latitude, longitude) => {
    const API_KEY = process.env.REACT_APP_KAKAO_ADMIN_KEY;
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `KakaoAK ${API_KEY}` },
      });
      const { meta, documents } = response.data;
      console.log("documents", documents);

      return {
        address_name: documents[0].address.address_name,
        building_name: documents[0].road_address.building_name,
      };
    } catch (error) {
      return "주소 없음";
    }
  };

  const onMapClickHandler = async (target, mouseEvent) => {};

  const onMarkerClickHandler = async (marker) => {
    const { Ma, La } = marker.getPosition(); // Ma: 위도, La: 경도
    // console.log(`Ma: ${Ma}, La: ${La}`);

    const result = await getBuildingNameFromCoords(Ma, La);
    console.log("result", result);
  };

  const handleZoomChange = (newZoom) => {
    setZoom(newZoom);

    if (mapRef.current) {
      mapRef.current.setLevel(newZoom);
    }
  };

  return (
    <div>
      <Map
        center={{ lat: 37.55507355483992, lng: 126.97092590963175 }}
        style={{ width: "100%", height: "100vh" }}
        onClick={(target, mouseEvent) => onMapClickHandler(target, mouseEvent)}
        ref={mapRef}
        zoomable
        level={zoom}
      >
        <MapMarker
          position={{ lat: 37.55507355483992, lng: 126.97092590963175 }}
          onClick={(marker) => onMarkerClickHandler(marker)}
          clickable
        />
      </Map>

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => handleZoomChange(zoom + 1)}
          style={{ width: "40px", height: "40px" }}
        >
          +
        </button>
        <button
          onClick={() => handleZoomChange(zoom - 1)}
          style={{ width: "40px", height: "40px" }}
        >
          -
        </button>
      </div>
    </div>
  );
}

export default App;
