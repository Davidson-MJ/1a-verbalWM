/** having specified some basic parameters in verbalWMdefs.js, 
now build some necessary objects for the experiment
*/



"use strict";
import {utils, trialTypes, trialTypeNames, processData, OrientationStim, Trial, Governor}
from './verbalWMdefs.js';

import debriefForm from "./debriefForm.js";



/**
 * @classdesc A gabor task governor controls the gabor display experiment functionality
 * @class
 * @augments Governor
 */

class OrienTask extends Governor { 

     // * @constructor
     // *
     // * @param {Object} [args={}] - properties to assign to the Governor
     // * @param {Trial[]} [args.trials=[]] - trial list
     // * @param {Object[]} [args.miscTrials] - miscellaneous trials (breaks, instructions, etc)
     // * @param {int} [args.currentTrialIndex=0] - index of current trial in trial list
     // * @param {string} [args.completionURL=''] - URL to which to refer participants for payment
     // * @param {string} [args.experimentCode=''] - code identifying the experiment
     // *
     // * @param {int} [args.dotCount] - number of dots in a box
     // * @param {int} [args.dotDifference] - half the difference between the dot counts in the two boxes; the difficulty
     // * @param {int} [args.difficultyStep] - amount the difficulty increases/decreases after success/failure
     // * @param {number} [args.minimumBlockScore] - lowest proportion of successful trials allowed on a block
     // * @param {int} [args.blockCount] - number of blocks in the study
     // * @param {Object|Object[]} [args.blockStructure] - the structure of each block, where each object is a series of [trialType: number of instances] mappings. Multiple objects represent different subblocks run consecutively.
     // * @param {Object|Object[]} [args.practiceBlockStructure] - the structure of each practice block
     // * @param {Object|Object[]} [args.blk4Structure] - structure for block 4 forced trials if indicated in index.html
     // * @param {int} [args.preTrialInterval] - delay before each trial begins
     // * @param {int} [args.preStimulusInterval] - fixation delay before the stimulus is displayed
     // * @param {int} [args.stimulusDuration] - duration the dot stimulus is displayed
     // * @param {int} [args.feedbackDuration] - duration of the feedback screen     *
     constructor(args = {}) {
        super(args); //pull from Governor
       
        this.degDifference = typeof args.degDifference === 'undefined'? null : args.degDifference;
        this.difficultyStep = typeof args.difficultyStep === 'undefined'? null : args.difficultyStep;
        this.minimumBlockScore = typeof args.minimumBlockScore === 'undefined'? null : args.minimumBlockScore;
        this.blockCount = typeof args.blockCount === 'undefined'? null : args.blockCount;
        this.blockStructure = typeof args.blockStructure === 'undefined'? [
            {
                0: 0
            }
        ] : utils.shuffle(args.blockStructure);
        this.practiceBlockStructure = typeof args.practiceBlockStructure === 'undefined'? {
            0: 0 
        } : args.practiceBlockStructure;
        this.blk4Structure = typeof args.blk4Structure === 'undefined' ? {
            0: 0
        } : args.blk4Structure;
        
        this.preTrialInterval = typeof args.preTrialInterval === 'undefined'? null : args.preTrialInterval;
        this.preStimulusInterval = typeof args.preStimulusInterval === 'undefined'? null : args.preStimulusInterval;
        this.stimulusDuration = typeof args.stimulusDuration === 'undefined'? null : args.stimulusDuration;
        this.feedbackDuration = typeof args.feedbackDuration === 'undefined'? null : args.feedbackDuration;
        this.numOfTrials = utils.sumList(this.blockStructure) + utils.sumList(this.practiceBlockStructure) + utils.sumList(this.blk4Structure);
        this.workingMemoryStack = []; //* return to this.
        this.maintainMemoryString = "";
    }

    /**
     * Return a list of Trial objects.
     *
     * A large part of the work of defining the experiment takes place here, although the key properties are
     * actually defined in the Governor definition.
     *
     * The trials defined here are the master list used by the Governor to decide which stimuli to serve,
     * which advisor or choice to offer, etc. This list is **not necessarily the same as** the trial list
     * established at the beginning of the experiment and handed to jsPsych. It is therefore the responsibility
     * of the programmer to ensure that these lists are lawfully aligned such that the block structures, etc.
     * match.
     *
     * A possible alternative strategy - push new trials to the jsPsych timeline at
     * the end of each completed trial. Since we don't get nice progress bar this way we may as well use on-the-fly
     * timeline tweaking. This may just be more work to duplicate jsPsych's capabilities, though
	 */
	getTrials() {
	 	let trials = [];
        let id = 0;
        let realId = 0;
        let blockCount = this.blockStructure.length * this.blockCount;
        let practiceBlockCount = this.practiceBlockStructure.length;       
        
        // Shuffle which side the correct answer appears on
        let whichSideDeck = utils.shuffleShoe([0, 1], utils.sumList(this.blockStructure));
        
        // Define trials
        for (let b=0; b<practiceBlockCount+blockCount; b++) {
            let blockIndex = b; // the block we're in
            if (b >= practiceBlockCount) {
                blockIndex = (b-practiceBlockCount)%this.blockStructure.length; // account for practice blocks
            }
            let blockLength = b<practiceBlockCount? utils.sumList(this.practiceBlockStructure[blockIndex]) :
                utils.sumList(this.blockStructure[blockIndex]);
            // Work out what type of trial to be
            let trialTypeDeck = [];                      
            let structure = b<practiceBlockCount?
                this.practiceBlockStructure[blockIndex] : this.blockStructure[blockIndex];
            }


            for (let tt=0; tt<Object.keys(trialTypes).length; tt++) {
                for (let i=0; i<structure[tt]; i++)
                    trialTypeDeck.push(tt);
            }
            trialTypeDeck = utils.shuffle(trialTypeDeck);
            for (let i=1; i<=blockLength; i++) {
                id++;
                let isPractice = b<practiceBlockCount;
                let trialType = trialTypeDeck.pop();
                let left;
                let right;
                let larger;
                
                // Below we retrieve the  configs, advice and confidences (if relevant) used for the trial
                // This is only for data recording purposes after the experiment.

    			//  trialTypes = {
    			// baseline: 0,   // no interference, simple task switching between WM and discriination
    			// encoding: 1,   // WM interference overlaps with stimulus presentation/encoding
    			// response: 2,    // WM interference overlaps with response mapping
    			// confj: 3,   // WM interference overlaps with providing confjudgement
    			// };
    			if (trialType == 1) {}
                
                else if (trialType == 2)    {}
                                 
                else {
                    left = null;
                    right = null;
                    larger = null;                    
                
                	trials.push(new Trial(id, {
                    type: trialType,
                    typeName: 'Orien', // may need to change? was 'dot'
                    block: b,
                    answer: [NaN, NaN],
                    confidence: [NaN, NaN],
                    getCorrect: function(finalAnswer = true) {
                        let answer = finalAnswer? this.answer[1] : this.answer[0];
                        return answer === this.whichSide;
                    },
                    whichSide: isPractice? Math.round(Math.random()) : whichSideDeck[realId],
                    practice: isPractice,
                    feedback: isPractice,
                    warnings: [],
                    stimulusDrawTime: [],
                    stimulusOffTime: [],
                    fixationDrawTime: [],                    
                    leftGrid: left,
                    rightGrid: right,
                    whereLarger: larger
                	}));
                if (!isPractice)
                    realId++;
                }
        }
        return trials;

	   }

