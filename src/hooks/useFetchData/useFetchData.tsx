import { StationDetails, YyyyMmDd } from "../../typeDefinitions/types";

const useFetchData = () => {
  const url =
    "https://marija-kov.github.io/train-schedule-23-api/stations.json";
  const fetchData = async () => {
    const cacheExpiration = "cacheExpiration";
    const cachedStationsData = "cachedStationsData";
    const scheduleValid = new Date("December 13, 2025").getTime();
    let data: { holidays: YyyyMmDd[]; stations: StationDetails[] };
    const scheduleCached = localStorage.getItem(cachedStationsData);
    const cachedScheduleValid = localStorage.getItem(cacheExpiration);
    if (
      process.env.NODE_ENV === "production" &&
      scheduleCached &&
      cachedScheduleValid &&
      Number(cachedScheduleValid) > new Date().getTime() &&
      Number(cachedScheduleValid) < scheduleValid
    ) {
      data = JSON.parse(scheduleCached);
    } else {
      const response = await fetch(url);
      data = await response.json();
      localStorage.setItem(cachedStationsData, JSON.stringify(data));
      const expirationDateTime = new Date(
        new Date().getTime() + 6 * 30 * 24 * 60 * 60 * 1000
      ).getTime();
      localStorage.setItem(cacheExpiration, String(expirationDateTime));
    }
    return data;
  };
  return { fetchData };
};

export default useFetchData;
