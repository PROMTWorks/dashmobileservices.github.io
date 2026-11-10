/* DASH booking pricing engine — customer sees one combined service charge. */
(function(){
'use strict';
if(window.__DASH_BOOKING_SUBMIT_LOADED)return;
window.__DASH_BOOKING_SUBMIT_LOADED=true;
const COSTS={employeeHourly:10,employerBurdenRate:.15,equipmentOverheadPerLaborHour:4,businessOverheadPerJob:3,targetProfitMargin:.25,travelBaseFee:10};
const LAWN={
'lawn-mowing':{name:'Lawn Mowing',minutes:60,materials:2},
'weed-removal':{name:'Weed Removal',minutes:60,materials:3},
'mulch-installation':{name:'Mulch Installation',minutes:60,materials:55},
'decorative-rock':{name:'Decorative Rock Installation',minutes:60,materials:65},
'yard-cleanup':{name:'Yard Cleanup',minutes:90,materials:5},
'trimming-edging':{name:'Trimming & Edging',minutes:45,materials:1},
'seasonal-yard-cleanup':{name:'Seasonal Yard Cleanup',minutes:180,materials:8},
'property-maintenance':{name:'Property Maintenance',minutes:60,materials:3}
};
const AUTO={oil:{minutes:45,parts:32},wipers:{minutes:20,parts:35},battery:{minutes:35,parts:160},jump:{minutes:20,parts:0},tire:{minutes:20,parts:0},'tire-replacement':{minutes:45,parts:125},air:{minutes:25,parts:35},cabin:{minutes:25,parts:35},headlight:{minutes:60,parts:150},'brake-light':{minutes:40,parts:80},fluid:{minutes:20,parts:15}};
function choices(){return Array.from(document.querySelectorAll('input[name="specialChoice"]:checked')).map(x=>x.value)}
function estimate(service){
 let item=LAWN[service]||AUTO[service]; if(!item)return null;
 let materials=item.materials===undefined?item.parts:item.materials, minutes=item.minutes;
 const c=choices();
 if(service==='wipers'){const n=c.includes('All wipers')?4:Math.max(c.length,1);materials=35*n;minutes=20*n}
 if(service==='tire-replacement'){const n=parseInt((c[0]||'1').match(/\d+/)?.[0]||'1',10);materials=125*n;minutes=45*n}
 if(service==='headlight'||service==='brake-light'){const n=(c[0]==='2 headlights'||c[0]==='2 lights')?2:1;materials=item.parts*n;minutes=item.minutes*n}
 if(service==='fluid')materials=15*Math.max(c.length,1);
 const hours=Math.max(minutes/60,.25);
 const internal=(COSTS.employeeHourly*(1+COSTS.employerBurdenRate)*hours)+materials+(COSTS.equipmentOverheadPerLaborHour*hours)+COSTS.businessOverheadPerJob+COSTS.travelBaseFee;
 const total=Math.max(internal+10,internal/(1-COSTS.targetProfitMargin));
 return {labor:total,parts:0,total:total,cost:internal,profit:total-internal,minutes:minutes};
}
window.DASH_PRICING={COSTS: COSTS,LAWN:LAWN,AUTO:AUTO,estimate:estimate};
})();