       /**
     * Do the actual drawing on the canvas.
     *
     * This function is called by the trial (supplied as stimulus). Query the Governor to get the details for
     * drawing.
     *
     * @param {string} canvasId - id of the canvas on which to draw the dots (supplied by the trial)
     * @param {boolean} recalculateGrid - whether to recalculate the stimulus grid even if it exists
     */
    drawDots(canvasId, recalculateGrid = false) {
        let slider = document.querySelector('#jspsych-canvas-sliders-response-slider0');
        let marker = document.createElement('div');
        marker.className = 'advisorChoice-marker advisorChoice-middleBar';
        slider.parentElement.appendChild(marker);
        let container = document.querySelector('#jspsych-sliders-response-table0');
        container.style = "visibility: hidden";
        let xOffset = 0;
        let xDistance = 50;
        if (this.currentTrialIndex < this.numOfTrials)
        {
            let trialType = typeof this.currentTrial.type === 'undefined'? null : this.currentTrial.type;
            if(!(this.currentTrial.grid instanceof DoubleDotGrid) && !recalculateGrid) {
                this.currentTrial.dotDifference = this.dotDifference;
                let low = this.dotCount - this.dotDifference;
                let high = this.dotCount + this.dotDifference;
                let dots = this.currentTrial.whichSide === 0 ? [high, low] : [low, high];
                this.currentTrial.grid = new DoubleDotGrid(dots[0], dots[1], {
                    gridWidth: 20,
                    gridHeight: 20,
                    dotWidth: 3,
                    dotHeight: 3,
                    spacing: 100,
                    currentTrialType: trialType,
                    forcedTrials: permForced,
                    choiceTrials: permChoice,
                    blk4Trials: permBlk4
                });
            }

            let self = this;
            setTimeout(function () {
                self.currentTrial.fixationDrawTime.push(performance.now());
                DotTask.drawFixation(canvasId);
            }, this.preTrialInterval);
            setTimeout(function(){
                self.currentTrial.stimulusDrawTime.push(performance.now());
                self.currentTrial.grid.drawBoundingBoxes(canvasId);
                self.currentTrial.grid.draw(canvasId);
            }, this.preTrialInterval+this.preStimulusInterval);
        }

    }

    /**
     * Cover the dots in the boxes by redrawing the outer frame boxes
     * @param {HTMLElement} canvasContainer - div containing the canvas
     */
    maskDots(canvasContainer) {
            let canvas = canvasContainer.querySelector('canvas');
            this.currentTrial.grid.drawBoundingBoxes(canvas.id);
            let self = this;
            setTimeout(function () {
                let container = document.querySelector('#jspsych-sliders-response-table0');
                container.style = "";
            }, 100);
    }

    /**
     * Ensure the participant did the intro trial correctly
     * @param {Object} trial - jsPsych plugin response
     *
     * @return {Boolean|void} false if trial should be repeated or void if okay
     */
    checkIntroResponse(trial) {
        switch(this.currentTrialIndex) {
            case 0: // First practice - have to get it right (it's very easy)
                if(DotTask.getAnswerFromResponse(trial.response) !== this.currentTrial.whichSide) {
                    // redo the first trial
                    // returning false tells jsPsych to repeat the trial
                    return false;
                } else
                    return this.initialResponse(trial);
            default:
                return this.initialResponse(trial);
        }
    }

    /** Check the initial response to ensure that the participant hasn't selected neither answer.
     * @param {Object} trialresponse - potential response from the plugin
     * @return {boolean} true to allow the response through, false to prevent it
     */
    checkResponse(trialresponse) {
        let okay = trialresponse.response[0].answer!=="50";
        if(okay)
            return true;
        // Add a warning and reject response
        document.querySelector('#jspsych-canvas-sliders-response-warnings').innerHTML =
            "<span style='color: red'>Please choose one side or the other.</span>";
        return false;
    }

    /**
     * Process the judge's initial response
     * @param {Object} trial - jsPsych plugin response
     * @param {Object} [args={}] - assorted arguments to customize behaviour
     * @param {boolean} [args.advisorAlwaysCorrect - whether to override advisor's behaviour and force them to advice the correct response
     */
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
     * Draw a fixation cross on *canvasId*
     * @param {string} canvasId - id of the canvas on which to draw
     */
    static drawFixation(canvasId) {
        let ctx = document.querySelector('#'+canvasId).getContext('2d');
        let len = 5;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = '2';
        ctx.beginPath();
        // horizontal
        ctx.moveTo((ctx.canvas.clientWidth/2)-len, ctx.canvas.clientHeight/2);
        ctx.lineTo((ctx.canvas.clientWidth/2)+len, ctx.canvas.clientHeight/2);
        ctx.stroke();
        // vertical
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.clientWidth/2, (ctx.canvas.clientHeight/2)-len);
        ctx.lineTo(ctx.canvas.clientWidth/2, (ctx.canvas.clientHeight/2)+len);
        ctx.stroke();
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

    /**
     * Return the confidence score associated with a given slider.
     *
     * @param {Object} response - response field provided by jspsych-canvas-sliders-response plugin
     * @param {int} side - which side the answer was on (1 = right, 0 = left)
     *
     * @return {int} Confidence of the response from 1-50
     */
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

    /**
     * Sets a click function on the sliders which makes them behave as if they are moved to 50 when they are focussed.
     * This prevents users clicking on the slider, getting the visual feedback of the slider being activated and set,
     * and then being told they have not moved the slider.
     *
     * @param {boolean} [drawMiddleBar=true] - whether to draw the middle bar on the slider track
     * @param {boolean} [drawLabels=true] - whether to draw the labels on the slider track
     */
    setSliderClick(drawMiddleBar = false, drawLabels = true) {
        let sliders = document.querySelectorAll('.jspsych-sliders-response-slider');
        sliders.forEach(function (slider) {
            slider.addEventListener('click', function () {
                if (typeof this.clickFunctionRun !== 'undefined')
                    return;
                this.clickFunctionRun = true;
                if (this.value !== "50")
                    return;
                // send a change event
                let event = new Event('change');
                this.dispatchEvent(event);
            });
            let parent = slider.parentElement;
            if(drawMiddleBar) {
                // Add a visual indicator to the middle of the slider to show the excluded zone
                let marker = document.createElement('div');
                marker.className = 'advisorChoice-middleBar advisorChoice-marker';
                parent.appendChild(marker);
            }
            if(drawLabels) {
                let left = parent.appendChild(document.createElement('div'));
                let mid = parent.appendChild(document.createElement('div'));
                let right = parent.appendChild(document.createElement('div'));
                left.id = 'advisorChoice-slider-labels-left';
                mid.id = 'advisorChoice-slider-labels-mid';
                right.id = 'advisorChoice-slider-labels-right';
                left.className = "advisorChoice-slider-label advisorChoice-slider-label-left";
                mid.className = "advisorChoice-slider-label advisorChoice-slider-label-mid";
                right.className = "advisorChoice-slider-label advisorChoice-slider-label-right";
                left.innerHTML = '<span class="advisorChoice-slider-label-direction">LEFT <br/> 100% </span>';
                right.innerHTML = '<span class="advisorChoice-slider-label-direction">RIGHT <br/> 100%</span>';
                mid.innerHTML = '<br/> &nbsp; 50% &nbsp; &nbsp; &nbsp; 50%';
            }
        });
        this.setContentHeight();
        this.drawProgressBar();
    }

