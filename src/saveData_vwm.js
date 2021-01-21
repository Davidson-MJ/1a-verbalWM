/**
 * verbal WM task matched with degree orientation discrimination
 MD Nov 2020.
 *
 */

"use strict";

// import {Trial, Advisor, Cue, DoubleDotGrid} from "./exploringSocialMetacognition.js";

export default function processData(data) {
    // Data about the participant
    let participantData = {
        id: data.participantId,
        groupId: typeof data.groupId === 'undefined'? null : data.groupId,
        blockCount: data.blockCount,
        // blockLength: data.blockLength,
        // catchPerBlock: data.blockStructure[0],
        // forcePerBlock: data.blockStructure[1],
        // choicePerBlock: data.blockStructure[2],
        // practiceBlockLength: data.practiceBlockLength,
        // practiceCatchPerBlock: data.practiceBlockStructure[0],
        // practiceForcePerBlock: data.practiceBlockStructure[1],
        // practiceChoicePerBlock: data.practiceBlockStructure[2],
        difficultyStep: data.difficultyStep,
        // dotCount: data.dotCount,
        preTrialInterval: data.preTrialInterval,
        preStimulusInterval: data.preStimulusInterval,
        stimulusDuration: data.stimulusDuration,
        // feedbackDuration: data.feedbackDuration,
        changeDuration: data.changeTime,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        experimentDuration: data.timeEnd - data.timeStart
    };

    // // Advisor data
    // let advisorData = [];
    // if(typeof data.advisors !== 'undefined')
    //     for (let a=0; a<data.advisors.length; a++)
    //         advisorData.push(flattenAdvisorData(data.advisors[a], participantData.id));
    // if(typeof data.practiceAdvisors !== 'undefined')
    //     for(let a = 0; a < data.practiceAdvisors.length; a++)
    //         advisorData.push(flattenAdvisorData(data.practiceAdvisors[a], participantData.id));
    // participantData.advisors = advisorData;

    // Questionnaires
    let questionnaireData = [];
    if(typeof data.questionnaires !== 'undefined')
        for (let q=0; q<data.questionnaires.length; q++)
            if(data.questionnaires[q])
            {
                questionnaireData.push(flattenQuestionnaireData(data.questionnaires[q], participantData.id))
            }
    participantData.questionnaires = questionnaireData;

    // Trials
    let trialData = [];
    for (let t=0; t<data.trials.length; t++)
        trialData.push(flattenTrialData(data.trials[t], participantData.id));
    participantData.trials = trialData;

    // Generalized trust questionnaire
    if(typeof data.generalisedTrustQuestionnaire !== 'undefined')
    {
        if(data.generalisedTrustQuestionnaire)
        {
            participantData.generalisedTrustQuestionnaire =
            flattenGTQ(data.generalisedTrustQuestionnaire, participantData.id);
        }
    }
            

    // Debrief stuff
    participantData.debrief = [];
    if(typeof data.debrief !== 'undefined') {
        if(data.debrief)
        {
            participantData.debrief = flattenDebriefData(data.debrief, participantData.id);
        }
    }

    participantData.debriefRepQuiz = [];
    if(typeof data.dotRepQuiz !== 'undefined') {
        participantData.debriefRepQuiz = flattenDRQ(data.dotRepQuiz, participantData.id);
    }

    return participantData;
}

/** Return a trial squeezed into a format suitable for saving as .csv
 * @param {Trial} trial - trial object to squeeze
 * @param {int} id - id of the participant (inserted as first column)
 * @returns {Object} - slim representation of trial object
 */
