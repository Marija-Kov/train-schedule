import {
  trainId_direction1, 
  trainId_direction2, 
  stop, 
  theTimetable_direction1, 
  theTimetable_direction2
} from './timetable.js'

function extractDepartureTimes(dataStr){
    // - Copy data from the table and paste it as a string, assign it into a variable; Table: https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2022.pdf  (page 1)
    // - Split the string at empty spaces where empty space is either:
      // 1. preceeded by a non-numerical and followed by a numerical character;
      // 2. preceeded by a numerical and followed by a non-numerical character.
      // This can be done by checking every character of the string for being an empty space
      // and then if it fulfills 1. or 2, its index (i) is taken as an argument (2nd one) for a slice() method.
      // The 1st argument to every slice method is a variable (index) initialized to 0 and overwritten with the next index of every empty space that fulfills the conditions, incremented by 1. 
      // Slices are pushed into a new array from which names of stops can be filtered out 
      // and the remaining strings can be split further into an array of strings representing individual departures.
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

//const data_direction1 = "Батајница 5.57 6.27 6.57 7.27 7.57 8.10 8.57 9.27 9.57 10.57 11.57 12.57 13.57 14.42 14.59 15.27 15.51 16.27 16.57 17.27 18.27 18.57 19.57 Камендин стајалиште 6.01 6.31 7.01 7.31 8.01 8.14 9.01 9.31 10.01 11.01 12.01 13.01 14.01 14.46 15.03 15.31 15.55 16.31 17.01 17.31 18.31 19.01 20.01 Земунско поље 6.03 6.33 7.03 7.33 8.03 8.16 9.03 9.33 10.03 11.03 12.03 13.03 14.03 14.48 15.05 15.33 15.57 16.33 17.03 17.33 18.33 19.03 20.03 Алтина стајалиште 6.05 6.35 7.05 7.35 8.05 8.18 9.05 9.35 10.05 11.05 12.05 13.05 14.05 14.50 15.07 15.35 15.59 16.35 17.05 17.35 18.35 19.05 20.05 Земун 4.20 4.26 6.09 6.39 7.03 7.09 7.39 8.09 8.22 9.09 9.39 10.00 10.09 11.09 12.09 13.09 14.09 14.54 15.11 15.39 16.17 16.03 16.39 16.45 17.09 17.39 18.39 19.09 20.09 Тошин бунар стај. 4.23 4.30 6.13 6.43 7.06 7.13 7.43 8.13 8.26 9.13 9.43 10.04 10.13 11.13 12.13 13.13 14.13 14.58 15.15 15.43 16.20 16.07 16.43 16.49 17.13 17.43 18.43 19.13 20.13 Нови Београд 4.26 4.34 6.16 6.46 7.09 7.16 7.46 8.16 8.29 9.16 9.46 10.08 10.16 11.16 12.16 13.16 14.16 15.01 15.18 15.46 16.23 16.10 16.46 16.52 17.16 17.46 18.46 19.16 20.16 Београд Центар 4.29 4.37 6.19 6.49 7.12 7.19 7.49 8.19 8.32 9.19 9.49 10.12 10.19 11.19 12.19 13.19 14.19 15.04 15.21 15.49 16.26 16.13 16.49 16.55 17.19 17.49 18.49 19.19 20.19 Београд Центар 4.30 4.38 6.20 6.50 7.13 7.20 7.50 8.20 8.33 9.20 9.50 10.13 10.20 11.20 12.20 13.20 14.20 15.05 15.22 15.50 16.27 16.22 16.50 16.56 17.20 17.50 18.50 19.20 20.20 Карађорђев парк 6.24 6.54 7.24 7.54 8.24 8.37 9.24 9.54 10.24 11.24 12.24 13.24 14.24 15.09 15.26 15.54 16.26 16.54 17.24 17.54 18.54 19.24 20.24 Вуков споменик 6.28 6.58 7.28 7.58 8.28 8.41 9.28 9.58 10.28 11.28 12.28 13.28 14.28 15.13 15.30 15.58 16.30 16.58 17.28 17.58 18.58 19.28 20.28 Панчевачки мост 6.32 7.02 7.32 8.02 8.32 8.45 9.32 10.02 10.32 11.32 12.32 13.32 14.32 15.17 15.34 16.02 16.34 17.02 17.32 18.02 19.02 19.32 20.32 Крњача мост 6.36 7.06 7.36 8.06 8.36 8.49 9.36 10.06 10.36 11.36 12.36 13.36 14.36 15.21 15.38 16.06 16.38 17.06 17.36 18.06 19.06 19.36 20.36 Крњача укр. 6.39 7.09 7.39 8.09 8.39 8.52 9.39 10.09 10.39 11.39 12.39 13.39 14.39 15.24 15.41 16.09 16.41 17.09 17.39 18.09 19.09 19.39 20.39 Себеш стај. 6.42 7.12 7.42 8.12 8.42 8.55 9.42 10.12 10.42 11.42 12.42 13.42 14.42 15.27 15.44 16.12 16.44 17.12 17.42 18.12 19.12 19.42 20.42 Овча 6.45 7.15 7.45 8.15 8.45 8.58 9.45 10.15 10.45 11.45 12.45 13.45 14.45 15.30 15.47 16.15 16.47 17.15 17.45 18.15 19.15 19.45 20.45";
//const data_direction2 = "Овча 5.36 6.14 6.44 6.59 7.44 8.14 8.44 9.14 9.52 9.59 10.59 11.24 11.59 12.59 13.59 14.44 15.14 15.44 16.14 16.44 17.14 17.59 18.39 18.59 19.59 20.18 21.14 22.25 Себеш стај. 5.40 6.18 6.48 7.03 7.48 8.18 8.48 9.18 9.56 10.03 11.03 11.28 12.03 13.03 14.03 14.48 15.18 15.48 16.18 16.48 17.18 18.03 18.43 19.03 20.03 20.22 21.18 22.29 Крњача укр. 5.44 6.22 6.52 7.07 7.52 8.22 8.52 9.22 10.00 10.07 11.07 11.32 12.07 13.07 14.07 14.52 15.22 15.52 16.22 16.52 17.22 18.07 18.47 19.07 20.07 20.26 21.22 22.33 Крњача мост 5.46 6.24 6.54 7.09 7.54 8.24 8.54 9.24 10.02 10.09 11.09 11.34 12.09 13.09 14.09 14.54 15.24 15.54 16.24 16.54 17.24 18.09 18.49 19.09 20.09 20.28 21.24 22.35 Панчевачки мост 5.52 6.30 7.00 7.15 8.00 8.30 9.00 9.30 10.08 10.15 11.15 11.40 12.15 13.15 14.15 15.00 15.30 16.00 16.30 17.00 17.30 18.15 18.55 19.15 20.15 20.34 21.30 22.41 Вуков споменик 5.56 6.34 7.04 7.19 8.04 8.34 9.04 9.34 10.11 10.19 11.19 11.43 12.19 13.19 14.19 15.04 15.34 16.04 16.34 17.04 17.34 18.19 18.59 19.19 20.19 20.38 21.34 22.45 Карађорђев парк 5.59 6.37 7.07 7.22 8.07 8.37 9.07 9.37 10.13 10.22 11.22 11.45 12.22 13.22 14.22 15.07 15.37 16.07 16.37 17.07 17.37 18.22 19.02 19.22 20.22 20.41 21.37 22.48 Београд Центар 6.01 6.32 6.39 7.09 7.24 8.09 8.39 9.09 9.18 9.39 10.15 10.24 11.24 11.47 12.24 13.24 14.24 15.04 15.09 15.39 16.09 16.18 16.39 17.09 17.39 18.24 19.04 19.18 19.24 19.55 20.24 20.43 21.36 21.36 21.39 22.50 Нови Београд 6.06 6.38 6.44 7.14 7.29 8.17 8.44 9.14 9.23 9.44 10.29 11.29 11.53 12.29 13.29 14.29 15.09 15.14 15.44 16.14 16.23 16.44 17.14 17.44 18.29 19.09 19.23 19.29 20.07 20.29 20.48 21.41 21.41 21.44 22.55 Тошин бунар стај. 6.09 6.41 6.47 7.17 7.32 8.20 8.47 9.17 9.26 9.47 10.32 11.32 11.56 12.32 13.32 14.32 15.12 15.17 15.47 16.17 16.26 16.47 17.17 17.47 18.32 19.12 19.26 19.32 20.10 20.32 20.51 21.44 21.44 21.47 22.58 Земун 6.13 6.45 6.51 7.21 7.36 8.24 8.51 9.21 9.30 9.51 10.36 11.36 12.00 12.36 13.36 14.36 15.15 15.21 15.51 16.21 16.29 16.51 17.21 17.51 18.36 19.15 19.30 19.36 20.15 20.36 20.55 21.47 21.47 21.51 23.01 Алтина стајалиште 6.16 6.54 7.24 7.39 8.27 8.54 9.24 9.54 10.39 11.39 12.39 13.39 14.39 15.24 15.54 16.24 16.54 17.24 17.54 18.39 19.39 20.39 20.58 21.54 Земунско поље 6.18 6.56 7.26 7.41 8.29 8.56 9.26 9.56 10.41 11.41 12.41 13.41 14.41 15.26 15.56 16.26 16.56 17.26 17.56 18.41 19.41 20.41 21.00 21.56 Камендин стајалиште 6.20 6.58 7.28 7.43 8.31 8.58 9.28 9.58 10.43 11.43 12.43 13.43 14.43 15.28 15.58 16.28 16.58 17.28 17.58 18.43 19.43 20.43 21.02 21.58 Батајница 6.24 7.02 7.32 7.47 8.35 9.02 9.32 10.02 10.47 11.47 12.47 13.47 14.47 15.32 16.02 16.32 17.02 17.32 18.02 18.47 19.47 20.47 21.06 22.02";

// departureTimesAtStop[i] correspond to all departures from stop[i] in a day (weekday or weekend/holiday)

//const departureTimesAtStop_direction1 = extractDepartureTimes(data_direction1);
//const departureTimesAtStop_direction2 = extractDepartureTimes(data_direction2);

// endpoints denote the endpoints of each train's route

//const endpoints_direction1 = getEndpoints(trainId_direction1, theTimetable_direction1, stop);
//const endpoints_direction2 = getEndpoints(trainId_direction2, theTimetable_direction2, stop.reverse());

// console.log(createTimetableMatrix_d2(departureTimesAtStop_direction2, stop, trainId_direction2))
// console.log(createTimetableMatrix_d1(departureTimesAtStop_direction1, stop, trainId_direction1))
