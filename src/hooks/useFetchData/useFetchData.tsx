const useFetchData = () => {
  const url =
    "https://marija-kov.github.io/train-schedule-23-api/stations.json";

  const version = 1;
  const cacheName = `trainScheduleBgd-${version}`;   
  
  const fetchData = async () => { 
    if (process.env.NODE_ENV === "test") {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Could not fetch from url: ${url}`);
          return;
        }
        return await response.json();  
      } catch (error) {
        console.error(error);
        return;
      }
    }
    
    const cache = await caches.open(cacheName);
    let data = await cache.match(cacheName);
    if (data) {
      return await data.json();
    } else {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Could not fetch from url: ${url}`);
        return "Data not available";
      }
      const oldVersions = await caches.keys();
      oldVersions.forEach(v => v !== cacheName && caches.delete(v));
      cache.put(cacheName, response.clone());
      data = await response.json();

      return data;
    }
  };
  return { fetchData };
};

export default useFetchData;