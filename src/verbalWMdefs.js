//* 
// * Definitions for verbal WM and discrim task experiment. 
// MDavdson, Oct 2020 (Original)

// / here we will define the basic stimulus configurations, which are built in verbalWMstructure.js
// * OrientationStim - work in progress, replacing MJaqs doubledotgrid.
// * verbalWMstim. - work in progress, placing the letter strings
// * Trial- aggregates the information for a single presentation.
// * Governor - to manage overarching structure.
// 

"use strict";  // sets code to strict mode, no undefined variables can be executed.

// we need some help. 

import * as utils from "./utils.js"; // import basic utilities from src folder.
import processData from "./saveData_vwm.js";


//* Trial type identifiers (for interference level)
    //* @type {{baseline: number, encoding: number, maintenance: number, response:number, confj: number}}
    //
const trialTypes = {
    baseline: 0,   // no interference, simple task switching between WM and discriination
    encoding: 1,   // WM interference overlaps with stimulus presentation/encoding
    response: 2,    // WM interference overlaps with response mapping
    confj: 3,   // WM interference overlaps with providing confjudgement
    };

  //define the trial types names. TtrialTypes const has come been imported above
    
      /**
    * Trial type names
    * @type {{}}
    */
const trialTypeNames = {
    [trialTypes.baseline]: 'baseline',
    [trialTypes.encoding]: 'encoding',
    [trialTypes.response]: 'response',
    [trialTypes.confj]: 'confj',
    };




// prespecify Gabor image file locations for pushing to timeline later.
const GaborFiles=[];

for (let c=1; c<=180; c++)
    {
    let fileName = "./assets/Gabors/noiseOrientation" + c.toString()+ ".jpg";

    GaborFiles.push(fileName);

    }


const MaskFiles = [];
for (let c=1; c<=10; c++)
{
    let fileName = "./assets/noisemasks/noisemask" + c.toString()+ ".jpg";
    MaskFiles.push(fileName);
}



// set up a function to generate the verbal WM array.
// taking an array length as input.
class makeV_WMarray {
    /**
    *@constructor 
     * @param {int} degdiff -- degree difference between gaboes.
    */
    constructor (length) {
        this.length_is = length;
        this.result           = '';
        this.characters       = "FGHJKLMNPQRST"; // no vowels, or first / last few letters
        
        
        let indtmp = jsPsych.randomization.sampleWithoutReplacement([0,1,2,3,4,5,6,7,8,9,10,11,12], length);
             
        let i;
        for (i=0; i<this.length_is; i++) // strange that we can't pop multiple indices at once?
        {
            this.tmpindex= indtmp[i];            
        this.result = this.result + this.characters[this.tmpindex];        
        }

        // add the format to display the Js visuals.
        this.resultout = "<div style = font-size:60px>" + this.result + "</div>";
       
       // return [result, resultout];
       
       
   }

   randomNumber(min,max){

     Math.floor(Math.random() * (max - min) ) + min;
    }

}
  


class makeV_WMprobe { 
    // *@constructor 
    //  * @param {string} prevArray -- the previous array, used on this trial...
    // */
    constructor(prevArray) {
        let tmpV_WMarraylength = prevArray.length;
        
        this.prevArray = prevArray; 
        // based on ^ this past string, probe for an alphabetized position.
        // to sort alphabetically. change to array, then sort, then back to string.
        
        function sortABC(text){             
            return text.split('').sort().join('')
        };

        let SortedArray = sortABC(this.prevArray);
    
        // let arr = function sortAlphabets(str) {
        //    return [...str].sort((a, b) => a.localeCompare(b)).join("");
        //     }
        
        console.log('previous was', prevArray);
        console.log('sorted', SortedArray);
        


        // select random position, and probe.
        let num = utils.genRandInt(0,tmpV_WMarraylength-1);
        
        // we want 50/50 correct and incorrect?
        let correctS = SortedArray.charAt(num);

        // 
        let p = Math.random(); 
        if (p<.5) {
            //use correct number and integer
            
        } else {
            // probe a different integer for this letter.
            //make range of positions available.
            
                let arr = [];
                for(let i = 0; i <= tmpV_WMarraylength-1; i += 1){
                 arr.push(i);
                }            
            // remove the value we have.
            const index= arr.indexOf(num);
            arr.splice(index,1); // remove that                        
            
            // shuffle remaining numbers, and take first as new num to display:
            let rem = utils.shuffle(arr);        
            
            num = rem[0]; //take first value of shuffled data.
        }


        //note that indexing starts at 0.
        let displaynum = [num+1];
    
        this.probeout = "<div style = font-size:20px> Was " +      
        correctS + '=' + displaynum.toString() + " ? </div>";
    }   
}



