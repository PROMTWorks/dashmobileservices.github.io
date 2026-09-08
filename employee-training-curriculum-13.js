/* DASH MOBILE SERVICES — Final 13-module training alignment */
(function(){
'use strict';
var tries=0;
function ready(){
  return Array.isArray(window.core) || (typeof core!=='undefined' && Array.isArray(core));
}
function apply(){
  if(!ready() || typeof window.render!=='function' || typeof window.openModule!=='function') return false;
  try{
    var modules=core;
    /* Remove legacy separate Moving, Trash & Junk Removal, and Garage Cleaning modules. */
    modules.splice(12,3);
    /* House Cleaning is the single residential-cleaning training module. */
    var house={
      title:'House Cleaning',
      material:'House Cleaning covers booked rooms and areas, customer property and privacy, professional conduct, access information, accidental damage, confidentiality, and handling difficult customer situations.',
      qs:[
        ['You are performing a House Cleaning service. Which rooms and areas should you clean?',['Only the rooms and areas listed in the customer\'s active confirmed booking','Every room in the home','Any room the customer asks for after you arrive','Any room that appears to need cleaning'],0],
        ['A customer asks you to clean additional rooms that were not booked. What should you do?',['Clean them as a courtesy because the customer asked','Explain that the additional rooms were not included and must be booked separately for a different day','Add them to today\'s service without changing the booking','Clean them first and ask management afterward'],1],
        ['A customer becomes upset after you explain that additional rooms were not booked and tells you to leave. What is the best response?',['Argue that you are only following policy','Stay calm, respect the request to leave, explain the policy without arguing, and contact management so management can determine how to make the situation right','Clean the extra rooms anyway so the customer is satisfied','Promise a refund or free service yourself'],1],
        ['You find a customer\'s personal property that you have wanted for a long time. Nobody is around and you believe nobody would know if you took it. What should you do?',['Take it because nobody is watching','Leave it where it is and continue the assigned service','Take a photograph and ask a friend what they think','Take it temporarily and return it later'],1],
        ['You accidentally damage part of a customer\'s wall while cleaning, but the damage is difficult to notice. What should you do?',['Hide it because the customer probably will not notice','Report the damage honestly and notify management rather than hiding or repairing it on your own','Wait to see if the customer notices','Try to make the damage less noticeable before continuing'],1],
        ['A friend asks about the size of customer homes, customer belongings, and whether particular customers are wealthy. What should you do?',['Share details as long as you do not give exact addresses','Explain that customer information and what you see in homes is confidential and should not be shared for personal conversation','Share information about older customers only','Share general descriptions of valuable items'],1],
        ['You forget a private customer access code needed to enter an area of the home. What should you do?',['Guess until a code works','Ask an authorized coworker if they remember it, or contact management; do not search private belongings or unnecessarily record/share the code','Search the customer\'s home for the code','Send the code through a personal group chat'],1]
      ]
    };
    modules.push(house);
    var masterQs=[
      ['A customer concern arises during a service. What is the best first response?',['Listen, understand the concern, and follow the company process','Argue with the customer','Ignore it','Promise whatever the customer wants'],0],
      ['You may be late to a scheduled service. What should you do?',['Say nothing unless the customer calls','Follow the required notification process as soon as reasonably possible','Wait until the end of the day','Ask a coworker to cover it without telling management'],1],
      ['You find confidential customer information that you do not need for your assigned work. What should you do?',['Copy it for reference','Protect it, do not share it, and notify the appropriate company contact when necessary','Tell your friends','Post it without the customer name'],1],
      ['A coworker has a personal conflict with another employee. What should happen?',['Bring the conflict into the customer job','Handle the issue professionally and keep personal drama from disrupting work','Ask customers to take sides','Post about it online'],1],
      ['You notice an unsafe condition at a job site. What should you do?',['Continue because the job is important','Stop the task when safe and notify management','Hide the condition','Ask the customer to do the unsafe part'],1],
      ['A company vehicle warning light appears during the pre-trip inspection. What should you do?',['Drive because the truck seems fine','Use the OBD2 scanner to read the exact code, look it up using the vehicle information, and report the findings to management before driving','Ignore it','Reset the light without checking it'],1],
      ['You are asked to operate equipment you have not been trained to use. What should you do?',['Use it carefully anyway','Do not use it until you receive appropriate training or management direction','Let the customer operate it','Ask a friend for instructions'],1],
      ['When towing a fully loaded trailer with a 60 MPH posted speed limit, what is the DASH rule approved in training?',['Drive 10 MPH over the limit','Drive at the posted limit','Drive 10 MPH under the posted limit','Match surrounding traffic even if over the limit'],2],
      ['During an Oil Change, what should be done if the new Oil Filter is damaged?',['Install it if the damage is small','Use it only if the customer will not notice','Do not install it; notify management and follow direction','Repair it with tape'],2],
      ['During an Oil Filter leak check, you discover an active leak. What is the first response?',['Keep the engine running while tightening it','Announce the active leak and turn off the vehicle engine before inspecting the filter/gasket','Ignore it if the leak is small','Drive the vehicle to another location'],1],
      ['During a Jump Start, where should the final negative cable connection go on the customer vehicle?',['Directly on the battery positive terminal','On an unpainted metal surface on the engine block or frame, away from the battery','On any painted body panel','On the customer vehicle ignition'],1],
      ['During a Tire Replacement, how should the employee confirm the new wheel is secure before lowering the vehicle?',['Shake the wheel at the 3 and 9 positions to check for easy movement','Kick the tire','Drive away immediately','Remove one lug nut'],0],
      ['A new Cabin Air Filter has a tear in the filter material. What should you do?',['Install it because the tear is small','Do not install it; notify management and wait for direction while continuing other work that is safe and correct','Hide the tear','Tape the filter'],1],
      ['When replacing a dead battery, which cable is disconnected first?',['Positive/red','Negative/black','Both at the same time','Whichever is easiest'],1],
      ['Can all vehicle tires simply be inflated to 100 PSI?',['Yes','Only if the customer requests it','No; use the correct pressure specified for that vehicle and tire setup','Only on company vehicles'],2],
      ['During lawn preparation, the Weed Eater string is getting low and several jobs are scheduled. What should you do?',['Ignore it until the string runs out','Put a new roll of string in the truck so you are prepared, and get coworker assistance if you have never replaced it','Throw away the Weed Eater','Use unrelated material as replacement string'],1],
      ['Two employees have lawn mowing, trimming, and mulch installation to complete and only one lawn mower. What is the best approach?',['Both employees wait for the mower','Have the coworker complete mowing while you trim, then start mulch installation when you finish trimming','Start mulch installation and ignore mowing','Take turns every few minutes without finishing any task'],1],
      ['Grass is unusually tall and thick. What is the approved approach?',['Use the Weed Eater to knock down the grass in long rows while the coworker follows with the mower to cut it to the correct height','Mow it all at the lowest setting immediately','Ignore the height difference','Use the mower on unsafe ground without preparation'],0],
      ['A coworker is jabbing the Weed Eater into the ground. What should you do?',['Ignore it','Explain the concern, show a safer trimming method, and notify management if the equipment may already be damaged','Take the equipment away without explanation','Post a video of the coworker'],1],
      ['After finishing a lawn service and being behind schedule, what should happen before leaving?',['Leave immediately','Check that all tools and equipment are accounted for, properly placed, and secured','Leave equipment at the property for the next visit','Only check the mower'],1],
      ['For a House Cleaning service, which rooms should be cleaned?',['Only the rooms and areas in the active confirmed booking','Every room','Only the largest rooms','Whatever rooms are easiest'],0],
      ['A customer becomes upset because additional rooms were not booked and tells the crew to leave. What should the employee do?',['Argue until the customer agrees','Stay calm, respect the request to leave, and contact management to determine the appropriate resolution','Clean the additional rooms anyway','Promise a refund without authorization'],1],
      ['You accidentally damage a wall during House Cleaning and think the customer will never notice. What should you do?',['Hide it','Report it honestly and notify management','Wait until someone asks','Repair it secretly'],1],
      ['A friend asks what valuables you have seen in customer homes. What should you do?',['Share only general descriptions','Explain that customer information and observations are confidential and cannot be shared for personal reasons','Tell the friend about past customers only','Show photographs without names'],1],
      ['You forget a customer access code. What should you do?',['Guess the code','Use the authorized communication process or management and do not search private belongings or share the code unnecessarily','Look through drawers for it','Ask a friend to help'],1]
    ];
    if(typeof master!=='undefined' && master){master.title='Master Test';master.material='25-question Master Test covering all 13 required DASH training modules. Questions are intentionally mixed rather than grouped by module. Employees must score 80% or higher to pass.';master.qs=masterQs;}
    window.DASH_REQUIRED_MODULE_COUNT=13;
    window.DASH_MODULE_PASS_PERCENT=80;
    window.DASH_MASTER_PASS_PERCENT=80;
    window.__DASH_CURRICULUM_13_APPLIED=true;
    var oldRender=window.render;
    window.render=function(){
      if(typeof oldRender==='function') oldRender();
      var p=document.getElementById('passed'),n=document.getElementById('current'),s=document.getElementById('status');
      if(p) p.textContent=core.filter(function(m){return window.passedName&&window.passedName(m.title);}).length+' / 13';
      var sign=(window.__DASH_SIGNOFFS||[]);var pre=sign.some(function(x){return x.signoff_stage==='PRE_MASTER'&&String(x.status||'').toUpperCase()==='SIGNED';});var fin=sign.some(function(x){return x.signoff_stage==='FINAL'&&String(x.status||'').toUpperCase()==='SIGNED';});
      if(n) n.textContent=core.filter(function(m){return !(window.passedName&&window.passedName(m.title));}).length?core.findIndex(function(m){return !(window.passedName&&window.passedName(m.title));})+1:(pre?'Master Test':'Owner Approval');
      if(s) s.textContent=fin?'TRAINING COMPLETE':pre?'MASTER TEST READY':core.every(function(m){var r=window.trainingRecord&&window.trainingRecord(m.title);return r&&['passed','completed'].includes(String(r.status||'').toLowerCase());})?'AWAITING OWNER APPROVAL':'IN TRAINING';
      var notice=document.querySelector('.notice');if(notice)notice.innerHTML='<b>Training path:</b> Employee Policy Orientation → 13 required modules → one Owner approval after all 13 module tests are 80% or higher → 25-question Master Test → final Owner approval. Employees see only pass/fail and their total score; answer keys remain hidden.';
      var head=document.querySelector('.head .muted');if(head)head.textContent='13 modules + 25-question Master Test';
    };
    var oldOpen=window.openModule;
    window.openModule=function(i){
      if(i===13){var sign=(window.__DASH_SIGNOFFS||[]);var pre=sign.some(function(x){return x.signoff_stage==='PRE_MASTER'&&String(x.status||'').toUpperCase()==='SIGNED';});if(!pre){alert('Owner Approval Required. All 13 module tests must be 80% or higher before the Master Test can be unlocked.');return;}}
      return oldOpen(i);
    };
    return true;
  }catch(e){console.warn('DASH curriculum alignment:',e);return false;}
}
function loadSignoffs(){
  if(!window.c||!window.employee||!window.c.from)return Promise.resolve();
  return window.c.from('employee_profiles').select('id').eq('auth_user_id',window.employee.auth_user_id||'').maybeSingle().then(function(r){
    if(r.error||!r.data)return;
    return window.c.from('employee_training_signoffs').select('signoff_stage,status,signed_at').eq('employee_id',r.data.id).then(function(x){window.__DASH_SIGNOFFS=x.data||[];});
  });
}
var timer=setInterval(function(){if(apply()){clearInterval(timer);if(window.c&&window.employee)loadSignoffs().then(function(){if(window.render)window.render();});}},100);
})();
