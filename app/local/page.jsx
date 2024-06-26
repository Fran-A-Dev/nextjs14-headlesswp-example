"use client";

import { useEffect, useState } from "react";

export default function LocalPage() {
  const [headers, setHeaders] = useState({});

  useEffect(() => {
    fetch("/api/log-headers")
      .then((response) => response.json())
      .then((data) => setHeaders(data));
  }, []);

  return (
    <div>
      <h1>Geolocation Data</h1>
      <p>Country: {headers.country}</p>
      <p>Region: {headers.region}</p>
      <p>Timezone: {headers.timezone}</p>
    </div>
  );
}