/** defines and places the grating discs for orientation discrimination*/ 
// classes are functions which can take paramaters as input (@constructor)
class OrientationStim {
/**
*@constructor 
 * @param {int} degdiff -- degree difference between gaboes.
*/
    constructor (degdiff) {
    
    //
    // centre gabor on either 45 deg, or 135. to avoid vertical/horizontal
    let p= Math.random();
    let numbase;
    if (p < .5) {

        numbase=45;
    }
    else if (p > .5) {
         numbase=135;
    }
    
    let im1
    let im2
    // we want to split the dott diff around this reference.
    if (degdiff %2 ==0){ 
        im1= (numbase - degdiff/2);
        im2= (numbase + degdiff/2);
    }
    else { // odd number
        im1 = (numbase - Math.floor(degdiff/2));
        im2 = (numbase + Math.ceil(degdiff/2));
    }


    let q= Math.random(); // reset value
    if (q<.5) {
        var path1 = GaborFiles[im1]; // get the appropriate images
        var path2 = GaborFiles[im2];
    } else {
        var path1 = GaborFiles[im2]; // opposite direction.
        var path2 = GaborFiles[im1];

    }

    // place in array for the JSPSych vsl-grid-scene command.

    var dual_gabor = 
    [path1.toString(), path2.toString()];

    //convert to  string for use in later jsPsych plugin.        
    this.dual_gabor = dual_gabor;
    // return dual_gabor
} // end constructor
} // end object

// pass out two random masks.
class OrientationMasks {
    constructor(tmp) {
        // select two from range available.
        // let ims = jsPsych.randomization.sampleWithoutReplacement([0,1,2,3,4,5,6,7,8,9], 2);
        //var path1 = MaskFiles[ims[0]];
        // var path2 = MaskFiles[ims[1]];
        var path1 = MaskFiles[0];
        var path2 = MaskFiles[1];
        var dual_mask = [path1.toString(), path2.toString()];
        this.dual_mask = dual_mask; // this is passed out to Jsobject

    }
}
    


/**
 * A Governor manages the overarching structure of the experiment. It should be assigned to a wide scope (e.g.
 *  window.gov = new Governor()) so that its properties can be accessed by functions in plugins.
 */
class Governor {
    /**
     * @constructor
     *
     * @param {Object} [args={}] - properties to assign to the Governor
     * @param {string} [args.experimentCode=''] - code identifying the experiment
     * @param {Trial[]} [args.trials=[]] - trial list
     * @param {Object[]} [args.miscTrials] - miscellaneous trials (breaks, instructions, etc)
     * @param {int} [args.currentTrialIndex=0] - index of current trial in trial list
     * @param {string} [args.completionURL=''] - URL to which to refer participants for payment
     *
     */
        constructor(args = {}) {
        for (let key in args) {
            if (args.hasOwnProperty(key))
                this[key] = args[key];
        }
        this.experimentCode = typeof args.experimentCode === 'undefined'? '' : args.experimentCode;
        this.trials = typeof args.trials === 'undefined'? [] : Governor.addTrials(args.trials);        
        this.currentTrialIndex = args.currentTrialIndex || 0;
        this.completionURL = typeof args.completionURL === 'undefined'? '' : args.completionURL;
        this.timeStart = (new Date).getTime();
        }


        // here we need to place the functions accessible to all.
        get currentTrial() {return this.trials[this.currentTrialIndex];}