    /**
     * Apply a minimum height to the content so that things look consistent with teh advice and response sliders
     * @param {boolean} [unset=false] - whether to remove the class instead
     */
    setContentHeight(unset = false) {
        if(unset)
            document.querySelector('#jspsych-content').classList.remove('advisorChoice-minHeight');
        else
            document.querySelector('#jspsych-content').classList.add('advisorChoice-minHeight');
    }

    /**
     * Save plugin data and reset the content height fixing
     * @param {Object} plugin
     */
    storePluginData(plugin) {
        this.setContentHeight(false);
        super.storePluginData(plugin);
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
        // if (typeof this.currentTrial !== 'undefined')
        // {
        //     block = (this.trials[this.trials.length-1]).block-1;
        // }
        let trialList = utils.getMatches(this.trials, (trial)=>{
            return trial.block === block;
        });
        let hitList = utils.getMatches(trialList, (trial)=>{
            let answer = trial.answer[1];
            if (answer === null || isNaN(answer))
                answer = trial.answer[0];
            return answer === trial.whichSide;
        });


        let score = hitList.length / trialList.length * 100;
        let trial = this.trials[this.currentTrialIndex-1];
        // if (score < this. BlockScore) {
        //     this.terminateExperiment(score);
        //     return;
        // }
        let div = document.querySelector('#jspsych-content');
        let p = div.insertBefore(document.createElement('p'), div.querySelector('p'));
        p.innerHTML = "Your score on the last block was " + (Math.round(score*100)/100).toString() + "%.";
        //p.innerHTML = p.innerHTML + "<br />" + "Your confidence points total is " + trial.points;
        // let point = document.querySelector(".confidence-points-text p")
        // point.style = "display: none";
        this.drawProgressBar();
        this.exportGovernor();
    }

    /**
     * Take the stimuli from the cleanest previous trials and use them for the forthcoming trials
     * @param {boolean} [includePractice=false] whether to allow practice trial stimuli to be repeated
     */
    createRepetitionList(includePractice = false) {

        // Work out how many trials will be required
        let index = this.currentTrialIndex + 1;
        let trialsRemaining = this.trials.length - (index);
        let trialsAvailable = index;
        if(!includePractice) trialsAvailable -= utils.sumList(this.practiceBlockStructure);

        if(trialsAvailable < trialsRemaining)
            this.currentTrial.warnings.push("Repetition list has too few trials for stimuli repetition.");

        // Take the best trials from those available
        let allowableExclusions = trialsAvailable - trialsRemaining;

        let self = this;
        let trialPool = utils.getMatches(this.trials, function(trial) {
            if(!includePractice && trial.practice)
                return false;
            return trial.id < index;
        });

        let reactionTime = false;
        let difficulty = false;
        // remove the worst trial until we're at the limit
        let reps = 0;
        while(allowableExclusions > 0) {
            let tempPool = [];
            if(!reactionTime) {
                // Worst trial is defined as that with longest RT
                let RTs = [];
                trialPool.forEach((trial)=>RTs.push(parseInt(trial.pluginResponse[0].rt)));

                let mean = utils.mean(RTs);
                let sd = utils.stDev(RTs);

                let Zs = [];
                RTs.forEach((rt)=>Zs.push((rt - mean) / sd));

                let max = utils.max(Zs, true);
                if(max < 3) // Less than 3SD is fine, all remaining trials can be included
                    reactionTime = true;
                else {
                    let rt = max > 0? utils.max(RTs) : utils.min(RTs);
                    tempPool = utils.getMatches(trialPool, function(trial) {
                        if(parseInt(trial.pluginResponse[0].rt) === rt) {
                            trial.repeatRejection = "reaction time";
                            return false;
                        } else {
                            trial.repeatRejection = false;
                            return true;
                        }
                    });
                }
            } else if(!difficulty) {
                // Worst trials are those with difficulty furthest from the median difficulty
                let dotDiffs = [];
                trialPool.forEach((trial)=>dotDiffs.push(trial.dotDifference));
                let median = dotDiffs.sort((a, b) => a - b); // sort numerically rather than alphabetically
                if(median.length % 2 === 1)
                    median = (median[Math.floor(median.length / 2)] + median[Math.ceil(median.length / 2)]) / 2;
                else
                    median = median[median.length / 2];
                let err = [];
                trialPool.forEach((trial)=>err.push(Math.abs(trial.dotDifference - median)));

                if(utils.max(err) <= gov.difficultyStep.end)
                    difficulty = true;
                else {
                    let worst = dotDiffs[err.indexOf(utils.max(err))];
                    tempPool = utils.getMatches(trialPool, function(trial) {
                        if(trial.dotDifference === worst) {
                            trial.repeatRejection = "difficulty";
                            return false;
                        }
                        return true;
                    });
                }
            }

            if(tempPool.length < trialsRemaining)
                break; // don't over-prune

            trialPool = tempPool;
            allowableExclusions = trialPool.length - trialsRemaining;

            if(++reps > 1000)
                return false;
        }

        // Shuffle stimuli from selected trials and assign them to forthcoming trials
        trialPool = utils.shuffle(trialPool);
        for(let i = index; i < this.trials.length; i++) {
            if(i - index >= trialPool.length)
                break; // ran out of trials in the pool
            let trial = trialPool[i - index];
            this.trials[i].grid = new DoubleDotGrid(trial.grid);
            this.trials[i].dotDifference = trial.dotDifference;
            // swap the boxes around if necessary
            if(this.trials[i].whichSide !== trial.whichSide)
                this.trials[i].grid.swapSides();
            this.trials[i].stimulusParent = trial.id;
        }

        return true;
    }

    /**
     * Stop the experiment prematurely
     *
     * @param {number} score - score obtained on previous block
     */
    // terminateExperiment(score = 0.0) {
    //     let div = document.querySelector('#jspsych-content');
    //     div.innerHTML = "<p>Your score on the last block was " + (Math.round(score*100)/100).toString() + "%.</p>" +
    //     "<p>This is below the score required to continue with the study, so your participation has been ended prematurely.</p>";
    //     div.classList.add('terminated');
    //     this.drawProgressBar();
    // }

