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

import { Departure, Input } from '../types'

const useGetDepartures = () => {
    const getDepartures = (input: Input): Departure[] | string => {
     let tTable;
     let trainIdArr: any;
     let weekendsAndHolidays: any;
     let s: (string | undefined)[] = stations;
     let hDays = holidays;
     let fromIdx = s.indexOf(input.from);
     let toIdx = s.indexOf(input.to);
     const dayOfWeek = input.date ? new Date(input.date).getDay() : undefined;
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
     const departureInputTime = input.time ? input.time.split(':').join('.') : undefined;
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