        /** Enable or disable fullscreen display
        *   Adapted from: https://www.w3schools.com/howto/howto_js_fullscreen.asp
        * @param {boolean} [enter=true] - whether to enter fullscreen
        */
        fullscreenMode(enter = true) {
        /* Get the documentElement (<html>) to display the page in fullscreen */
        let elem = document.documentElement;

            /* View in fullscreen */
            if(enter) {
                if (elem.requestFullscreen)
                    elem.requestFullscreen();
                else if (elem.mozRequestFullScreen)  /* Firefox */
                    elem.mozRequestFullScreen();
                else if (elem.webkitRequestFullscreen)  /* Chrome, Safari and Opera */
                    elem.webkitRequestFullscreen();
                else if (elem.msRequestFullscreen) /* IE/Edge */
                    elem.msRequestFullscreen();
            } else {
                // don't exit if we're not in fullscreen mode
                if(document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen)
                    return;
                if (document.exitFullscreen)
                    document.exitFullscreen();
                else if (document.mozCancelFullScreen)  /* Firefox */
                    document.mozCancelFullScreen();
                else if (document.webkitExitFullscreen)  /* Chrome, Safari and Opera */
                    document.webkitExitFullscreen();
                else if (document.msExitFullscreen)  /* IE/Edge */
                    document.msExitFullscreen();
                }
            }

            /**
             * Compile the data in this governor ready for sending, including a processed form
             * @return {Object} a JSON object with JSON strings containing rawData and processedData
             */
            compileSelf() {
                    return {
                        rawData: JSON.stringify(this),
                        processedData: JSON.stringify(processData(this))
                    }
            }


            

            authenticate(datum) {
                // Fire off the request to /form.php
                // var request = $.ajax({
                //     type: "POST",
                //     //the url where you want to sent the userName and password to
                //     url: '../saveJSONerr.php',
                //     //json object to sent to the authentication url
                //     data: datum
                // });

                // // Callback handler that will be called on success
                // request.done(function (response, textStatus, jqXHR){
                //     // Log a message to the console
                //     //console.log("Hooray, it worked!");
                // });

                // // Callback handler that will be called on failure
                // request.fail(function (jqXHR, textStatus, errorThrown){
                //     // Log the error to the console
                //     console.error(
                //         "The following error occurred: "+
                //         textStatus, errorThrown
                //     );
                // });
                try
                {
                    fetch("../saveJSONerr.php",
                    {method: "POST", body: datum});
                }
                catch(e)
                {
                    console.log(e);
                    let err = 'JS - Caught exception: ' + e;
                                fetch("../errorSave.php",
                    {method: "POST", body: datum});
                }
            }


            /**
             * Send all the data in the governor object to a backend which will save it to a file.
             */
            exportGovernor() {
                let ask = new XMLHttpRequest();
                ask.open('POST', '../saveJSONerr.php', true);
                ask.onreadystatechange = function() {
                    if (this.readyState===4 && this.status===200) {
                        let text = "";
                        try {
                            text = JSON.parse(this.responseText);
                        } catch(e) {
                            text = this.responseText;
                        }
                    }
                };
                ask.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                let info = encodeURI('data='+JSON.stringify(this.compileSelf()));
                let bla = decodeURI(info).substr(5);
                //console.log(info);
                //this.authenticate(info);
                ask.send(info);
            }

            /**
             * inject the proportion correct into the block feedback
             */
            blockFeedback(){
                let block;
                if (this.currentTrial == null)
                {
                    block = this.practiceBlockStructure.length-1;
                }
                else
                {
                    block = this.currentTrial.block-1;
                }
                // // if (typeof this.currentTrial !== 'undefined')
                // // {
                // //     block = (this.trials[this.trials.length-1]).block-1;
                // // }
                // let trialList = utils.getMatches(this.trials, (trial)=>{
                //     return trial.block === block;
                // });
                // let hitList = utils.getMatches(trialList, (trial)=>{
                //     let answer = trial.answer[1];
                //     if (answer === null || isNaN(answer))
                //         answer = trial.answer[0];
                //     return answer === trial.whichSide;
                // });


                // let score = hitList.length / trialList.length * 100;
                // let trial = this.trials[this.currentTrialIndex-1];
                // if (score < this. BlockScore) {
                //     this.terminateExperiment(score);
                //     return;
                // }
                // let div = document.querySelector('#jspsych-content');
                // let p = div.insertBefore(document.createElement('p'), div.querySelector('p'));
                // p.innerHTML = "Your score on the last block was " + (Math.round(score*100)/100).toString() + "%.";
                //p.innerHTML = p.innerHTML + "<br />" + "Your confidence points total is " + trial.points;
                // let point = document.querySelector(".confidence-points-text p")
                // point.style = "display: none";
                this.drawProgressBar();
                this.exportGovernor();
            }
            /**
             * Save the data sent from the plugin in the Trial object
             *
             * @param {Object} pluginData - response data sent by a jsPsych plugin
             */
            storePluginData(pluginData) {
                if (Object.keys(this.currentTrial).indexOf('pluginResponse') === -1)
                    this.currentTrial.pluginResponse = [];
                // Save this trial data (jspsych would do this for us, but we have access to a bunch of stuff it doesn't
                this.currentTrial.pluginResponse.push(pluginData);
            }

