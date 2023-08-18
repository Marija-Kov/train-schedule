import {
  trainId_direction1, 
  trainId_direction2, 
  stations, 
  theTimetable_direction1, 
  theTimetable_direction2
} from './timetable.js'

import {
  data_direction1,
  data_direction2
} from './rawData.js'

import { Station, TrainId } from '../types'
function extractDepartureTimes(dataStr: string): string[][]{
      const len = dataStr.length + 1;
      let index = 0; // there's always a char at position 0
      const arr: string[] = [];
      for(let i = 1; i < len - 1; ++i){
        const prev = dataStr.charAt(i-1);
        const curr = dataStr.charAt(i);
        const next = dataStr.charAt(i+1);
        if (curr === " " ){
         if (prev.match(/[0-9]/) && !next.match(/[0-9]/) || 
             !prev.match(/[0-9]/) && next.match(/[0-9]/)){
               arr.push(dataStr.slice(index, i));
               index = i + 1; 
             }
           }
        if (!next){
          arr.push(dataStr.slice(index, i+1));
        }
      }
      return arr.filter(a => arr.indexOf(a) % 2 !== 0).map(a => a.split(" "));
    
}

function createTimetableMatrix_d1(dts:string[][], stationsArr: Station[], trainIdArr: TrainId[]): string[][]{
  let j = 0;
  let i = 1; 
  while (j < trainIdArr.length){
   if(Number(dts[i][j]) < Number(dts[i-1][j])){
      while(--i+1){
        dts[i].splice(j, 0, "n/a");
        }
     } 
      ++i;
     if(i === 15 || i === 0 ) {
       i = 1;
       ++j
      }
  }
  j = 0;
  while(j < trainIdArr.length){
    if(dts[0][j] === "n/a"){
      i = 8; // stations.indexOf the destination of shorter routes (Beograd centar)
      while(i < stationsArr.length){
        dts[i].splice(j, 0, "n/a")
        ++i
      }
    }
    ++j
  }
  return dts
}

function createTimetableMatrix_d2(dts:string[][], stationsArr: Station[], trainIdArr: TrainId[]): string[][] {
  let j = 0;
  let i = 1; 
  while (j < trainIdArr.length){
   if(dts[i] && Number(dts[i][j]) < Number(dts[i-1][j])){
      while(--i+1){
        dts[i].splice(j, 0, "n/a");
        }
     } 
      ++i;
     if(i === 15 || i === 0 ) {
       i = 1;
       ++j
      }
  }
  j = 0;
  while(j < trainIdArr.length){
    if(j===10){
      i = 8; // stations.indexOf the stations right after the destination of second shortest routes (Novi Beograd)
      while(i < stationsArr.length){
        dts[i].splice(j, 0, "n/a")
        ++i
      }
    }
    if(dts[0][j] === "n/a" || j===13 || j===26 || j===35){
      i = 11; // stations.indexOf the stations right after the destination of shortest routes (Altina)
      while(i < stationsArr.length){
        dts[i].splice(j, 0, "n/a")
        ++i
      }
    }
    ++j
  }

  return dts
}

// TODO: interface that can be {} or { (trainId: number): string[] } ?

function getEndpoints(trains: TrainId[], timetable: string[][], stationsArr: Station[]){
  const endpoints: any = {};
  for(let i = 0; i < trains.length; ++i){
   const firstAndLastStations = [];
   for(let j = 0; j < timetable.length; ++j){
    if(
      timetable[j][i] !== "n/a" && (
       j - 1 < 0 || timetable[j-1][i] === "n/a"
      )  
    ){
      firstAndLastStations[0] = stationsArr[j];
     }
    if(
      timetable[j][i] !== "n/a" && (
       j + 1 >= stationsArr.length || timetable[j+1][i] === "n/a"
      )
    ){
      firstAndLastStations[1] = stationsArr[j];
    }
   }
   endpoints[trains[i]] = firstAndLastStations;
  }
  return endpoints
}

// departureTimesAtStations[i] correspond to all departures from stations[i] in a day (weekday or weekend/holiday)

//const departureTimesAtStations_direction1 = extractDepartureTimes(data_direction1);
//const departureTimesAtStations_direction2 = extractDepartureTimes(data_direction2);

// endpoints denote the endpoints of each train's route

//const endpoints_direction1 = getEndpoints(trainId_direction1, theTimetable_direction1, stations);
//const endpoints_direction2 = getEndpoints(trainId_direction2, theTimetable_direction2, stations.reverse());

// console.log(createTimetableMatrix_d2(departureTimesAtStations_direction2, stations, trainId_direction2))
// console.log(createTimetableMatrix_d1(departureTimesAtStations_direction1, stations, trainId_direction1))
