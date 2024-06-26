"use client";

import { useEffect, useState } from "react";

export default function LocalPage() {
  const [headers, setHeaders] = useState({});

  useEffect(() => {
    fetch("/api/log-headers")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setHeaders(data);
      })
      .catch((error) => console.error("Error fetching headers:", error));
  }, []);

  return (
    <div>
      <h1>Geolocation Data</h1>
      <p>Country: {headers.country || "No country data"}</p>
      <p>Region: {headers.region || "No region data"}</p>
      <p>Timezone: {headers.timezone || "No timezone data"}</p>
    </div>
  );
}
