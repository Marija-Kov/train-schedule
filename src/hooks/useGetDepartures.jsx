import {
  stations,
  trainId_direction1, 
  trainId_direction2, 
  theTimetable_direction1, 
  theTimetable_direction2

} from '../data/timetable.js'

const useGetDepartures = () => {
    const getDepartures = (input) => {
     let tTable;
     let trainIdArr;
     let s = stations;
     let fromIdx = s.indexOf(input.from);
     let toIdx = s.indexOf(input.to);
     if(fromIdx > toIdx){
      tTable = theTimetable_direction2;
      const revS = s.reverse();
      fromIdx = revS.indexOf(input.from);
      toIdx = revS.indexOf(input.to);
      trainIdArr = trainId_direction2;
     } else {
      tTable = theTimetable_direction1;
      trainIdArr = trainId_direction1;
     }
     const departures = [];
     const len = tTable[0].length;
     for(let i = 0; i < len; ++i){
      const departureTime = tTable[fromIdx][i];
      const arrivalTime = tTable[toIdx][i];
      if(departureTime !== "n/a" && arrivalTime !== "n/a"){
        departures.push({from: input.from, to: input.to, departureTime: departureTime, arrivalTime: arrivalTime, trainId: trainIdArr[i]})
      }
     }
     return departures
    }
  return {getDepartures}
}

export default useGetDepartures