        /**
     * Draw the form which asks participants for age and gender
     */
    drawDemographicForm() {
        let owner = this;
        // Create form
        let div = document.querySelector('.jspsych-content').appendChild(document.createElement('div'));
        div.id = 'demoContainer';
        div.className = 'demo';
        let form = div.appendChild(document.createElement('form'));
        form.id = 'demoForm';
        form.className = 'demo';
        let questions = [];
        questions.push({
            prompt: 'Please provide gender as either "m" or "f"',
            mandatory: true,
            type: 'text'
        });
        questions.push({
            prompt: 'How many hours on any given day would you say you spend on an electronic device such as a smartphone or computer? (enter a single digit, such as: 1)',
            mandatory: true,
            type: 'text'
        });
        questions.push({
            prompt: 'Please provide your age',
            mandatory: true,
            type: 'text'
        });
        for(let i = 0; i < questions.length; i++) {
            let comment = form.appendChild(document.createElement('div'));
            comment.id = 'demoCommentContainer'+i;
            comment.className = 'demo demo-container';
            if(i > 0)
            {  
                comment.classList.add('hidden');
            }
            let commentQ = comment.appendChild(document.createElement('div'));
            commentQ.id = 'demoCommentQuestion'+i;
            commentQ.className = 'demo question';
            commentQ.innerHTML = "<strong>Q"+(i+1)+"/"+(questions.length)+":</strong> " + questions[i].prompt;
            let commentA = comment.appendChild(document.createElement('textarea'));

            commentA.id = 'demoCommentAnswer'+i;
            commentA.className = 'demo answer';

            if (i ==0)
            {
                commentA.placeholder = 'Enter your gender here'
            }

            else if (i == 1)
            {
                commentA.placeholder = 'Enter the number of hours here'
            }

            else
            {
                commentA.placeholder = 'Enter your age here'
            }

            let ok = comment.appendChild(document.createElement('button'));
            ok.innerText = i === questions.length - 1? 'submit' : 'next';
            ok.className = 'demo jspsych-btn';

            let checkResponse;
            let saveResponse;
            checkResponse = function(form) {
                let div = form.querySelector('.demo-container:not(.hidden)');
                let ok = div.querySelector('textarea').value !== "";
                if(!ok)
                    div.classList.add('bad');
                else
                    div.classList.remove('bad');
                return ok;
            };
            saveResponse = function(form) {
                let q = questions[i];
                q.answer = form.querySelector('.demo-container:not(.hidden) textarea').value;
                gov.demo.push(q);
            };
            if(!questions[i].mandatory)
                checkResponse = ()=>true;

            if(i === questions.length - 1)
                ok.onclick = function (e) {
                    e.preventDefault();
                    if(!checkResponse(this.form))
                        return false;
                    if (isNaN(parseInt(form.querySelector('#demoCommentAnswer2').value)))
                    {
                        return false;
                    }
                    else
                    {
                        if (parseInt(form.querySelector('#demoCommentAnswer2').value) < 18 || parseInt(form.querySelector('#demoCommentAnswer1').value) > 100)
                        {
                            return false;
                        }
                    }
                    saveResponse(this.form);
                    owner.demoFormSubmit(form);
                };
            else
                ok.onclick = function(e) {
                    e.preventDefault();
                    if(!checkResponse(this.form))
                        return false;
                    if (form.querySelector('#demoCommentAnswer0').value != 'm' && form.querySelector('#demoCommentAnswer0').value != 'f')
                        return false;
                    if (i > 0)
                    {
                        if (isNaN(parseInt(form.querySelector('#demoCommentAnswer1').value)))
                        {
                            return false;
                        }
                        if (form.querySelector('#demoCommentAnswer1').value.length > 1)
                        {
                            return false;
                        }
                    }
                    saveResponse(this.form);
                    let div = this.form.querySelector('.demo-container:not(.hidden)');
                    div.classList.add('hidden');
                    div.nextSibling.classList.remove('hidden');
                }
        }

        gov.demo = [];
    }    

    demoFormSubmit(form) {
        this.demo = [
            {
                question: 'gender',
                answer: form.querySelector('#demoCommentAnswer0').value
            },
            {
                question: 'deviceUse',
                answer: form.querySelector('#demoCommentAnswer1').value
            },
            {
                question: 'age',
                answer: form.querySelector('#demoCommentAnswer2').value
            }
        ];
        jsPsych.finishTrial(this.demo);
    }

    /**
     * Draw the form which asks participants for final comments
     */
    drawDebriefForm() {
        let owner = this;
        // Create form
        let div = document.querySelector('.jspsych-content').appendChild(document.createElement('div'));
        div.id = 'debriefContainer';
        div.className = 'debrief';
        let header = div.appendChild(document.createElement('h1'));
        header.id = 'debriefTitle';
        div.className = 'debrief';
        header.innerText = 'finally...';
        let form = div.appendChild(document.createElement('form'));
        form.id = 'debriefForm';
        form.className = 'debrief';
        let questions = [];
        if(gov.repeatTrials || gov.showRepeatDebrief) {
            questions.push({
                prompt: 'Did you notice anything about the dots?',
                mandatory: true,
                type: 'text'
            });
            questions.push({
                prompt: 'Some of the dot grids were repeated, did you recognise any from previous rounds?',
                mandatory: true,
                type: 'scale',
                labels: [
                    'No, none',
                    'Yes, lots'
                ],
                nOptions: 7
            });
            questions.push({
                prompt: 'Please select any grids you recognise from the experiment.',
                mandatory: true,
                type: 'grids',
                nOptions: 5,
                nRepeats: 1,
                nSwapped: 1
            });
        }
        questions.push({
            prompt: 'Finally, do you have any comments or concerns about the experiment? <em>(optional)</em>',
            mandatory: false,
            type: 'text'
        });
        for(let i = 0; i < questions.length; i++) {
            let comment = form.appendChild(document.createElement('div'));
            comment.id = 'debriefCommentContainer'+i;
            comment.className = 'debrief debrief-container';
            if(i > 0)
                comment.classList.add('hidden');
            let commentQ = comment.appendChild(document.createElement('div'));
            commentQ.id = 'debriefCommentQuestion'+i;
            commentQ.className = 'debrief question';
            commentQ.innerHTML = "<strong>Q"+(i+1)+"/"+(questions.length)+":</strong> " + questions[i].prompt;
            let commentA = null;
            switch(questions[i].type) {
                case 'text':
                    commentA = comment.appendChild(document.createElement('textarea'));
                    break;
                case 'scale':
                    commentA = comment.appendChild(document.createElement('div'));
                    let labels = commentA.appendChild(document.createElement('div'));
                    labels.className = "debrief labels";
                    for(let L = 0; L < questions[i].labels.length; L++) {
                        let label = labels.appendChild(document.createElement('div'));
                        label.innerHTML = questions[i].labels[L];
                    }

                    let radios = commentA.appendChild(document.createElement('div'));
                    radios.className = 'radios';
                    for(let o = 0; o < questions[i].nOptions; o++) {
                        let radio = radios.appendChild(document.createElement('input'));
                        radio.type = 'radio';
                        radio.value = (o + 1).toString();
                        radio.name = commentQ.id;
                    }
                    break;
                case 'grids':
                    commentA = comment.appendChild(document.createElement('div'));
                    let x = this.blockStructure.length;
                    let targets = utils.shuffle(utils.getMatches(this.trials, (t)=>t.block === x));
                    let grids = [];
                    let meta = []; // stores meta properties for the grid. Don't write to grid or it screws up hashing
                    for(let g = 0; g < questions[i].nOptions; g++) {
                        let target = targets.pop();
                        let grid = new DoubleDotGrid(target.grid);
                        let t = null;
                        if(g >= questions[i].nRepeats && g < questions[i].nRepeats + questions[i].nSwapped) {
                            // swap grid
                            grid.swapSides();
                            t = "swapped";
                        } else if(g >= questions[i].nRepeats + questions[i].nSwapped) {
                            grid.gridL = grid.renewGrid(grid.dotCountL);
                            grid.gridR = grid.renewGrid(grid.dotCountR);
                            t = "new";
                        } else
                            t = "repeat";
                        grids.push(grid);
                        meta.push({id: g, type: t, parentTrialId: target.id});
                    }
                    let order = utils.shuffle(utils.getSequence(0, grids.length -1));
                    grids = utils.orderArray(grids, order);
                    meta = utils.orderArray(meta, order);
                    let div = commentA.appendChild(document.createElement('div'));
                    div.classList.add('grid-MCQ');
                    grids.forEach((g)=>{
                        let canvas = div.appendChild(document.createElement('canvas'));
                        canvas.id = 'Grid' + meta[grids.indexOf(g)].id;
                        canvas.width = g.displayWidth * 2 + g.spacing;
                        canvas.height = g.displayHeight;
                        g.draw(canvas.id);
                        canvas.addEventListener('click', (e)=>{
                            e.target.classList.toggle('selected');
                            document.querySelector('#GridMCQNone').checked = false;
                        });
                        canvas.grid = g;
                        canvas.meta = meta[grids.indexOf(g)];
                    });
                    let zeroDiv = div.appendChild(document.createElement('div'));
                    let zero = zeroDiv.appendChild(document.createElement('input'));
                    zero.type = 'checkbox';
                    zero.id = 'GridMCQNone';
                    zero.addEventListener('click', (e)=>{
                       document.querySelectorAll('.grid-MCQ canvas').forEach((c)=>c.classList.remove('selected'));
                    });
                    zeroDiv.appendChild(document.createElement('p')).innerText = "No grids are repeated";

            }
            commentA.id = 'debriefCommentAnswer'+i;
            commentA.className = 'debrief answer';

            let ok = comment.appendChild(document.createElement('button'));
            ok.innerText = i === questions.length - 1? 'submit' : 'next';
            ok.className = 'debrief jspsych-btn';

            let checkResponse;
            let saveResponse;
            switch(questions[i].type) {
                case 'text':
                    checkResponse = function(form) {
                        let div = form.querySelector('.debrief-container:not(.hidden)');
                        let ok = div.querySelector('textarea').value !== "";
                        if(!ok)
                            div.classList.add('bad');
                        else
                            div.classList.remove('bad');
                        return ok;
                    };
                    saveResponse = function(form) {
                        let q = questions[i];
                        q.answer = form.querySelector('.debrief-container:not(.hidden) textarea').value;
                        gov.debrief.push(q);
                    };
                    break;
                case 'scale':
                    checkResponse = function(form) {
                        let div = form.querySelector('.debrief-container:not(.hidden) .radios');
                        let ok = false;
                        let radios = div.querySelectorAll('input[type="radio"]');
                        radios.forEach((r)=>{if(r.checked) ok = true});
                        if(!ok)
                            form.querySelector('.debrief-container:not(.hidden)').classList.add('bad');
                        else
                            form.querySelector('.debrief-container:not(.hidden)').classList.remove('bad');
                        return ok;
                    };
                    saveResponse = function(form) {
                        let q = questions[i];
                        form.querySelectorAll('.debrief-container:not(.hidden) input[type="radio"]').forEach(
                            (r)=>{ if(r.checked) q.answer = r.value}
                        );
                        gov.debrief.push(q);
                    };
                    break;
                case 'grids':
                    checkResponse = function(form) {
                        let div = form.querySelector('.debrief-container:not(.hidden)');
                        let ok = false;
                        if(document.querySelector('#GridMCQNone').checked)
                            ok = true;
                        document.querySelectorAll('.grid-MCQ canvas').forEach((c)=>{
                            if(c.classList.contains('selected'))
                                ok = true;
                        });
                        if(ok)
                            form.querySelector('.debrief-container:not(.hidden)').classList.remove('bad');
                        else
                            form.querySelector('.debrief-container:not(.hidden)').classList.add('bad');
                        return ok;
                    };
                    saveResponse = function(form) {
                        let quiz = [];
                        form.querySelectorAll('.grid-MCQ canvas').forEach((c)=>{
                            let q = {};
                            q.grid = c.grid; // write grid
                            Object.keys(c.meta).forEach((k) => q[k] = c.meta[k]); // write metadata
                            q.selected = c.classList.contains('selected');
                            quiz.push(q);
                        });
                        gov.dotRepQuiz = quiz;
                    };
                    break;
            }
            if(!questions[i].mandatory)
                checkResponse = ()=>true;

            if(i === questions.length - 1)
                ok.onclick = function (e) {
                    e.preventDefault();
                    if(!checkResponse(this.form))
                        return false;
                    saveResponse(this.form);
                    owner.debriefFormSubmit(form);
                };
            else
                ok.onclick = function(e) {
                    e.preventDefault();
                    if(!checkResponse(this.form))
                        return false;
                    saveResponse(this.form);
                    let div = this.form.querySelector('.debrief-container:not(.hidden)');
                    div.classList.add('hidden');
                    div.nextSibling.classList.remove('hidden');
                }
        }

        gov.debrief = [];
    }

