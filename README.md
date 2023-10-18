<h1 align="center"><a href="https://bgdvoz1.web.app/">Local train schedule</a></h1>
<h3 align="center">Find Belgrade(RS) train departures by time, date and station</h3>
<br>
<div align="center"><img src="/bgdvoz-preview.gif" alt="app preview" /></div> 
<br>

## Table of Contents

1. [How did it come about?](#motivation)
2. [App Features](#features)
3. [Tools and Dependencies](#tools)
4. [Test coverage](#test)
5. [Todos](#todos)
6. [Author](#author)

---
<br>

## How did it come about? <a name = "motivation"></a>
<p> 
The app was built out of need for a more accessible and readable alternative to the official <a href="https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2022.pdf">local train schedule in PDF</a>.
</p>
<p> 
The <a href="https://github.com/Marija-Kov/train-schedule-23-api">source of data</a> was created from scratch by passing data extracted from the PDF through a series of functions.
Given the predictability of possible local train routes over years, the data will be, hopefully, easily updated after the schedule validity expires (Dec 9 2023) 
by reusing the helper functions with the new string of data passed in.
</p>

<br>

## App Features <a name = "features"></a>
<p> 
 As a User, you simply select departure station, arrival station, date and time and you'll get a list of departures/arrivals with train id-s.
</p>
<p>
 Weekday and weekend schedule differs and national holidays are taken into account automatically. 
 If the departures don't exist for the entered criteria, a message will pop up.
 Tapping on the question mark in the header, you will find more info about the app.
 Tapping on train icon will refresh the page. Diamond icon is just a placeholder.
</p>

<br>

## Tools and Dependencies <a name = "tools"></a>

- [React](https://reactjs.org/) - User interface
- [Vite](https://vitejs.dev/) - Build tooling
- [Vitest](https://vitest.dev/) - Testing
- [Sass](https://sass-lang.com/) - Style


<br>

## Test coverage <a name = "test"></a>

File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------|---------|----------|---------|---------|-------------------
All files              |     100 |      100 |     100 |     100 |                   
 src                   |     100 |      100 |     100 |     100 |                   
  App.jsx              |     100 |      100 |     100 |     100 |                   
 src/components        |     100 |      100 |     100 |     100 |                   
  Departure.jsx        |     100 |      100 |     100 |     100 |                   
  Form.jsx             |     100 |      100 |     100 |     100 |                   
  Info.jsx             |     100 |      100 |     100 |     100 |                                    
 src/hooks             |     100 |      100 |     100 |     100 |                   
  useGetDepartures.jsx |     100 |      100 |     100 |     100 |              
  
<br>

## Todos <a name = "todos"></a>
☕
<br>

## Author <a name = "author"></a>

[@marija-kov](https://github.com/Marija-Kov) 





