import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

interface ClinicMapProps {
  latitude: number;
  longitude: number;
}

const ClinicMap: React.FC<ClinicMapProps> = ({ latitude, longitude }) => {
  const [isClient, setIsClient] = useState(false);
  const [currentLatitude, setCurrentLatitude] = useState<number>(latitude);
  const [currentLongitude, setCurrentLongitude] = useState<number>(longitude);
  const chaveAPISitesHomologOuLocal = "AIzaSyB7q7aadNV0tMO3TDqFkozr5S4nOtz5gMo";
  const chaveProd = "AIzaSyBe6-b8J8-kDEmKEt_e8ch_6Zcdck3bafw";

  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);

  useEffect(() => {
    setCurrentLatitude(latitude);
    setCurrentLongitude(longitude);
  }, [latitude, longitude]);

  if (!isClient) {
    return <div>Carregando...</div>;
  }

  return (
    <APIProvider region="BR" apiKey={chaveAPISitesHomologOuLocal}>
      <Map
        style={{
          width: "100%",
          height: "300px",
          borderRadius: "15px",
          overflow: "hidden",
        }}
        zoom={13}
        center={{ lat: currentLatitude, lng: currentLongitude }}
        mapId="YOUR_MAP_ID"
      >
        <Marker position={{ lat: currentLatitude, lng: currentLongitude }} />
      </Map>
    </APIProvider>
  );
};

export default ClinicMap;