    /**
     * submit the debrief form and finish the experiment
     *
     */
    debriefFormSubmit(form) {
        document.querySelector('body').innerHTML = "";
        this.endExperiment();
    }

    /**
    * Draw a questionnaire with multiple choice radio buttons.
    * @param {array} qs - array of strings for question texts
    * @param {array} options - array of strings for choices for the questions.
    * @param {string} name - name of the questionnaire.
    */
    drawRadioQuestionnaire(qs,options,name)
    {
        let owner = this;
        // Create form
        let div = document.querySelector('.jspsych-content').appendChild(document.createElement('div'));
        div.id = 'questionContainer';
        div.className = name;
        let header = div.appendChild(document.createElement('h1'));
        header.id = name + 'Title';
        div.className = name;
        let form = div.appendChild(document.createElement('form'));
        form.id = name + 'Form';
        form.className = 'name';

        let numOfQuestions = qs.length;
        let numOfOptions = options.length;

        let questions = [];

        // Go through questions list and append to form each 
        // With options laid out in the function argument

        for (let i = 0;i<numOfQuestions;i++)
        {
            questions.push({
                prompt: qs[i],
                mandatory: true,
                type: 'scale',
                labels: options,
                nOptions: numOfOptions
            });

        }

        for(let i = 0; i < questions.length; i++) 
        {
            let comment = form.appendChild(document.createElement('div'));
            comment.id = 'questionCommentContainer'+i;
            comment.className = 'questionContainer';
            if(i > 0)
            {
                comment.classList.add('hidden');
            }
            let commentQ = comment.appendChild(document.createElement('div'));
            commentQ.id = 'questionCommentQuestion'+i;
            commentQ.className = 'question question';
            commentQ.innerHTML = "<strong>Q"+(i+1)+"/"+(questions.length) + ":  " + questions[i].prompt + "</strong> ";
            commentQ.style = "font-size: 1.5em";
            let commentA = comment.appendChild(document.createElement('div'));

            let radios = commentA.appendChild(document.createElement('div'));
            let table = radios.appendChild(document.createElement('table'));
            table.style = 'margin-right: auto; margin-left: auto';
            for(let o = 0; o < questions[i].nOptions; o++) {
                let tr = table.appendChild(document.createElement('tr'));
                radios.className = 'radios';
                radios.id = 'options';
                radios.style = 'margin-top: 10px';

                let td = tr.appendChild(document.createElement('td'));

                let label = td.appendChild(document.createElement('label'));
                let labelid = "label-"+i+"-"+o;
                label.id = labelid;
                label.style = "display:block; margin:5px";

                let choice = document.getElementById(labelid);
                choice.innerHTML = options[o];


                let td2 = tr.appendChild(document.createElement('td'));

                let radio = td2.appendChild(document.createElement('input'));
                radio.type = 'radio';
                radio.value = (o + 1).toString();
                radio.name = commentQ.id;
                radio.style = "justify-self: center; height: 3em; width: 3em";
            } 

            let ok = comment.appendChild(document.createElement('button'));
            ok.innerText = i === questions.length - 1? 'submit' : 'next';
            ok.className = 'question jspsych-btn';

            let checkResponse;
            let saveResponse;

            checkResponse = function(form) {
            let div = form.querySelector('.questionContainer:not(.hidden) .radios');
            let ok = false;
            let radios = div.querySelectorAll('input[type="radio"]');
            radios.forEach((r)=>{if(r.checked) ok = true});
            if(!ok)
                form.querySelector('.questionContainer:not(.hidden)').classList.add('bad');
            else
                form.querySelector('.questionContainer:not(.hidden)').classList.remove('bad');
            return ok;
            };

            saveResponse = function(form) {
                let q = questions[i];
                form.querySelectorAll('.questionContainer:not(.hidden) input[type="radio"]').forEach(
                    (r)=>{ if(r.checked) q.answer = r.value}
                );
                gov.radioResponses.push(q);
            };       

           if(!questions[i].mandatory)
           {
                checkResponse = ()=>true;
           }

            if(i === questions.length - 1)
                ok.onclick = function (e) {
                    e.preventDefault();
                    if(!checkResponse(this.form))
                        return false;
                    saveResponse(this.form);
                    owner.radioFormSubmit(form,questions,numOfQuestions,name);
                };
            else
                ok.onclick = function(e) {
                    e.preventDefault();
                    if(!checkResponse(this.form))
                        return false;
                    saveResponse(this.form);
                    let div = this.form.querySelector('.questionContainer:not(.hidden)');
                    div.classList.add('hidden');
                    div.nextSibling.classList.remove('hidden');
                    }
        }

        gov.radioResponses = [];
    }

