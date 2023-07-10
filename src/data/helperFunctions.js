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
      const len = dataStr.length;
      let index = 0;
      const arr = [];
      for(let i = 1; i < len; ++i){
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
       }
      return arr.filter(a => arr.indexOf(a) % 2 !== 0).map(a => a.split(" "));
    
}
const data = "Батајница 5.57 6.27 6.57 7.27 7.57 8.10 8.57 9.27 9.57 10.57 11.57 12.57 13.57 14.42 14.59 15.27 15.51 16.27 16.57 17.27 18.27 18.57 19.57 Камендин стајалиште 6.01 6.31 7.01 7.31 8.01 8.14 9.01 9.31 10.01 11.01 12.01 13.01 14.01 14.46 15.03 15.31 15.55 16.31 17.01 17.31 18.31 19.01 20.01 Земунско поље 6.03 6.33 7.03 7.33 8.03 8.16 9.03 9.33 10.03 11.03 12.03 13.03 14.03 14.48 15.05 15.33 15.57 16.33 17.03 17.33 18.33 19.03 20.03 Алтина стајалиште 6.05 6.35 7.05 7.35 8.05 8.18 9.05 9.35 10.05 11.05 12.05 13.05 14.05 14.50 15.07 15.35 15.59 16.35 17.05 17.35 18.35 19.05 20.05 Земун 4.20 4.26 6.09 6.39 7.03 7.09 7.39 8.09 8.22 9.09 9.39 10.00 10.09 11.09 12.09 13.09 14.09 14.54 15.11 15.39 16.17 16.03 16.39 16.45 17.09 17.39 18.39 19.09 20.09 Тошин бунар стај. 4.23 4.30 6.13 6.43 7.06 7.13 7.43 8.13 8.26 9.13 9.43 10.04 10.13 11.13 12.13 13.13 14.13 14.58 15.15 15.43 16.20 16.07 16.43 16.49 17.13 17.43 18.43 19.13 20.13 Нови Београд 4.26 4.34 6.16 6.46 7.09 7.16 7.46 8.16 8.29 9.16 9.46 10.08 10.16 11.16 12.16 13.16 14.16 15.01 15.18 15.46 16.23 16.10 16.46 16.52 17.16 17.46 18.46 19.16 20.16 Београд Центар 4.29 4.37 6.19 6.49 7.12 7.19 7.49 8.19 8.32 9.19 9.49 10.12 10.19 11.19 12.19 13.19 14.19 15.04 15.21 15.49 16.26 16.13 16.49 16.55 17.19 17.49 18.49 19.19 20.19 Београд Центар 4.30 4.38 6.20 6.50 7.13 7.20 7.50 8.20 8.33 9.20 9.50 10.13 10.20 11.20 12.20 13.20 14.20 15.05 15.22 15.50 16.27 16.22 16.50 16.56 17.20 17.50 18.50 19.20 20.20 Карађорђев парк 6.24 6.54 7.24 7.54 8.24 8.37 9.24 9.54 10.24 11.24 12.24 13.24 14.24 15.09 15.26 15.54 16.26 16.54 17.24 17.54 18.54 19.24 20.24 Вуков споменик 6.28 6.58 7.28 7.58 8.28 8.41 9.28 9.58 10.28 11.28 12.28 13.28 14.28 15.13 15.30 15.58 16.30 16.58 17.28 17.58 18.58 19.28 20.28 Панчевачки мост 6.32 7.02 7.32 8.02 8.32 8.45 9.32 10.02 10.32 11.32 12.32 13.32 14.32 15.17 15.34 16.02 16.34 17.02 17.32 18.02 19.02 19.32 20.32 Крњача мост 6.36 7.06 7.36 8.06 8.36 8.49 9.36 10.06 10.36 11.36 12.36 13.36 14.36 15.21 15.38 16.06 16.38 17.06 17.36 18.06 19.06 19.36 20.36 Крњача укр. 6.39 7.09 7.39 8.09 8.39 8.52 9.39 10.09 10.39 11.39 12.39 13.39 14.39 15.24 15.41 16.09 16.41 17.09 17.39 18.09 19.09 19.39 20.39 Себеш стај. 6.42 7.12 7.42 8.12 8.42 8.55 9.42 10.12 10.42 11.42 12.42 13.42 14.42 15.27 15.44 16.12 16.44 17.12 17.42 18.12 19.12 19.42 20.42 Овча 6.45 7.15 7.45 8.15 8.45 8.58 9.45 10.15 10.45 11.45 12.45 13.45 14.45 15.30 15.47 16.15 16.47 17.15 17.45 18.15 19.15 19.45 20.45"

console.log(extractDepartureTimes(data))