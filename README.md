# FPV-Race-Tracker
FPV Race Timing Software

RaceTracker_old is the current app. importing this folder into chrome will create the current version of the fpv race tracker. there are some conceptual mistakes and i suggest continuing in the FPVRaceTrackerApp folder, which is the new version of the app.

RaceTrackerServer is a maven project. a postgres database is needed and can be configured in the applicationContext.xml. The main class is executable and can be found in in the rest package.

RaceTrackerApp is the new version of the App. The server part is still pending. 
I suggest replacing vertx with spring boot!