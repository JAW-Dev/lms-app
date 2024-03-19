import { useEffect, useState } from 'react';

const useFetch = (route, params, dependencies) => {
  const [data, setData] = useState();

  const fetchData = async (r = route, p = params) => {
    if (!r) return null;
    const res = await fetch(r, {
      ...p,
    });
    const json = await res.json();
    setData(json);
    return json;
  };

  useEffect(
    () => {
      fetchData();
    },
    dependencies ? [...dependencies] : []
  );

  return { data, fetchData };
};

export default useFetch;
