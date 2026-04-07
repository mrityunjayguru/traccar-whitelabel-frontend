import React, { useEffect, useState } from "react";

const addressCache = {};

export default function CustomAddressValue({ latitude, longitude }) {
  const [address, setAddress] = useState("Loading...");

  useEffect(() => {
    if (!latitude || !longitude) {
      setAddress("N/A");
      return;
    }

    const cacheKey = `${latitude},${longitude}`;
    if (addressCache[cacheKey]) {
      setAddress(addressCache[cacheKey]);
      return;
    }

    const fetchAddress = async () => {


      try {

         
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
  
        const data = await response.json();
        const displayName = data.display_name || "No address";


      /*

               const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

        const data = await response.json();

        console.log(" DATa ");
        console.log(" DATa ");
        console.log(" DATa ");
        console.log(" DATa ");

        console.log(data);
       
        console.log(" DATa ");
        console.log(" DATa ");
        console.log(" DATa ");
        console.log(" DATa ");


        const displayName =  JSON.stringify(data) || "No address";


        */
      

        addressCache[cacheKey] = displayName;
        setAddress(displayName);
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        setAddress("Error fetching address");
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  return <span>{address}</span>;
}