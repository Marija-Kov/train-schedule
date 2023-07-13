import {
  trainId_direction1, 
  trainId_direction2, 
  stop, 
  theTimetable_direction1, 
  theTimetable_direction2
} from './timetable.js'

import {
  data_direction1,
  data_direction2
} from './rawData.js'

function extractDepartureTimes(dataStr){
      const len = dataStr.length + 1;
      let index = 0; // there's always a char at position 0
      const arr = [];
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

function createTimetableMatrix_d1(dts, stop, trainIdArr){
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
      i = 8; // stop.indexOf the destination of shorter routes (Beograd centar)
      while(i < stop.length){
        dts[i].splice(j, 0, "n/a")
        ++i
      }
    }
    ++j
  }
  return dts
}

function createTimetableMatrix_d2(dts, stop, trainIdArr) {
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
      i = 8; // stop.indexOf the stop right after the destination of second shortest routes (Novi Beograd)
      while(i < stop.length){
        dts[i].splice(j, 0, "n/a")
        ++i
      }
    }
    if(dts[0][j] === "n/a" || j===13 || j===26 || j===35){
      i = 11; // stop.indexOf the stop right after the destination of shortest routes (Altina)
      while(i < stop.length){
        dts[i].splice(j, 0, "n/a")
        ++i
      }
    }
    ++j
  }

  return dts
}

function getEndpoints(trains, timetable, stop){
  const endpoints = {};
  for(let i = 0; i < trains.length; ++i){
   const firstAndLastStop = [];
   for(let j = 0; j < timetable.length; ++j){
    if(
      timetable[j][i] !== "n/a" && (
       j - 1 < 0 || timetable[j-1][i] === "n/a"
      )  
    ){
      firstAndLastStop[0] = stop[j];
     }
    if(
      timetable[j][i] !== "n/a" && (
       j + 1 >= stop.length || timetable[j+1][i] === "n/a"
      )
    ){
      firstAndLastStop[1] = stop[j];
    }
   }
   endpoints[trains[i]] = firstAndLastStop;
  }
  return endpoints
}

function getDepartures(start, finish, tTable1=theTimetable_direction1, tTable2=theTimetable_direction2, tIdArr1=trainId_direction1, tIdArr2=trainId_direction2, stops=stop){
   let tTable;
   let tIdArr = tIdArr1;
   let startIdx = stops.indexOf(start.toLowerCase());
   let endIdx = stops.indexOf(finish.toLowerCase());
   if(startIdx > endIdx){
     tTable = tTable2
     const reverseStops = stops.reverse();
     startIdx = reverseStops.indexOf(start.toLowerCase());
     endIdx = reverseStops.indexOf(finish.toLowerCase());
     tIdArr = tIdArr2
   }else{
     tTable = tTable1
   }
   const departuresArr = [];
   for( let i = 0; i < tTable[0].length; ++i){
    if(tTable[startIdx][i] !== "n/a" && tTable[endIdx][i] !== "n/a"){
     departuresArr.push({departure: tTable[startIdx][i], trainId: tIdArr[i]})
    }
   }
   return departuresArr
}

//console.log(getDepartures("zemun", "vukov spomenik"))

// departureTimesAtStop[i] correspond to all departures from stop[i] in a day (weekday or weekend/holiday)

//const departureTimesAtStop_direction1 = extractDepartureTimes(data_direction1);
//const departureTimesAtStop_direction2 = extractDepartureTimes(data_direction2);

// endpoints denote the endpoints of each train's route

//const endpoints_direction1 = getEndpoints(trainId_direction1, theTimetable_direction1, stop);
//const endpoints_direction2 = getEndpoints(trainId_direction2, theTimetable_direction2, stop.reverse());

// console.log(createTimetableMatrix_d2(departureTimesAtStop_direction2, stop, trainId_direction2))
// console.log(createTimetableMatrix_d1(departureTimesAtStop_direction1, stop, trainId_direction1))