function flattenTrialData(trial, id) {
    let out = {};
    //basic indexing
    out.participantId = id;
    out.id = trial.id;
    out.type = trial.type;
    out.typeName = trial.typeName;
    out.block = trial.block;    
    out.realID= trial.realID;
    
    //trial specifics
    out.WM_string = trial.WMstring;
    out.WM_probe = trial.WMprobe;
    out.WM_answer = trial.WM_answer;
    out.WM_correct = trial.WM_correct;
    out.WM_rt = trial.WM_rt;
    out.WM_difficulty = trial.WM_rt;

    out.degDiff = trial.degDiff;
    out.Orien_Degs = trial.OrienDegs;
    out.Orien_rt = trial.Orien_rt;
    out.Orien_answer = trial.Orien_answer; //  location [0 1]
    out.Orien_correct = trial.Orien_correct; // boolean
    out.Orien_confidence = trial.confidence
    out.Orien_confidence_rt = trial.confidence_rt

    
    out.warnings = trial.warnings.join("\n");
    // timings
    if (trial.pluginResponse.length > 0) {
        // initial decision
        out.timeInitialStart = trial.pluginResponse[0].startTime;
        out.timeInitialFixation = trial.fixationDrawTime[0];
        out.timeInitialStimOn = trial.stimulusDrawTime[0];
        out.timeInitialStimOff = trial.pluginResponse[0].startTime + trial.pluginResponse[0].stimulusOffTime;
        out.timeInitialResponse = trial.pluginResponse[0].startTime + trial.pluginResponse[0].rt;
        if (trial.pluginResponse.length === 3) {
            // advice and final decision
            // advice
            out.durationAdvisorChoice = trial.pluginResponse[1].choiceTime;
            out.durationAdviceDuration = trial.pluginResponse[1].adviceTime;
            // final decision
            out.timeFinalStart = trial.pluginResponse[2].startTime;
            out.timeFinalFixation = trial.fixationDrawTime[0];
            out.timeFinalStimOn = trial.stimulusDrawTime[0];
            out.timeFinalStimOff = trial.pluginResponse[2].startTime + trial.pluginResponse[2].stimulusOffTime;
            out.timeFinalResponse = trial.pluginResponse[2].startTime + trial.pluginResponse[2].rt;
        }
    }

    return out;
}

/**
 * Extract the key variables from the advisor object
 * @param {Advisor} data - advisor object
 * @param {int} id - id of the participant (inserted as first column)
 * @returns {Object} - slim representation of advisor object
 */
// function flattenAdvisorData(data, id) {
//     let out = {};
//     out.participantId = id;
//     out.id = data.id;
//     out.adviceType = data.adviceType;
//     out.name = data.name;
//     out.portraitSrc = data.portraitSrc;
//     out.voiceId = data.voice.id;
//     out.styleClass = data.styleClass;
//     out.advisorClass = data instanceof Cue? "Cue" : "Advisor";
//     out.groupId = data.groupId;
//     return out;
// }

/**
 * Extract the key variables from the questionnaire object
 * @param {Object[]} Q - questionnaire
 * @param {int} id - id of the participant (inserted as first column)
 * @returns {Object} - slim representation of questionnare object
 */
function flattenQuestionnaireData(Q, id) {
    let out = {};
    out.participantId = id;
    out.advisorId = Q.advisorId;
    out.afterTrial = Q.afterTrial;
    out.timeStart = Q.startTime;
    out.timeResponseStart = Q.responseStartTime;
    out.timeEnd = Q.time_elapsed;
    out.duration = Q.rt;
    for(let r=0; r < Q.response.length; r++) {
        switch(Q.response[r].name) {
            case 'Likeability':
                out.likeability = parseInt(Q.response[r].answer);
                break;
            case 'Benevolence':
                out.benevolence = parseInt(Q.response[r].answer);
                break;
            case 'Ability':
                out.ability = parseInt(Q.response[r].answer);
                break;
        }
    }
    return out;
}

/**
 * Extract the key variables from the trust questionnaire object
 * @param {Object[]} Q - trust questionnaire
 * @param {int} id - id of the participant (inserted as first column)
 * @returns {Object} - slim representation of trust questionnare object
 */
function flattenGTQ(Q, id) {
    let out = [];
    for(let r=0; r < Q.response.length; r++) {
        out[r] = {
            participantId: id,
            timeStart: Q.startTime,
            timeResponseStart: Q.responseStartTime,
            timeEnd: Q.time_elapsed,
            duration: Q.rt
        };
        out[r].order = Q.response[r].id;
        out[r].answer = Q.response[r].answer;
        out[r].prompt = Q.response[r].prompt;
        out[r].lastChangedTime = Q.response[r].lastChangedTime;
    }
    return out;
}

/**
 * Loop through the keys in all objects in data and pad each object to contain all keys (pad with null)
 * @param {Object[]} data debrief questions
 * @param {int} id participant id
 * @return {Object[]}
 */
function flattenDebriefData(data, id) {
    // List keys
    let keys = [];
    data.forEach(function(q) {
        Object.keys(q).forEach(function(key) {
            if(q.hasOwnProperty(key) && keys.indexOf(key) === -1)
                keys.push(key);
        });
    });

    // Pad missing keys with null
    data.forEach(function(q) {
        q.participantId = id;
        q.id = data.indexOf(q);
        keys.forEach((k)=>{if(typeof q[k] === 'undefined') q[k] = null})
    });

    return data;
}

function flattenDRQ(data, id) {
    let out = [];
    data.forEach((x)=> {
        x.participantId = id;
        x.grid = sha1.sha1(JSON.stringify(x.grid));
        out.push(x);
    });
    return out;
}