# whats-your-eta
What's your ETA is a web application that returns a live feed for the NYC subway and bus system by using the MTA API.

<p align="center">
    <img src="vite-project/src/assets/Demo.gif" alt="Demo of application" width="500"/>
</p>

### How it works:
Search by a specific train or bus to get a list of all their stops and their next arriving vehicles. Add a station to your favorites list to keep track of it on the front page or use the 'Nearby Stations' button to retrieve stops that are close to you.

Feeds are updated every minute. 

How to run locally on your computer:
Use `node app.js` in the default folder to run the server for the API and use `npm run dev` in the src folder to run the web application.

### What the application looks like:
![Screenshot of all trains](https://imgur.com/ApvICiJ.jpg)
<p align="center"><i>View for trains page</i></p>
<p align="center">Click on a train to view specific stops on the line</p>

![Screenshot of a specific train](https://imgur.com/A8OVjlb.jpg)
<p align="center"><i>View for a specific train</i></p>
<p align="center">Check for next arriving times on Northbound and Southbound trains or click on the star to favorite a specific stop</p>

![Screenshot of a specific bus stop](https://imgur.com/kvobici.jpg)
<p align="center"><i>View for specific bus</i></p>
<p align="center">Click on the stop name to get bus times in both directions</p>

![Screenshot of favorites, including train alerts](https://imgur.com/A9751bu.jpg)
<p align="center"><i>View for favorites page with vehicle alerts</i></p>
<p align="center">Displays your favorite train and bus stops or click the button for nearby train and bus stops</p>