            /**
             * Storage function for any trial not otherwise handled (e.g. breaks, instructions) so we don't lose their timings.
             */
            storeMiscTrialData(trial) {
                this.miscTrials.push(trial);
            }

            /**
             * Draw a progress bar at the top of the screen
             */
            drawProgressBar() {
                if (document.querySelector('#jspsych-progressbar-container') === null) {
                    let div = document.createElement('div');
                    div.id = 'jspsych-progressbar-container';
                    let outer = document.createElement('div');
                    outer.id = 'progressbar-outer';
                    div.appendChild(outer);
                    let inner = document.createElement('div');
                    inner.id = 'progressbar-inner';
                    outer.appendChild(inner);
                    let content = document.querySelector('.jspsych-content-wrapper');
                    content.parentElement.insertBefore(div, content);
                }
                let inner = document.querySelector('#progressbar-inner');
                inner.style.width = ((this.currentTrialIndex + 1) / this.trials.length * 100).toString()+'%';
            }
            // * Draw the form which asks participants for age and gender
            // */
            // drawDemographicForm() {
            //     let owner = this;
            //     // Create form
            //     let div = document.querySelector('.jspsych-content').appendChild(document.createElement('div'));
            //     div.id = 'demoContainer';
            //     div.className = 'demo';
            //     let form = div.appendChild(document.createElement('form'));
            //     form.id = 'demoForm';
            //     form.className = 'demo';
            //     let questions = [];
            //     questions.push({
            //         prompt: 'Please provide gender as either "m" or "f"',
            //         mandatory: true,
            //         type: 'text'
            //     });
            //     questions.push({
            //         prompt: 'How many hours on any given day would you say you spend on an electronic device such as a smartphone or computer? (enter a single digit, such as: 1)',
            //         mandatory: true,
            //         type: 'text'
            //     });
            //     questions.push({
            //         prompt: 'Please provide your age',
            //         mandatory: true,
            //         type: 'text'
            //     });
            //     for(let i = 0; i < questions.length; i++) {
            //         let comment = form.appendChild(document.createElement('div'));
            //         comment.id = 'demoCommentContainer'+i;
            //         comment.className = 'demo demo-container';
            //         if(i > 0)
            //         {  
            //             comment.classList.add('hidden');
            //         }
            //         let commentQ = comment.appendChild(document.createElement('div'));
            //         commentQ.id = 'demoCommentQuestion'+i;
            //         commentQ.className = 'demo question';
            //         commentQ.innerHTML = "<strong>Q"+(i+1)+"/"+(questions.length)+":</strong> " + questions[i].prompt;
            //         let commentA = comment.appendChild(document.createElement('textarea'));

            //         commentA.id = 'demoCommentAnswer'+i;
            //         commentA.className = 'demo answer';

            //         if (i ==0)
            //         {
            //             commentA.placeholder = 'Enter your gender here'
            //         }

            //         else if (i == 1)
            //         {
            //             commentA.placeholder = 'Enter the number of hours here'
            //         }

            //         else
            //         {
            //             commentA.placeholder = 'Enter your age here'
            //         }

            //         let ok = comment.appendChild(document.createElement('button'));
            //         ok.innerText = i === questions.length - 1? 'submit' : 'next';
            //         ok.className = 'demo jspsych-btn';

            //         let checkResponse;
            //         let saveResponse;
            //         checkResponse = function(form) {
            //             let div = form.querySelector('.demo-container:not(.hidden)');
            //             let ok = div.querySelector('textarea').value !== "";
            //             if(!ok)
            //                 div.classList.add('bad');
            //             else
            //                 div.classList.remove('bad');
            //             return ok;
            //         };
            //         saveResponse = function(form) {
            //             let q = questions[i];
            //             q.answer = form.querySelector('.demo-container:not(.hidden) textarea').value;
            //             gov.demo.push(q);
            //         };
            //         if(!questions[i].mandatory)
            //             checkResponse = ()=>true;

