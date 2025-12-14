"use client";

import { useEffect, useState } from "react";

function Header({ slug }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/tours/${slug}`, { cache: "no-store" });
      const json = await res.json();
      setData(json);
    }
    load();
  }, [slug]);

  if (!data) return <p>در حال دریافت...</p>;

  if (!data.success) return <p>{data.message}</p>;

  return (
    <div>
      <h1 className="">{data.tour.slug}</h1>
      <p>{data.tour.description}</p>
      <p>{data.tour.phone}</p>
    </div>
  );
}

export default Header;
