From: Human vs Algor testing

This is the code we used for a previous online experiment where we had participants do the dots task and they received the advice from either a human or a computer advice. 

HOW TO RUN:
To run this code on a local machine, navigate to the filepath of this folder on your machine via the terminal/command prompt. (Navigation is done using cd to change directory within the console) Then run a localhost php server with the following command:

<!-- cd Desktop/myJS-online/1a-verbalWM -->
cd Documents/Javascript/1a-verbalWM
```
php -S localhost:8000
```

And then go to your localhost page on your browser:

```


http://localhost:8000/consent.html?study=verbalWM&PROLIFIC_PID=TESTID
```
The above link will start you at the consent form. Sometimes we may not use this consent form, as participant give their consent in Qualtrics before starting the pre-experiment survey. To skip the consent form, use this link:

```
http://localhost:8000/verbalWM/?consent=true&PROLIFIC_PID=TESTdemo
```

Replace TESTID with whatever id you want to use. When the experiment is complete (and after each block), the data should save under the directory data/public/JSONs under a folder of this ID name. You will then need Python installed to run the scripts in the public folder: jsonConvert.py and aggregateData.py. The former takes the JSON data files and extracts the key data points as CSVs to save in the data/public/Trials folder. The latter then computes aggregate data points for one csv file summarising all participants in the file allSubjects.csv. 

Items included in current implementation that are ready for use:
- Demographic questions
- Ability to plug in your own questionnaire at the start of the experiment
- Open ended debrief form


FOLDER STRUCTURE (NB - I'll only discuss files here that are perhaps most pertinent):

- AdvisorChoice: Experimental settings can be changed in the index.html file. This file is the main entry point of the entire experiment. You will find a code block with a bunch of variables that can be altered. It also gives you an idea of which features are currently in progress vs ready for use. This script works by setting up the page and creating an experimental 'timeline', where trials, instructions and other things are added to a timeline that is then evaluated sequentially. To add something to the timeline, you use timeline.push(). You will also find the instruction image files here which we show to participants.

- Cypress: this is for integration testing, where you can define scripts that run through the experiment for you and check for errors. Useful for running through the entire experiment rather than you hving to sit through it yourself for testing purposes. Perhaps not needed now, but is worth discussing later on when it comes to testing scripts.

- Data: where experimental data is saved. We can discuss later how this works when running scripts on the server, but the file structure will be the same as in here. When the experiment is complete (and after each block), the data should save under the directory data/public/JSONs under a folder of this ID name. You will then need Python installed to run the scripts in the public folder: jsonConvert.py and aggregateData.py. The former takes the JSON data files and extracts the key data points as CSVs to save in the data/public/Trials folder. The latter then computes aggregate data points for one csv file summarising all participants in the file allSubjects.csv. 

- src: where the bulk of the Javascript files are for coding the experiment. You will mainly want advisorChoiceDefs and ExploringSocialMetacongition. The former handles advice-related code, the latter is mainly for the overall dots task and trial structure. Worth noting that for advisors, we use pre-built dot configurations and advice tables. You will find these in whereDots, choiceData, forcedData and blkData. 

- saveJSON.php: this is the main script used to save data at the end of each block. This is why we need a PHP server to run the experiment given this is a PHP script used to save data. 

- style: various CSS files which define colours, positions and layout of on-screen elements. 
