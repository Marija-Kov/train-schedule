<h1 align="center"><a href="https://bgdvoz1.web.app/">Local train schedule</a></h1>
<h3 align="center">Find Belgrade(RS) train departures by time, date and station</h3>
<br>
<div align="center"><img src="https://i.imgur.com/AvTJHCA.gif" alt="Belgrade train schedule app" width="250px"/></div> 
<br>

## Table of Contents

1. [Motivation](#motivation)
2. [App Features](#features)
3. [Tools and Dependencies](#tools)
4. [Local Usage](#localUsage)
5. [Author](#author)

---

<br>

## Motivation <a name = "motivation"></a>

 <div align="center"> 
  <p align="left">
   This app was built out of need for a more accessible and readable alternative to the official <a href="https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2022.pdf">local train schedule in PDF</a>. 
   <br>
   In order to find a departure in the PDF version of the schedule on mobile, the user has to zoom in, then go over a lot of unnecessary information while putting extra effort not to lose track of the row, just to find a departure.
  </p>
  <img src="https://i.imgur.com/4Xa2ktQ.gif" alt="skimming through PDF table desperately to find a departure" height="400px"/>
  <br>
  <span><i> Nope.</i></span>
  <br>
  <br>
 </div>
<p> 
The app uses data from a <a href="https://github.com/Marija-Kov/train-schedule-23-api/blob/main/stations.json">JSON file</a> that was created specifically for the app by running a sequence of procedures on the data extracted from the PDF file.
 <br>
The JSON file can be easily updated after the schedule becomes obsolete - which usually happens once a year - by reusing the helper functions with the most recent data.
</p>

<br>

## App Features <a name = "features"></a>

<p> 
 As a user, you simply select departure and arrival stations, date and time and you'll get a list of departures/arrivals with train id-s as well as active schedule updates for the current day, if any. 
</p>
<p>
 Weekday and weekend schedules differ and national holidays are taken into account automatically. 
 If departures don't exist for the entered criteria, a message will pop up.
 Tapping on the question mark in the header, you will find more info about the app.
 Tapping on the train icon will refresh the page. 
 The language menu switches the language of the app (with the exception of train service updates which are currently only in Serbian).
</p>

<br>

## Tools and Dependencies <a name = "tools"></a>

- [React](https://reactjs.org/) - User interface
- [React router](https://reactrouter.com/start/data/installation) - Client routing
- [Vite](https://vitejs.dev/) - Build tooling
- [Vitest](https://vitest.dev/) - Testing
- [Sass](https://sass-lang.com/) - Style
- [Husky](https://github.com/typicode/husky) - Git hooks management

<br>

## Local Usage <a name = "localUsage"></a>

In the root folder of the cloned repo, run:

1. `npm install` to install the dependencies;
2. `npm run dev` to run the app in development mode;
3. `npm run test` to test;

<br>

## Author <a name = "author"></a>

[@marija-kov](https://github.com/Marija-Kov)
