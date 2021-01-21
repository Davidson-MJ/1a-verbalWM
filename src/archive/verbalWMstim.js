/** 
* verbal working memory task stimulus, 
show a string of letters for participant to memorise.
*/





// maintainMemoryTaskStim(len)
// {
// 	let alphabet = "bcdfghjklmnpqrstvwxz"; // no vowels
// 	let nextString = "";
//     let number;
//         while (nextString.length < len)
//         {
//             number = utils.genRandInt(0,19);
//             if (nextString.includes(alphabet[number]) == false)
//             {
//                 nextString = nextString + alphabet[number];
//             }
//         }

//         // now we have string length (len), without duplicates.

//         this.maintainMemoryString = nextString;

//         let div = document.querySelector('.jspsych-content').appendChild(document.createElement('div'));
//         div.id = 'maintainMemoryStimContainer';
//         div.innerHTML = "<h2>Please take a moment to memorise the letters below:</h2><br/><br/>"+"<h1>"+nextString+"</h1>";

//         let form = div.appendChild(document.createElement('form'));
//         form.id = name + 'Form';
//         form.className = 'name';

//         let ok = div.appendChild(document.createElement('button'));
//         ok.innerText = 'next';
//         ok.className = 'question jspsych-btn';

//         ok.onclick = function (e) {
//             e.preventDefault();
//             jsPsych.finishTrial();
//         };
// }

// maintainMemoryTaskRecall(audio="") // ask raj about this?
// {
//     	let owner = this;
//     	let alphabet = "bcdfghjklmnpqrstvwxz";
//     	let startString = this.maintainMemoryString;
//     	let shownString = startString;
//     	let change;
//     if (Math.random() < .5) // on 50% of trials, no change?
//     	{
//             change = 0;
//     	}
//     else
//     	{
//         	change = 1;
//             let flag = 0;
//             let charToChange = utils.genRandInt(0,4);
//             let number = utils.genRandInt(0,19);
//             if (shownString.includes(alphabet[number]) == true)
//             	{
//                 flag = 1;
//             	}
//             while (flag == 1)
//             	{
//                 number = utils.genRandInt(0,19);
//                 if (shownString.includes(alphabet[number]) == false)
//                 	{
//                     flag = 0;
//                 	}
//             	}
//             shownString = shownString.split(shownString[charToChange])[0] + alphabet[number] + shownString.split(shownString[charToChange])[1];
//         }

//         let div = document.querySelector('.jspsych-content').appendChild(document.createElement('div'));
//         div.id = 'maintainMemoryRecallContainer';
//         div.innerHTML = "<h2>Are the below letters the same as you were shown before?</h2><br/><br/>"+"<h1>"+shownString+"</h1>";

//         let form = div.appendChild(document.createElement('form'));
//         form.id = name + 'Form';
//         form.className = 'name';

//         let radios = div.appendChild(document.createElement('div'));
//         radios.className = 'radios';
//         radios.id = 'options';
//         radios.style = 'margin-top: 10px';

//         let labelYes = radios.appendChild(document.createElement('label'));
//         labelYes.id = "label-yes";
//         labelYes.style = "display:block; margin:5px";
//         labelYes.innerHTML = "Yes";

//         let radioYes = labelYes.appendChild(document.createElement('input'));
//         radioYes.type = 'radio';
//         radioYes.name = "maintainMemYN";
//         radioYes.value = 0;
//         radioYes.style = "justify-self: center";

//         let labelNo = radios.appendChild(document.createElement('label'));
//         labelNo.id = "label-no";
//         labelNo.style = "display:block; margin:5px";
//         labelNo.innerHTML = "No";

//         let radioNo = labelNo.appendChild(document.createElement('input'));
//         radioNo.type = 'radio';
//         radioNo.name = "maintainMemYN";
//         radioNo.value = 1;
//         radioNo.style = "justify-self: center";

//         let ok = div.appendChild(document.createElement('button'));
//         ok.innerText = 'submit';
//         ok.className = 'question jspsych-btn';

//         let checkResponse; //defined below
//         let saveResponse; //defined below
//         let answer; //defined below

//         checkResponse = function(form) {
//            // let div = form.querySelector('.radios');
//             let ok = false;
//             let rads = div.querySelectorAll('input[type="radio"]');
//             rads.forEach((r)=>{if(r.checked) ok = true});
//             return ok;
//         };

//         saveResponse = function(form) {
//             div.querySelectorAll('input[type="radio"]').forEach(
//                 (r)=>{ if(r.checked) answer = r.value}
//             );
//             gov.maintainMems.push(startString,shownString,answer);
//         };       

//         ok.onclick = function (e) {
//                 e.preventDefault();
//                 if(!checkResponse(this.form))
//                     return false;
//                 saveResponse(this.form);
//                 if (audio.length > 0 && parseInt(answer) !== change)
//                 {
//                     var tone = new Audio(audio);
//                     tone.play();
//                 }
//                 owner.maintainMemFormSubmit(startString,shownString,answer);
//                 if (document.querySelector('#maintainMemoryRecallContainer') !== null)
//                 {
//                     document.querySelector('#maintainMemoryRecallContainer').innerHTML = "";
//                 }
                
//         };

//         gov.maintainMems = [];

//     }

// maintainMemFormSubmit(starting,shown,answer) 
// { 
// 	this.maintainMem = [
// 		{
//     	starting: starting,
//     	shown: shown,
//     	answer: answer
//      	}
//     ];
//         jsPsych.finishTrial(this.maintainMem); 
// }