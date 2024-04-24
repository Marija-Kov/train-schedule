<h1 align="center">Local train schedule</h1>

This branch is secondary* to [this one](https://github.com/Marija-Kov/train-schedule/tree/main). 

It consumes the [API](https://github.com/Marija-Kov/train-schedule-23-api/tree/main) instead of data from a [static endpoint](https://github.com/Marija-Kov/train-schedule-23-api/blob/main/stations.json).

It uses [MSW](https://github.com/mswjs/msw) to intercept server requests in test environment.

To test it manually in development mode (without request interception), first run the [API](https://github.com/Marija-Kov/train-schedule-23-api/tree/main) on your machine.

## Local Usage <a name = "localUsage"></a>

In the root folder of the cloned repo, run:
1. ```npm install``` to install the dependencies;
2. ```npm run dev``` to run the app in development mode;
3. ```npm run test``` to run automated tests;
            
<br>

*The amount of data fetched from the static endpoint is relatively small and cacheable which makes the static endpoint an optimal solution in this case. The production branch (main) does not use the API because its hosting is not covered by the budget. The API itself is the product of enthusiasm, not necessity.

## Author <a name = "author"></a>

[@marija-kov](https://github.com/Marija-Kov) 