            //         if(i === questions.length - 1)
            //             ok.onclick = function (e) {
            //                 e.preventDefault();
            //                 if(!checkResponse(this.form))
            //                     return false;
            //                 if (isNaN(parseInt(form.querySelector('#demoCommentAnswer2').value)))
            //                 {
            //                     return false;
            //                 }
            //                 else
            //                 {
            //                     if (parseInt(form.querySelector('#demoCommentAnswer2').value) < 18 || parseInt(form.querySelector('#demoCommentAnswer1').value) > 100)
            //                     {
            //                         return false;
            //                     }
            //                 }
            //                 saveResponse(this.form);
            //                 owner.demoFormSubmit(form);
            //             };
            //         else
            //             ok.onclick = function(e) {
            //                 e.preventDefault();
            //                 if(!checkResponse(this.form))
            //                     return false;
            //                 if (form.querySelector('#demoCommentAnswer0').value != 'm' && form.querySelector('#demoCommentAnswer0').value != 'f')
            //                     return false;
            //                 if (i > 0)
            //                 {
            //                     if (isNaN(parseInt(form.querySelector('#demoCommentAnswer1').value)))
            //                     {
            //                         return false;
            //                     }
            //                     if (form.querySelector('#demoCommentAnswer1').value.length > 1)
            //                     {
            //                         return false;
            //                     }
            //                 }
            //                 saveResponse(this.form);
            //                 let div = this.form.querySelector('.demo-container:not(.hidden)');
            //                 div.classList.add('hidden');
            //                 div.nextSibling.classList.remove('hidden');
            //             }
            //     }

            //     gov.demo = [];
            // } // end demo    

            // demoFormSubmit(form) {
            //     this.demo = [
            //         {
            //         question: 'gender',
            //         answer: form.querySelector('#demoCommentAnswer0').value
            //         },
            //         {
            //         question: 'deviceUse',
            //         answer: form.querySelector('#demoCommentAnswer1').value
            //         },
            //         {
            //         question: 'age',
            //         answer: form.querySelector('#demoCommentAnswer2').value
            //         }
            //     ];
            //     jsPsych.finishTrial(this.demo);
            //     }

    } //end governor.


//extend these basic governor capabilities.
class BuildExp extends Governor {
 // @constructor
 //     *
 //     * @param {Object} [args={}] - properties to assign to the Governor
 //     * @param {Trial[]} [args.trials=[]] - trial list
 //     * @param {Object[]} [args.miscTrials] - miscellaneous trials (breaks, instructions, etc)
 //     * @param {int} [args.currentTrialIndex=0] - index of current trial in trial list
 //     * @param {string} [args.completionURL=''] - URL to which to refer participants for payment
 //     * @param {string} [args.experimentCode=''] - code identifying the experiment
 //     *
 //     * @param {int} [args.dotCount] - number of dots in a box
 //     * @param {int} [args.dotDifference] - half the difference between the dot counts in the two boxes; the difficulty
 //     * @param {int} [args.difficultyStep] - amount the difficulty increases/decreases after success/failure
 //     * @param {number} [args.minimumBlockScore] - lowest proportion of successful trials allowed on a block
 //     * @param {int} [args.blockCount] - number of blocks in the study
 //     * @param {Object|Object[]} [args.blockStructure] - the structure of each block, where each object is a series of [trialType: number of instances] mappings. Multiple objects represent different subblocks run consecutively.
 //     * @param {Object|Object[]} [args.practiceBlockStructure] - the structure of each practice block
 //     * @param {Object|Object[]} [args.blk4Structure] - structure for block 4 forced trials if indicated in index.html
 //     * @param {int} [args.preTrialInterval] - delay before each trial begins
 //     * @param {int} [args.preStimulusInterval] - fixation delay before the stimulus is displayed
 //     * @param {int} [args.stimulusDuration] - duration the dot stimulus is displayed
 //     * @param {int} [args.feedbackDuration] - duration of the feedback screen     *