    /**
     * Submit the questionnaire form
     * Needs to be done for each questionnaire to allow for multiple sets of survey data
     * to be collected. 
     */
    radioFormSubmit(form,qs,numOfQuestions,name) {
        var radioData = [];
        for (let q = 0;q<numOfQuestions;q++)
        {
            let questionQuery = '#questionCommentContainer' + q;
            //radioData.push({question: qs[q]},{answer: form.querySelector(questionQuery).answer});
            radioData.push({question: qs[q].prompt, answer: qs[q].answer});
        }
        this.radio = radioData;
        document.querySelector('#questionContainer').innerHTML = "";
        jsPsych.finishTrial(this.radio);
    }

    feedback(data, includePayment = false) {
        if(typeof data === 'undefined')
            data = this;
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(function(){dotTask.showFeedback(data, includePayment)});
    }

    endExperiment(saveData = true, clearScreen = true) {
        this.timeEnd = (new Date()).getTime();
        // Exit fullscreen
        //this.fullscreenMode(false);
        if(saveData === true)
            this.exportGovernor();
        // reset background colour
        if(clearScreen === true) {
            document.querySelector('body').style.backgroundColor = '';
            //document.body.innerHTML = "<div id='content'></div>";
            document.body.innerHTML = '<img width="1000" height="700" src="./instructions/Slide18.jpeg" style="transform: translate(50%, 20%)"></img>';
        }
        //this.feedback(this, (saveData && this.completionURL !== ''));
    }

    /**
     * Return the category of the confidence offered in the trial with id *trialId*. Confidence category is 0, 1, or 2
     * depending upon whether the confidence is in the lower 30%, middle 40%, or upper 30% of trials.
     * @param {int} trialId - identifier of the trial
     * @param {Object} [args] - additional options object
     * @param {int} [args.nTrialsBack=null] - maximum number of trials to search
     * @param {boolean} [args.correctOnly=true] - whether to only extract confidence on correct trials
     * @param {boolean} [args.initialAnswerCorrect=true] - whether to test the inital (as opposed to final answer) correctness
     * @param {boolean} [args.initialConfidence=true] - whether to count the initial (as opposed to final) confidence
     */
    getConfidenceCategory(trialId, args) {
        args = args || {};
        args.nTrialsBack = typeof args.nTrialsBack === 'undefined'? this.trials.length : args.nTrialsBack;
        if(args.nTrialsBack === null)
            args.nTrialsBack = this.trials.length;
        args.correctOnly = typeof args.correctOnly === 'undefined'? true : args.correctOnly;
        args.initialAnswerCorrect = typeof args.initialAnswerCorrect? true : args.initialAnswerCorrect;
        args.initialConfidence = typeof args.initialConfidence? true : args.initialConfidence;
        let trialIndex = this.trials.indexOf(utils.getMatches(this.trials, function (trial) {
            return trial.id === trialId;
        })[0]);
        if (trialIndex === -1) {
            this.currentTrial.warnings.push('getConfidenceCategory: trial not found in this.trials');
            return 1;
        }
        if (trialIndex === 0)
            return 1; // first trial has no history
        let confidenceScore = this.trials[trialIndex].confidence[(args.initialConfidence? 0 : 1)];

        // collate valid trials and get confidence
        let confidenceList = [];
        for (let i=0; i<args.nTrialsBack; i++) {
            // stop if we run out of trials
            if (i+1 === trialIndex) {
                break;
            }
            let trial = this.trials[trialIndex-(i+1)];
            // have to have provided a confidence
            if (isNaN(trial.confidence[(args.initialConfidence? 0 : 1)]))
                continue;
            // have to be correct if we want only correct trials
            if (args.correctOnly && trial.answer[(args.initialAnswerCorrect? 0 : 1)] !== trial.whichSide)
                continue;
            confidenceList.push(trial.confidence[(args.initialConfidence? 0 : 1)]);
        }

        // Put confidence list in order
        confidenceList.sort();
        // Find the markers at 30% and 70%
        let bounds = {
            low: confidenceList[Math.ceil(confidenceList.length*.3)],
            high: confidenceList[Math.floor(confidenceList.length*.7)]
        };

        // Protect against too few trials
        if (typeof bounds.low === 'undefined' || typeof bounds.high === 'undefined') {
            this.currentTrial.warnings.push('getConfidenceCategory: too few trials available to estimate confidence');
            return 1;
        }

        if (confidenceScore > bounds.low && confidenceScore < bounds.high)
            return 1;
        if (confidenceScore <= bounds.low)
            return 0;
        if (confidenceScore >= bounds.high)
            return 2;

        // Fallback
        this.currentTrial.warnings.push('getConfidenceCategory: confidence score ('+confidenceScore+') fell through ' +
            'bounds ['+bounds.low+', '+bounds.high+']');
    }

    /**
     * Get the confidence category of the last response
     * @param {Object} [args] - additional options object
     * @param {int} [args.nTrialsBack=null] - maximum number of trials to search
     * @param {boolean} [args.correctOnly=true] - whether to only extract confidence on correct trials
     * @param {boolean} [args.initialAnswerCorrect=true] - whether to test the inital (as opposed to final answer) correctness
     * @param {boolean} [args.initialConfidence=true] - whether to count the initial (as opposed to final) confidence
     */
    getLastConfidenceCategory(args) {
        let last = utils.getMatches(this.trials, function (trial) {
            return !isNaN(trial.answer[0]);
        }).length-1;

        let cc = this.getConfidenceCategory(this.trials[last].id, args);
        this.trials[last].confidenceCategory = cc;
        return cc;
    }

