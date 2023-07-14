import {
  stations,
  trainId_direction1, 
  trainId_direction2, 
  theTimetable_direction1, 
  theTimetable_direction2,
  trainIdRidesOnWeekendsAndHolidays_direction1,
  trainIdRidesOnWeekendsAndHolidays_direction2,
  holidays
} from '../data/timetable.js'

const useGetDepartures = () => {
    const getDepartures = (input) => {
     let tTable;
     let trainIdArr;
     let weekendsAndHolidays;
     let s = stations;
     let hDays = holidays;
     let fromIdx = s.indexOf(input.from);
     let toIdx = s.indexOf(input.to);
     const dayOfWeek = new Date(input.date).getDay();
     if(fromIdx > toIdx){
      tTable = theTimetable_direction2;
      const revS = s.reverse();
      fromIdx = revS.indexOf(input.from);
      toIdx = revS.indexOf(input.to);
      trainIdArr = trainId_direction2;
      weekendsAndHolidays = trainIdRidesOnWeekendsAndHolidays_direction2;
     } else {
      tTable = theTimetable_direction1;
      trainIdArr = trainId_direction1;
      weekendsAndHolidays = trainIdRidesOnWeekendsAndHolidays_direction1;
     }
     const departures = [];
     const len = tTable[0].length;
     const departureInputTime = input.time.split(':').join('.');
     for(let i = 0; i < len; ++i){
      const departureTime = tTable[fromIdx][i];
      const arrivalTime = tTable[toIdx][i];
      if(departureTime !== "n/a" && arrivalTime !== "n/a" && Number(departureTime) >= Number(departureInputTime)){
        departures.push({from: input.from, to: input.to, departureTime: departureTime, arrivalTime: arrivalTime, trainId: trainIdArr[i]})
      }
     }
     if(dayOfWeek === 6 || dayOfWeek === 0 || hDays.includes(input.date)) {
       return departures.filter(d => {
        const activeOnWeekendsAndHolidays = weekendsAndHolidays[trainIdArr.indexOf(d.trainId)];
        return activeOnWeekendsAndHolidays === true || activeOnWeekendsAndHolidays === "w&h_only";
      })
     }
      return departures
    }
  return {getDepartures}
}

export default useGetDepartures