     constructor(args = {}) {
            super(args);             
            // these are all defined in the index script   
            this.difficultyStep = typeof args.difficultyStep === 'undefined'? null : args.difficultyStep;        
            this.blockCount = typeof args.blockCount === 'undefined'? null : args.blockCount;
            this.degree_diff = typeof args.degree_diff === 'undefined'? null : args.degree_diff;
            
            
            this.preTrialInterval = typeof args.preTrialInterval === 'undefined'? null : args.preTrialInterval;
            this.preStimulusInterval = typeof args.preStimulusInterval === 'undefined'? null : args.preStimulusInterval;
            this.stimulusDuration = typeof args.stimulusDuration === 'undefined'? null : args.stimulusDuration;
            
            
            this.numOfTrials = utils.sumList(this.blockStructure) + utils.sumList(this.practiceBlockStructure) + utils.sumList(this.blk4Structure);
            // this.workingMemoryStack = [];
            // this.maintainMemoryString = "";
            
            this.Procedures = args.Procedures;
            this.trialsperblock = args.blockLength;
            this.nBlocks = args.Blockrepetitions;
            this.useTypes = args.useTypesBuild;
            this.PermuteBlocks = args.PermBlocks;
            this.nStaircaseBlocks = args.numStaircase;
        }


            /**
         * Return a list of Trial objects.
         *
         * A large part of the work of defining the experiment takes place here, although the key properties are
         * actually defined in the Governor definition.
         *
         * The trials defined here are the master list used by the Governor to decide which stimuli to serve,
         *  This list is **not necessarily the same as** the trial list
         * established at the beginning of the experiment and handed to jsPsych. 
         */

            getTrials(section="experimental") {
            let trials = [];
            let realId = 0;
            let trialCount = this.trialsperblock;
            let blockStructure = null;
            let Blocktypes = this.useTypes;
            let nStaircasebl = this.nStaircaseBlocks;
            console.log(trialCount)

            // first add the basic practice block, which is used for staircasing.
            // set all counters to zero.
            let bid= 0; //block counter            
            
            let ttypeid=0; // Baseline type.

            for (let bID =0; bID< nStaircasebl; bID++){

                    bid++; //start at 1

                    for (let i =0; i< trialCount; i++) { // for each trial in our staircase block

                     // push some empty info into the trials array, which we will overwrite later
                     // with the gov command in index.html window. Then we can revisit these 
                     // trials data, when calling other functions.
                     
                     
                     
                     trials.push(new Trial(realId, {

                        type: ttypeid,
                        typeName: trialTypeNames[ttypeid],
                        block: bid, //starts at 1                           
                        trialid: i, //starts at 0
                        realID: realId,
                        
                        WMstring: [NaN],
                        WMprobe: [NaN],                        
                        WM_answer: [NaN],
                        WM_correct:[NaN],
                        WM_rt:[NaN],
                        WM_difficulty:[NaN],
                        
                        degDiff: this.degree_diff,
                        OrienDegs: [NaN,NaN], // left and right
                        OrienProbe: [NaN],
                        Orien_correct: [NaN],
                        Orien_rt:[NaN],
                        Orien_answer: [NaN,NaN],
                        Orien_correct: NaN,

                        confidence: [NaN],
                        confidence_rt: [NaN],

                        applyStaircase: true,

                        })); //end new Trial

                        realId++;
                    } // trials per block
                }// staircase blocks


            if (section == "experimental") // then procedure is VWMarray,probe,discrim, (no interference)
                {
                    // let bid= 0; //block couner
                    // let id=0;
                    // let realid = 0; // cumulative counter.
                    // let ttypeid=0; // type of block structure (interference at baseline, encoding, etc)
                    
                    // console.log(this.useTypes);
                    let blockorder = Blocktypes; // this will be an array, either blocks in order or shuffled.

                    // first set the overarching order of block types.
                    if (this.PermuteBlocks ==true)
                    {
                        // permute the order of blocks, but always start with the baseline
                        blockorder = utils.shuffle(Blocktypes); // shuffle the block types of this experiment.
                    }


                    // define this order, so we can match the blocks when pushing to timeline.
                    trials.blockorder = blockorder;
                    // for each block type
                    for (let ttype = 0; ttype< this.useTypes.length; ttype++) {

                        //typeid starts at 0, for baseline. or first array in shuffled array
                        ttypeid = blockorder[ttype];

                        for  (let b=0; b< this.nBlocks; b++){
                         // }

                            bid++;

                            for (let i =0; i< trialCount; i++) { // for each trial in block

                            // push some empty info into the trials array, which we will overwrite later
                            // with the gov command in index.html window. Then we can revisit these 
                            // trials data, when calling other functions.
                            
                               
                                
                                trials.push(new Trial(realId, {
                               
                                    type: ttypeid,
                                    typeName: trialTypeNames[ttypeid],
                                    block: bid,                            
                                    trialid: i,
                                    realID: realId,
                                    
                                    WMstring: [NaN],
                                    WMprobe: [NaN],                        
                                    WM_answer: [NaN],
                                    WM_correct:[NaN],
                                    WM_rt:[NaN],
                                    WM_difficulty: [NaN], // how many pairs need to be alphabetized?

                                    degDiff: this.degree_diff,
                                    OrienDegs: [NaN,NaN], // left and right
                                    OrienProbe: [NaN],
                                    Orien_correct: [NaN],
                                    Orien_rt:[NaN],
                                    Orien_answer: [NaN,NaN],
                                    Orien_correct: NaN,
                                    

                                    confidence: [NaN],
                                    confidence_rt: [NaN],
                                    applyStaircase: false,
                                    
                                    
                                    // trialSelect: trialSelect
                                })); //end new Trial

                                realId++;
                            } // trials per block

                        } // blocks

                       
                    } // procedure types
                }
                return trials
            } //end getTrials

