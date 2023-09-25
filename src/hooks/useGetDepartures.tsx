import {
  stations,
  trainId_direction1, 
  trainId_direction2, 
  theTimetable_direction1, 
  theTimetable_direction2,
  trainIdRidesOnWeekendsAndHolidays_direction1,
  trainIdRidesOnWeekendsAndHolidays_direction2,
  holidays
} from '../data/timetable'

import { Departure, DepartureFromStation, Input, Station1, Train } from '../types'

const useGetDepartures = () => {
    const getDepartures = async (input: Input): Promise<Departure[] | string> => {
     if(!input.from || !input.to || !input.date || !input.time) return "All fields must be filled";
     const response = await fetch("https://marija-kov.github.io/train-schedule-23-api/data.json");
     const data = await response.json();
     let tTable;
     let trainIdArr: any;
     let [fromStationDetails] = data.stations.filter((station: Station1) => station.name === input.from).map((station: Station1) => { 
      return {...station, stationIndex: data.stations.indexOf(station)}
     });
     let [toStationDetails] = data.stations.filter((station: Station1) => station.name === input.to).map((station: Station1) => { 
      return {...station, stationIndex: data.stations.indexOf(station)}
     });
     const direction = fromStationDetails.stationIndex > toStationDetails.stationIndex ? 2 : 1;
     const trainIdsInDirection = data.trains.filter((train: Train) => train.directionId === direction).map((train: Train) => train.trainId);
     const departureInputTime = input.time.split(':').join('.');
     const departuresResult = 
       fromStationDetails.departures
       .filter((departure: DepartureFromStation) => 
       Number(departure.time) >= Number(departureInputTime) 
       && trainIdsInDirection.includes(departure.trainId));
     const arrivalsResult = 
       toStationDetails.departures
       .filter((departure: DepartureFromStation) => 
       Number(departure.time) >= Number(departureInputTime)
       && trainIdsInDirection.includes(departure.trainId)); 
     // TODO: create an intersection between two results to get a final result
     // Condition: departuresResult[i].trainId === arrivalsResult[j].trainId 
     let weekendsAndHolidays: any;
     let s: (string | undefined)[] = data.stations.map((station: Station1) => station.name);
     let hDays = holidays;
     let fromIdx = s.indexOf(input.from);
     let toIdx = s.indexOf(input.to);
     const dayOfWeek = new Date(input.date).getDay();
     if(fromIdx > toIdx){
       tTable = theTimetable_direction2;
       fromIdx = s.length - 1 - fromIdx;
       toIdx = s.length - 1 - toIdx;
       trainIdArr = trainId_direction2;
       weekendsAndHolidays = trainIdRidesOnWeekendsAndHolidays_direction2;
      } else {
        tTable = theTimetable_direction1;
        trainIdArr = trainId_direction1;
        weekendsAndHolidays = trainIdRidesOnWeekendsAndHolidays_direction1;
      }
     const departures = [];
     const len = tTable[0].length;
     for(let i = 0; i < len; ++i){
      const departureTime = tTable[fromIdx][i];
      const arrivalTime = tTable[toIdx][i];
      if(departureTime !== "n/a" && arrivalTime !== "n/a" && Number(departureTime) >= Number(departureInputTime)){
        departures.push({from: input.from, to: input.to, departureTime: departureTime, arrivalTime: arrivalTime, trainId: trainIdArr[i]})
      }
     }
     if(dayOfWeek === 6 || dayOfWeek === 0 || (input.date && hDays.includes(input.date))) {
       return departures.filter(d => {
        const activeOnWeekendsAndHolidays = weekendsAndHolidays[trainIdArr.indexOf(d.trainId)];
        return activeOnWeekendsAndHolidays === true || activeOnWeekendsAndHolidays === "w&h_only";
      })
     }
      return departures.length ? departures : "no departures"
    }
  return {getDepartures}
}

export default useGetDepartures
