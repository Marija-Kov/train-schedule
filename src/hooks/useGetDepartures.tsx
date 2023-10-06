import { DepartureReturned, Input, StationDeparture, StationDetails } from '../types'

const useGetDepartures = () => {
    const getDepartures = async (input: Input): Promise<DepartureReturned[] | string> => {
     if(!input.from || !input.to || !input.date || !input.time) return "All fields must be filled";
     if(input.from === input.to) return "That is not a route";
     const response = await fetch("https://marija-kov.github.io/train-schedule-23-api/stations.json");
     const data = await response.json();
     const holidays = data.holidays;
     const stations = data.stations;
     
     const day = new Date(input.date).getDay();
     const activity = day === 0 || day === 6 || holidays.includes(input.date) ? [true, "w&h_only"] : [true, false];
     const inputTime = input.time.split(':').join('.');
     let [ indexFrom ] = stations.filter((station: StationDetails) => station.name === input.from).map((station: StationDetails) => stations.indexOf(station));
     let [ indexTo ] = stations.filter((station: StationDetails) => station.name === input.to).map((station: StationDetails) => stations.indexOf(station));
     const from = stations[indexFrom].nameFormatted;
     const to = stations[indexTo].nameFormatted;

     const direction = indexFrom > indexTo ? 2 : 1;
     
     if(direction === 2){
      indexFrom = stations.length - 1 - indexFrom;
      indexTo = stations.length - 1 - indexTo;
     }

     const fromResults = 
      stations[indexFrom].departures
      .filter((d: StationDeparture) => {
       return d.time >= Number(inputTime)
          && d.trainDetails.directionId === direction
          && activity.includes(d.trainDetails.activeOnWeekendsAndHolidays)
      });

     if(!fromResults.length) return "no departures";

     const allDepartures = // not all of these departures (trainIds) end up on input.to station
      fromResults.map((d: StationDeparture) => { 
        return {
          departureTime: d.time.toFixed(2),
          trainId: d.trainDetails.id,
          from: from,
          to: to
        }
      });
    
     const allArrivals = // not all of these arrivals (trainIds) start on input.from station
      stations[indexTo].departures
      .filter((d: StationDeparture) => {
       return d.time >= Number(inputTime) 
          && d.trainDetails.directionId === direction
          && activity.includes(d.trainDetails.activeOnWeekendsAndHolidays)
      });

     const departures = [];
   
     for(let i = 0; i < allDepartures.length; ++i){
      for(let j = 0; j < allArrivals.length; ++j){
        if(allDepartures[i].trainId === allArrivals[j].trainDetails.id){
          allDepartures[i].arrivalTime = allArrivals[j].time
          departures.push(allDepartures[i])
        }
      }
     } 
      return departures
    }
  return {getDepartures}
}

export default useGetDepartures