    pointsTotal(points) {
        let ele = document.querySelector(".confidence-points-text");
        if (ele == null)
        {
            let ctx = document.querySelector('body');
            //let tr = ctx.appendChild(document.createElement('tr'));
            let tr = ctx.insertBefore(document.createElement('tr'),document.querySelector(".jspsych-content-wrapper"))
            tr.className = "confidence-points-table";
            tr.style = "align-self: center";
            let th = tr.appendChild(document.createElement('th'));
            th.className = "confidence-points-text";
            let p = th.appendChild(document.createElement('p'));
            let text = "Current Points: " + points.toString();
            p.style = "margin-block-start: 0em; margin-block-end: 0em";
            p.innerText = text;
        }
        else
        {
            let p = document.querySelector(".confidence-points-text p")
            p.style = "margin-block-start: 0em; margin-block-end: 0em; display: block";
            p.innerText = "Current Points: " + points.toString();
        }
    }

    /**
     * Show feedback for the current trial.
     * Called by jspsych-canvas-sliders-response
     * @param {string} canvasId - id of the canvas to draw on
     */
    showTrialFeedback(canvasId) {
        let canvas = document.getElementById(canvasId);
        // give feedback on previous trial
        let trial = this.trials[this.currentTrialIndex-1];
        DotTask.drawFixation(canvasId);
        trial.grid.drawBoundingBoxes(canvasId);
        trial.grid.draw(canvasId, trial.whichSide);
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
}

class MyBlocks extends OrienTask 
	{
	//* see AdvisorChoice in mjaqs advisorChoicedefs.js
	/**
     * @constructor
     *
     * @param {Object} [args={}] - properties to assign to the Governor
     * @param {Trial[]} [args.trials=[]] - trial list
     * @param {Object[]} [args.miscTrials] - miscellaneous trials (breaks, instructions, etc)
     * @param {int} [args.currentTrialIndex=0] - index of current trial in trial list
     * @param {string} [args.completionURL=''] - URL to which to refer participants for payment
     * @param {string} [args.experimentCode=''] - code identifying the experiment
     *
     * @param {int} [args.dotCount] - number of dots in a box
     * @param {int} [args.dotDifference] - half the difference between the dot counts in the two boxes; the difficulty
     * @param {int} [args.difficultyStep] - amount the difficulty increases/decreases after success/failure
     * @param {number} [args.minimumBlockScore] - lowest proportion of successful trials allowed on a block
     * @param {int} [args.blockCount] - number of blocks in the study
     * @param {Object|Object[]} [args.blockStructure] - the structure of each block, where each object is a series of [trialType: number of instances] mappings. Multiple objects represent different subblocks run consecutively.
     * @param {Object|Object[]} [args.practiceBlockStructure] - the structure of each practice block
     * @param {int} [args.preTrialInterval] - delay before each trial begins
     * @param {int} [args.preStimulusInterval] - fixation delay before the stimulus is displayed
     * @param {int} [args.stimulusDuration] - duration the dot stimulus is displayed
     * @param {int} [args.feedbackDuration] - duration of the feedback screen
     *
     * @param {Advisor[]} [args.advisors=[]] - list of advisors
     * @param {Advisor[]} [args.practiceAdvisors=[]] - practice advisor
     * @param {[Advisor[]]} [args.advisorLists] - list of lists of advisors, each one being a set of advisors competing with one another in a block
     * @param {[Advisor[]]} [args.contingentAdvisors] - list of advisors to be used contingent on the confidence category of a response matching the list index
     * @param {[Advisor[]]} [args.questionnaireStack] - stack of advisors about whom questionnaires are to be asked
     * @param {Object} [args.generalisedTrustQuestionnaire=null] - Generalised Trust Questionnaire response
     * @param {int} [args.changeTime = 1500] - time to offer advisor change on change trials in ms
     *
     * @property {Advisor} currentAdvisor - advisor currently in focus
     * @property {Trial} currentTrial - trial currently underway
     */
	constructor(args = {}) 
		{
        super(args);
        // this.advisors = typeof args.advisors === 'undefined'? [] : AdvisorChoice.addAdvisors(args.advisors);
        // this.practiceAdvisors = typeof args.practiceAdvisors === 'undefined'? [] : args.practiceAdvisors;
        // this.advisorLists = typeof args.advisorLists === 'undefined'? null : args.advisorLists;
        // this.contingentAdvisors = typeof args.contingentAdvisors === 'undefined'? null : args.contingentAdvisors;
        this.questionnaireStack = typeof args.questionnaireStack === 'undefined'? null : args.questionnaireStack;
        // this.generalisedTrustQuestionnaire = typeof args.generalisedTrustQuestionnaire === 'undefined'?
            // null : args.generalisedTrustQuestionnaire;
        this.changeTime = typeof args.changeTime === 'undefined'? 1500 : args.changeTime;
        this.drawDebriefForm = debriefForm; // 
        this.maxDD = args.degDifference;
        // this.forcedTrials = permForced;
        // this.choiceTrials = permChoice;
        // this.blk4Trials = permBlk4;
        // this.confidenceOn = args.confidenceOn;
        this.beepOn = args.beepOn;
        // this.audioSrc = args.audioSrc; 
        this.staircase = args.staircase;
        this.redirect = args.redirect;
        // this.firstForced = 0;
        // this.firstChoice = 0;
    	}	