             initialResponse(trial, args={}) {
                this.storePluginData(trial);
                this.currentTrial.stimulusOffTime.push(trial.stimulusOffTime);
                // trial is the complete trial object with its trial.response object
                this.currentTrial.answer[0] = DotTask.getAnswerFromResponse(trial.response);
                this.currentTrial.confidence[0]  = DotTask.getConfidenceFromResponse(trial.response, this.currentTrial.answer[0]);
                this.getLastConfidenceCategory(); // set the confidence category
                this.closeTrial(trial);
                }
             /**
             * Extract the answer from the plugin's response. The plugin provides a value from 1-100,
             * values 0-49 indicate 'left', 50-100 indicate 'right'.
             *
             * @param {Object} response - response field provided by the jspsych-canvas-sliders-response plugin
             *
             * @return {int} 1 for a rightward response, 0 for a leftward response
             */
            static getAnswerFromResponse(response) {
                let ans = parseInt(response[0].answer);
                if(ans === 50)
                    return NaN;
                return ans > 50 ? 1 : 0;
            }

             static getConfidenceFromResponse(response, side) {
                let ans = parseInt(response[0].answer);
                if (isNaN(ans))
                    return NaN;
                switch(side) {
                    case 0: // left response
                        return 50 - ans;
                    case 1: // right response
                        return ans - 50;
                    default:
                        return NaN;
                }
            }

        // return the string used previously.

    prevString(trialID, args) { 
            args = args || {};
            args.nTrialsBack = typeof args.nTrialsBack === 'undefined'? this.trials.length : args.nTrialsBack;
                if(args.nTrialsBack === null)
                    args.nTrialsBack = this.trials.length;
            let trialIndex = this.trials.indexOf(utils.getMatches(this.trials, function (trial) {
                    return trial.id === trialId;
                })[0]);

    }

     /**
     * Wrap up a trial. Store data, staircase difficulty, and prepare next trial.
     * @param {Object} trial - jsPsych plugin response
     */
        closeTrial(trial) {
            // Staircasing stuff
            let warning = "";
            if (this.currentTrialIndex > 1) {
                // two-down one-up staircase
                let lastTrial = this.trials[this.currentTrialIndex - 1];
                if (!this.currentTrial.getCorrect(false)) {
                    // Wrong! Make it easier
                    this.dotDifference += this.difficultyStep.current;
                    if (this.dotDifference > this.dotCount - 1) {
                        this.dotDifference = this.dotCount - 1;
                        warning = "Difficulty at minimum!";
                    }

                    if (this.dotDifference > this.maxDD)
                    {
                        this.dotDifference = this.maxDD;
                    }

                    // Update the step size
                    //if (this.difficultyStep.current > this.difficultyStep.end
                    //    && --this.difficultyStep.currentReversals <= 0) {
                    //    this.difficultyStep.current--;
                    //    this.difficultyStep.currentReversals = this.difficultyStep.nReversals;
                    //}
                } else if (lastTrial.getCorrect(false) &&
                    this.currentTrial.getCorrect(false) &&
                    this.currentTrial.dotDifference === lastTrial.dotDifference) {
                    // Two hits, impressive! Make it harder
                    this.dotDifference -= this.difficultyStep.current;
                    if (this.dotDifference < 1) {
                        this.dotDifference = 1;
                        warning = "Difficulty at maximum!";
                    }
                }
            } else {
                // First trial: initialize the difficulty step tracker variables
                this.difficultyStep.current = this.difficultyStep.start;
                this.difficultyStep.currentReversals = this.difficultyStep.nReversals;
            }
            if (warning.length > 0 && this.currentTrialIndex < this.trials.length) {
                this.currentTrial.warnings.push(warning);
                console.warn(warning);
            }
            // Move to next trial
            this.currentTrialIndex++;
        }   

} // ends gov







 // * A Trial aggregates the information needed to run a single trial.
 // */