// Public booking submission. The secret key stays inside the Supabase Edge Function.
(function () {
  "use strict";
  if (window.__DASH_PUBLIC_REQUEST_SUBMITTER) return;
  window.__DASH_PUBLIC_REQUEST_SUBMITTER = true;

  const API_URL = "https://roywoofgypiyoobdcrwx.supabase.co/functions/v1/create-service-request";
  const PUBLIC_KEY = "sb_publishable_5SKEbO1wFS4LVZ6IcpWfnA_UQffaKX_";
  const $ = id => document.getElementById(id);
  const value = id => String($(id)?.value || "").trim();
  const excluded = new Set([
    "service","year","make","model","engine","trim","date","time","locationStreet",
    "locationCity","locationState","locationZip","addressRestrictions","restrictionDetails",
    "restrictionProof","notes","firstName","lastName","phone","email","contactPreference","consent"
  ]);

  function selectedServiceDetails() {
    const details = {};
    document.querySelectorAll("#booking .grid .field").forEach(field => {
      if (field.classList.contains("hidden") || field.offsetParent === null) return;
      const controls = [...field.querySelectorAll("input,select,textarea")].filter(el => !excluded.has(el.id) && el.type !== "file");
      if (!controls.length) return;
      const label = field.querySelector("label")?.textContent?.trim() || field.id || "Additional details";
      const values = controls.filter(el => !["checkbox","radio"].includes(el.type) || el.checked)
        .map(el => {
          if (el.tagName === "SELECT") return el.selectedOptions?.[0]?.text || el.value;
          return el.value;
        }).filter(Boolean);
      if (values.length) details[field.id || label] = { label, values };
    });
    const special = [...document.querySelectorAll('input[name="specialChoice"]:checked')].map(el => el.value);
    if (special.length) details.selected_options = special;
    return details;
  }

  window.DASH_COLLECT_SERVICE_DETAILS = selectedServiceDetails;

  function readProofFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The proof document could not be read. Please try selecting it again."));
      reader.onload = () => resolve({
        name: file.name,
        mime_type: file.type || "application/octet-stream",
        base64: String(reader.result || "").split(",")[1] || ""
      });
      reader.readAsDataURL(file);
    });
  }

  function validateForm() {
    const required = [
      ["date","Please choose a preferred service date."],
      ["time","Please choose a preferred arrival time."],
      ["locationStreet","Please enter the service street address."],
      ["locationCity","Please enter the service city."],
      ["locationState","Please enter MA as the service state."],
      ["locationZip","Please enter the Massachusetts ZIP code."],
      ["addressRestrictions","Please answer the service-location restrictions question."],
      ["firstName","Please enter your first name."],
      ["lastName","Please enter your last name."],
      ["phone","Please enter your phone number."],
      ["email","Please enter your email address."]
    ];
    for (const [id,message] of required) {
      if (!value(id)) { alert(message); $(id)?.focus(); return false; }
    }
    if (value("locationState").toUpperCase() !== "MA") {
      alert("DASH MOBILE SERVICES currently accepts service requests only in Massachusetts.");
      $("locationState")?.focus(); return false;
    }
    const zip=value("locationZip").slice(0,5);
    if (!/^\d{5}$/.test(zip) || !(zip.startsWith("01") || zip.startsWith("02") || zip==="05501")) {
      alert("Please enter a valid Massachusetts ZIP code.");
      $("locationZip")?.focus(); return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) {
      alert("Please enter a valid email address."); $("email")?.focus(); return false;
    }
    if (!/^[+\d() .-]{7,40}$/.test(value("phone"))) {
      alert("Please enter a valid phone number."); $("phone")?.focus(); return false;
    }
    const service=value("service");
    const automotive=["oil","wipers","battery","jump","tire","tire-replacement","air","cabin","headlight","brake-light","fluid"].includes(service);
    if (automotive) {
      for (const id of ["year","make","model","engine","trim"]) {
        if (!value(id)) { alert("Please complete all vehicle information before submitting."); $(id)?.focus(); return false; }
      }
    }
    if (service==="house-cleaning" && !value("hcSize")) { alert("Please select the home size."); $("hcSize")?.focus(); return false; }
    if (service==="garage-cleaning" && !value("garageSize")) { alert("Please select the garage size."); $("garageSize")?.focus(); return false; }
    if (service==="trash-junk-removal") {
      if (!value("junkLoad")) { alert("Please select the estimated junk load size."); $("junkLoad")?.focus(); return false; }
      if (!$("junkConditionAgreement")?.checked) { alert("Please acknowledge the Trash & Junk Removal requirement."); return false; }
    }
    if (["outdoor-furniture","patio-cleaning","porch-cleaning"].includes(service)) {
      if (!value("pcSizeSelect")) { alert("Please select the service size."); $("pcSizeSelect")?.focus(); return false; }
      if (!$("pcWaterAgree")?.checked) { alert("Please confirm access to water when required."); return false; }
    }
    if (["yes","unsure"].includes(value("addressRestrictions").toLowerCase())) {
      if (!value("restrictionDetails")) { alert("Please explain the address restriction or uncertainty."); $("restrictionDetails")?.focus(); return false; }
      if (!$("restrictionProof")?.files?.[0]) { alert("Please upload the required proof/authorization document."); $("restrictionProof")?.focus(); return false; }
    }
    if (!$("consent")?.checked) { alert("Please confirm the contact authorization before submitting."); $("consent")?.focus(); return false; }
    const total=Number(String($("totalPrice")?.textContent||"").replace(/[^\d.]/g,""));
    if (!Number.isFinite(total) || total <= 0) {
      alert("Please calculate your estimate before submitting the service request.");
      return false;
    }
    return true;
  }

  window.submitServiceRequest = async function () {
    if (window.__DASH_REQUEST_SUBMITTING) return;
    if (!validateForm()) return;
    const button=document.querySelector('#contact button[onclick="submitRequest()"]');
    const original=button?.textContent || "Submit Service Request";
    window.__DASH_REQUEST_SUBMITTING=true;
    if (button) { button.disabled=true; button.textContent="Submitting..."; }

    try {
      const service=$("service");
      const selected=service?.selectedOptions?.[0];
      const address={
        street_address:value("locationStreet"),
        city:value("locationCity"),
        state:value("locationState").toUpperCase(),
        postal_code:value("locationZip").slice(0,5)
      };
      const request={
        client_request_number:crypto.randomUUID(),
        service_key:value("service"),
        service_name:selected?.textContent?.trim() || value("service"),
        ...address,
        restriction_answer:value("addressRestrictions").toLowerCase(),
        restriction_details:value("restrictionDetails"),
        preferred_date:value("date"),
        preferred_time:value("time"),
        first_name:value("firstName"),
        last_name:value("lastName"),
        phone:value("phone"),
        email:value("email"),
        contact_preference:value("contactPreference") || "phone",
        customer_notes:value("notes"),
        vehicle_year:value("year"),
        vehicle_make:value("make"),
        vehicle_model:value("model"),
        vehicle_engine:value("engine"),
        vehicle_trim:value("trim"),
        service_details:selectedServiceDetails(),
        estimated_total:Number(String($("totalPrice")?.textContent||"").replace(/[^\d.]/g,"")) || null
      };

      const payload={request};
      const proofFile=$("restrictionProof")?.files?.[0];
      if (proofFile) {
        if (proofFile.size > 5*1024*1024) throw new Error("The proof document must be 5 MB or smaller.");
        payload.proof_file=await readProofFile(proofFile);
      }

      const response=await fetch(API_URL,{
        method:"POST",
        headers:{"Content-Type":"application/json","apikey":PUBLIC_KEY},
        body:JSON.stringify(payload)
      });
      const result=await response.json().catch(()=>({}));
      if (!response.ok || !result.ok) throw new Error(result.error || result.message || "Your request could not be submitted. Please try again.");
      const contact=$("contact");
      if (contact) {
        contact.innerHTML='<div class="note notice"><strong>Request received.</strong><p>Your service request has been submitted to DASH MOBILE SERVICES.</p><p><strong>Request number:</strong> '+String(result.request_number||"Pending").replace(/[&<>"]/g,"")+'</p><p>This is not an appointment confirmation. DASH will review your request and contact you about the next steps. If proof is required, your request will remain pending until it is reviewed.</p><p>Questions? Email supportdashservices@gmail.com or call (857) 220-7228.</p></div>';
        contact.scrollIntoView({behavior:"smooth",block:"start"});
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Your request could not be submitted. Please try again.");
      if (button) { button.disabled=false; button.textContent=original; }
    } finally {
      window.__DASH_REQUEST_SUBMITTING=false;
    }
  };
})();