        getTrials(section="experimental") {
        // build the trials.
        let trials = [];
        let realId = 0;
        
        let blockCount = this.blockStructure.length;
        let practiceBlockCount = this.practiceBlockStructure.length;
        // Same for which side the correct answer appears on
        // let whichSideDeck = utils.shuffleShoe([0, 1], advisorSets*utils.sumList(this.blockStructure));
        
        // Define trials
        let advisorSet = 0;
        let advisor0id = null;
        let advisor1id = null;
        let blockStructure = null;
        let advisorChoices = [];
        let advisorForceDeck = null;
        let advisorChangeDeck = null;
        let advisorForceBlk4Deck = null;
        let advisorBlk4Deck = null;
        if (section=="practice")
        {
            let id = 0;
            for (let b=0; b<practiceBlockCount; b++) {                
                blockStructure = this.practiceBlockStructure[b];                
                let blockLength = utils.sumList(blockStructure);
                // Work out what type of trial to be
                let trialTypeDeck = [];
                for (let tt=0; tt<Object.keys(trialTypes).length; tt++) {
                    for (let i=0; i<blockStructure[tt]; i++)
                        trialTypeDeck.push(tt);
                }
                trialTypeDeck = utils.shuffle(trialTypeDeck);
                for (let i=1; i<=blockLength; i++) 
                {
                    id++;
                    let isPractice = true;
                    let trialType = trialTypeDeck.pop();
                    
                    let left;
                    let right;
                    let larger;
                    let trialSelect;
                    // Below we pull the advisor, dots and confidence used for this trial again.
                    // We merely do this for data recoridng purposes at the end of the experiment.
                    left = null;
                    right = null;
                    larger = null;
                    trialSelect = null;
                    let changes = trialType === trialTypes.change? 0 : null;

                    trials.push(new Trial(id, {
                        type: trialType,
                        typeName: trialTypeNames[trialType],
                        block: b,                                                
                        answer: [NaN, NaN],
                        confidence: [NaN, NaN],
                        getCorrect: function(finalAnswer = true) {
                            let answer = finalAnswer? this.answer[1] : this.answer[0];
                            return answer === this.whichSide;
                        },
                        whichSide: isPractice? Math.round(Math.random()) : whichSideDeck[realId],
                        practice: isPractice,
                        feedback: isPractice,
                        warnings: [],
                        stimulusDrawTime: [],
                        stimulusOffTime: [],
                        fixationDrawTime: [],
                        
                        leftGrid: left,
                        rightGrid: right,
                        whereLarger: larger,
                        trialSelect: trialSelect
                    }));
                    
                    if (!isPractice)
                        realId++;
                }
            }
        }
        else
        {
            let id = (practiceBlockCount*this.practiceBlockStructure[0]["0"]);
            for (let b=0; b<blockCount+this.blk4Structure.length; b++) {
                advisorSet = 0;
                if (this.blk4Structure.length > 0 && b == 0)
                {
                    blockStructure = this.blk4Structure[0%this.blockStructure.length];
                }
                else
                {
                    blockStructure = this.blockStructure[0%this.blockStructure.length];
                }
                advisorChoices = this.advisorLists[advisorSet];
                advisor0id = advisorChoices[0].adviceType % 2? advisorChoices[1].id : advisorChoices[0].id;
                if(advisorChoices.length > 1)
                    advisor1id = advisorChoices[0].adviceType % 2? advisorChoices[0].id : advisorChoices[1].id;
                else
                    advisor1id = advisor0id;
                // Shuffle advisors so they appear an equal number of times
                advisorForceDeck = utils.shuffleShoe(advisorChoices,
                    blockStructure[trialTypes.force]/advisorChoices.length);
                advisorChangeDeck = utils.shuffleShoe(advisorChoices,
                    blockStructure[trialTypes.change]/advisorChoices.length);
                advisorForceBlk4Deck = utils.shuffleShoe(advisorChoices,
                    blockStructure[trialTypes.forceblk4]);
                let blockLength = utils.sumList(blockStructure);
                // Work out what type of trial to be
                let trialTypeDeck = [];
                for (let tt=0; tt<Object.keys(trialTypes).length; tt++) {
                    for (let i=0; i<blockStructure[tt]; i++)
                        trialTypeDeck.push(tt);
                }
                trialTypeDeck = utils.shuffle(trialTypeDeck);
                for (let i=1; i<=blockLength; i++) {
                    id++;
                    let isPractice = false;
                    let trialType = trialTypeDeck.pop();
                    let advisorId = 0;
                    let left;
                    let right;
                    let larger;
                    let algAns;
                    let algCor;
                    let algCon;
                    let trialSelect;
                    // Below we pull the advisor, dots and confidence used for this trial again.
                    // We merely do this for data recoridng purposes at the end of the experiment.
                    if (trialType == 1)
                    {
                        trialSelect = this.forcedTrials[forcedCount];
                        forcedCount++;
                        if (trialSelect !== undefined)
                        {
                            left = (forcedWhereDots.dots[trialSelect+(120*(this.dotDifference-1))])[0];
                            right = (forcedWhereDots.dots[trialSelect+(120*(this.dotDifference-1))])[1];
                            // Is the left or right larger?
                            if (utils.sumList(left,false,true) > utils.sumList(right,false,true))
                            {
                                larger = 0;
                            }
                            else
                            {
                                larger = 1;
                            }
                        }
                        else
                        {
                            larger = 0;
                        }
                        algAns = ((forcedData.advisors[(this.dotDifference)-1].AlgorithmAnswer[trialSelect])-1);
                        if (algAns == larger)
                        {
                            algCor = 1;
                        }
                        else
                        {
                            algCor = 0;
                        }
                        // algCon = ((forcedData.advisors[(this.dotDifference)-1].cj1[trialSelect-1])-1)
                    }
                    else if (trialType == 2)    
                    {
                        trialSelect = this.choiceTrials[choiceCount];
                        choiceCount++;
                        if (trialSelect !== undefined)
                        {
                            left = (choiceWhereDots.dots[trialSelect+(240*(this.dotDifference-1))])[0];
                            right = (choiceWhereDots.dots[trialSelect+(240*(this.dotDifference-1))])[1];
                            if (utils.sumList(left,false,true) > utils.sumList(right,false,true))
                            {
                                larger = 0;
                            }
                            else
                            {
                                larger = 1;
                            }
                        }
                        else
                        {
                            larger = 0;
                        }
                        algAns = ((choiceData.advisors[(this.dotDifference)-1].AlgorithmAnswer[trialSelect])-1);
                        if (algAns == larger)
                        {
                            algCor = 1;
                        }
                        else
                        {
                            algCor = 0;
                        }
                        // algCon = ((choiceData.advisors[(this.dotDifference)-1].cj1[trialSelect-1])-1)
                    }
                    else if (trialType == 5)    
                    {
                        trialSelect = this.blk4Trials[blk4Count];
                        blk4Count++;
                        left = (blk4WhereDots.dots[trialSelect+(60*(this.dotDifference-1))])[0];
                        right = (blk4WhereDots.dots[trialSelect+(60*(this.dotDifference-1))])[1];
                        if (utils.sumList(left,false,true) > utils.sumList(right,false,true))
                        {
                            larger = 0;
                        }
                        else
                        {
                            larger = 1;
                        }
                        algAns = ((blk4Data.advisors[(this.dotDifference)-1].AlgorithmAnswer[trialSelect])-1);
                        if (algAns == larger)
                        {
                            algCor = 1;
                        }
                        else
                        {
                            algCor = 0;
                        }
                        // algCon = ((blk4Data.advisors[(this.dotDifference)-1].cj1[trialSelect-1])-1)
                    }
                    else
                    {
                        left = null;
                        right = null;
                        larger = null;
                        algAns = null;
                        algCor = null;
                        algCon = null;
                        trialSelect = null;
                    }
                    if (isPractice)
                    {
                        advisorId = trialType===trialTypes.catch? 0 : this.practiceAdvisor.id;
                    }
                    else if (trialType===trialTypes.forceblk4)
                    {
                        advisorId = advisorForceBlk4Deck.pop().id;
                    }
                    else
                    {
                        advisorId = trialType === trialTypes.force? advisorForceDeck.pop().id : 0;
                    }
                    let defaultAdvisor = trialType === trialTypes.change? advisorChangeDeck.pop().id : null;
                    let changes = trialType === trialTypes.change? 0 : null;
                    let r = Math.random() < .5? 1 : 0;
                    let choice = trialType === trialTypes.choice? [advisorChoices[r].id, advisorChoices[1-r].id] : [];
                    // let choice = isPractice? [] : [advisorChoices[r].id, advisorChoices[1-r].id];
                    trials.push(new Trial(id, {
                        type: trialType,
                        typeName: trialTypeNames[trialType],
                        block: b+practiceBlockCount,
                        advisorSet,
                        defaultAdvisor,
                        advisorId,
                        advisor0id,
                        advisor1id,
                        choice,
                        changes,
                        answer: [NaN, NaN],
                        confidence: [NaN, NaN],
                        getCorrect: function(finalAnswer = true) {
                            let answer = finalAnswer? this.answer[1] : this.answer[0];
                            return answer === this.whichSide;
                        },
                        whichSide: larger,
                        practice: isPractice,
                        feedback: isPractice,
                        warnings: [],
                        stimulusDrawTime: [],
                        stimulusOffTime: [],
                        fixationDrawTime: [],
                        advisorAnswer: algAns,
                        advisorCorrect: algCor,
                        //advisorConfidence: algCon,
                        advisorConfidence: 0,
                        leftGrid: left,
                        rightGrid: right,
                        whereLarger: larger,
                        trialSelect: trialSelect
                    }));
                    if (!isPractice)
                        realId++;
                }
            }
        }
        return trials;
    }
}
export {MyBlocks, OrienTask, trialTypeNames}