class Trial {
  constructor(id, args = {}) {     
        for (let key in args) {
            if (args.hasOwnProperty(key))
                this[key] = args[key];
        }

        // basic indexing:
        this.id = id;
        this.type = typeof args.type === 'undefined'? null : args.type;
        this.typeName = typeof args.typeName === 'undefined'? null : args.typeName;
        this.block = typeof args.block === 'undefined'? null : args.block;
        this.blockid = typeof args.blockid === 'undefined'? null : args.blockid;
        this.realID = typeof args.realID === 'undefined'? null : args.realID;

        // trial specific stimulus values:
        this.WMstring = typeof args.WMstring === 'undefined'? null : args.WMstring;
        this.WMprobe = typeof args.WMprobe === 'undefined'? null : args.WMprobe;
        this.WM_answer = typeof args.WM_answer === 'undefined'? null : args.WM_answer;
        this.WM_rt = typeof args.WM_rt === 'undefined'? null : args.WM_rt;
        this.WM_correct = typeof args.WM_correct === 'undefined'? null : args.WM_correct;
        this.WM_difficulty= typeof args.WM_difficulty === 'undefined'? null : args.WM_difficulty;

        this.OrienDegs = typeof args.OrienDegs === 'undefined'? null : args.OrienDegs;
        this.OrienProbe = typeof args.OrienProbe === 'undefined'? null : args.OrienProbe;
        this.Orien_answer = typeof args.Orien_answer === 'undefined'? null : args.Orien_answer;
        this.Orien_correct = typeof args.Orien_correct === 'undefined'? null : args.Orien_correct;
        

        //and staircasing    
        this.getCorrect = typeof args.getCorrect === 'undefined'? null : args.getCorrect;
        this.pluginResponse = typeof args.pluginResponse === 'undefined'? [] : args.pluginResponse;
        this.applyStaircase = typeof args.applyStaircase === 'undefined'? [] : args.applyStaircase;

        // include params for JSpsych plugins:        
        this.answer = typeof args.answer  === 'undefined'? null : args.answer ;
        this.confidence = typeof args.confidence === 'undefined'? null : args.confidence;
        this.confidence_rt = typeof args.confidence_rt === 'undefined'? null : args.confidence_rt;
        this.confidenceCategory = typeof args.confidenceCategory === 'undefined'? null : args.confidenceCategory;
        
        //and staircasing    
        this.getCorrect = typeof args.getCorrect === 'undefined'? null : args.getCorrect;
        this.degDifference = typeof args.degDifference === 'undefined' ? null : args.degDifference;
        this.whichSide = typeof args.whichSide === 'undefined'? null : args.whichSide;
        // this.practice = typeof args.practice === 'undefined'? null : args.practice;
        // this.feedback = typeof args.feedback === 'undefined'? null : args.feedback;
        this.warnings = typeof args.warnings === 'undefined'? []: args.warnings;
        this.stimulusDrawTime = typeof args.stimulusDrawTime === 'undefined'? null : args.stimulusDrawTime;
        this.stimulusOffTime = typeof args.stimulusOffTime === 'undefined'? null : args.stimulusOffTime;
        this.fixationDrawTime = typeof args.fixationDrawTime === 'undefined'? null : args.fixationDrawTime;
        this.pluginResponse = typeof args.pluginResponse === 'undefined'? [] : args.pluginResponse;
        
    





    }
}



  export {utils, trialTypes, trialTypeNames, processData,  OrientationStim, GaborFiles, MaskFiles, OrientationMasks, Trial, Governor, makeV_WMarray, makeV_WMprobe, BuildExp};


