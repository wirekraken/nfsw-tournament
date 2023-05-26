(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function r(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=r(n);fetch(n.href,a)}})();const m={apiURI:location.href+"api"},e={settings:{block:document.querySelector(".settings"),pullSettingsBtn:document.querySelector("#pull-settings-btn"),welcome:{textarea:document.querySelector(".settings__welcome textarea"),pushBtn:document.querySelector("#push-welcome-btn")},regist:{playerNickname:document.querySelector(".settings__regist_players_form input[name=nickname]"),playerTime:document.querySelector(".settings__regist_players_form input[name=time]"),addPlayerBtn:document.querySelector(".settings__regist_players_form input[type=submit]"),listBlock:document.querySelector(".settings__regist_players_list"),pushBtn:document.querySelector("#push-regist-btn")},tracks:{block:document.querySelector(".settings__tracks_block"),textarea:document.querySelector(".settings__tracks_block textarea"),pushBtn:document.querySelector("#push-tracks-btn")},pointsSystem:{inputsBlock:document.querySelector(".settings__points-system_inputs"),saveBtn:document.querySelector("#save-points-system-btn")}},tournament:{block:document.querySelector(".tournament"),counts:{selectorForm:document.querySelector(".tournament__count_selector_form"),selectElems:document.querySelectorAll(".tournament__count_selector_form select"),inputElems:document.querySelectorAll(".tournament__count_selector_form_racer input[type=number]"),saveBtn:document.querySelector("#save-leaderboard-btn")},leaderboard:{trackInfo:document.querySelector(".tournament__leaderboard_track-info"),playersList:document.querySelector(".tournament__leaderboard_list"),pushBtn:document.querySelector("#push-leaderboard-bth")}},startTournamentBtn:document.querySelector("#start-tournament-btn"),finishTournamentBtn:document.querySelector("#finish-tournament-btn")},i=(t,s)=>{const o=`
        padding: 10px;
        font-size: 16px;
        background: ${t?"rgba(50,255,50,.8)":"rgba(255,50,50,.8)"};
        position: fixed;
        border-radius: 3px;
        right: 10px;
        top: 10px;
    `,n=document.createElement("div");n.innerHTML=`<span style="${o}">${s}</span>`,document.body.appendChild(n),setTimeout(()=>document.body.removeChild(n),t?1e3:3e3)},T=async(t,s)=>{await fetch(m.apiURI+"/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:t,value:s})}).then(r=>{r.ok&&r.status===200?(i(!0,"Saved!"),console.log(r.status)):i(!1,"Error save!")}).catch(r=>{console.log(r)})},b=t=>{const s={},r=Object.entries(t).sort((o,n)=>n[1]-o[1]);for(let o=0;o<r.length;o++)s[r[o][0]]=r[o][1];return s};let d={},u=[];e.settings.regist.addPlayerBtn.onclick=t=>{if(t.preventDefault(),!!e.settings.regist.playerNickname.value){localStorage.RegisteredPlayersTime&&(d=JSON.parse(localStorage.RegisteredPlayersTime)),d[e.settings.regist.playerNickname.value]=e.settings.regist.playerTime.value,d=P(d),localStorage.RegisteredPlayersTime=JSON.stringify(d),e.settings.regist.listBlock.innerHTML="";for(const[s,r]of Object.entries(d))e.settings.regist.listBlock.innerHTML+=`
            <div class="registered_players">
                <span class="registered_players-nickname">${s}</span>
                <span class="registered_players-time">${r}</span>
                <input type="button" value="-" class="removePlayerBtn">
            </div>`;for(const s of document.querySelectorAll(".removePlayerBtn"))s.onclick=function(){h(this)};e.settings.regist.playerNickname.value="",u=Object.keys(d),u.length>=2&&(e.settings.regist.pushBtn.disabled=!1,localStorage.Tracks&&localStorage.Tracks.split(",").length>=2&&(e.startTournamentBtn.disabled=!1))}};function h(t){const s=t.parentElement.querySelector(".registered_players-nickname").innerText;t.parentElement.remove();const r=JSON.parse(localStorage.RegisteredPlayersTime);delete r[s],u=Object.keys(r),localStorage.RegisteredPlayersTime=JSON.stringify(r),delete d[s],u.length<2&&(e.settings.regist.pushBtn.disabled=!0,e.startTournamentBtn.disabled=!0)}e.settings.regist.pushBtn.onclick=()=>{u.length<2||fetch(m.apiURI+"/regist",{method:"POST",headers:{"Content-Type":"application/json"},body:localStorage.RegisteredPlayersTime}).then(t=>{console.log(t.status),t.ok&&t.status===200?i(!0,"Registration pushed!"):i(!1,"Error push!")}).catch(t=>{console.log(t)})};function P(t){const s={},r=Object.entries(t).sort((o,n)=>o[1].toString().localeCompare(n[1]));for(let o=0;o<r.length;o++)s[r[o][0]]=r[o][1];return s}if(localStorage.RegisteredPlayersTime){u=Object.keys(JSON.parse(localStorage.RegisteredPlayersTime)),e.settings.regist.listBlock.innerHTML="";for(const[t,s]of Object.entries(JSON.parse(localStorage.RegisteredPlayersTime)))e.settings.regist.listBlock.innerHTML+=`
            <div class="registered_players">
                <span class="registered_players-nickname">${t}</span>
                <span class="registered_players-time">${s}</span>
                <input type="button" value="-" class="removePlayerBtn">
            </div>`;for(const t of document.querySelectorAll(".removePlayerBtn"))t.onclick=function(){h(this)}}localStorage.lastLeaderboardPushed?localStorage.lastLeaderboardPushed==="true"?(e.tournament.leaderboard.pushBtn.disabled=!0,e.tournament.counts.saveBtn.disabled=!1):(e.tournament.leaderboard.pushBtn.disabled=!1,e.tournament.counts.saveBtn.disabled=!0):e.tournament.leaderboard.pushBtn.disabled=!0;e.tournament.leaderboard.pushBtn.onclick=()=>{const t=b(JSON.parse(localStorage.RegisteredPlayersPoints)),s=JSON.parse(localStorage.EventPlayersPosition);if(localStorage.EventPlayersPoint){const n=JSON.parse(localStorage.EventPlayersPoint);for(const[a,l]of Object.entries(t))t[a]={summaryPoints:l,eventPoints:"+"+n[a],eventPosition:s[a]}}else for(const[n,a]of Object.entries(t))t[n]={summaryPoints:a,eventPoints:"+"+a,eventPosition:s[n]};const r=JSON.parse(localStorage.Tracks),o=+localStorage.TrackNumber;fetch(m.apiURI+"/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({trackNumber:o,trackName:r[o-1],players:t})}).then(n=>{console.log(n.status),n.ok&&n.status===200?(i(!0,"Event pushed!"),e.tournament.leaderboard.pushBtn.disabled=!0,localStorage.lastLeaderboardPushed=!0,o>=r.length?e.tournament.counts.saveBtn.disabled=!0:e.tournament.counts.saveBtn.disabled=!1):(i(!1,"Error push!"),e.tournament.leaderboard.pushBtn.disabled=!1,e.tournament.counts.saveBtn.disabled=!0)}).catch(n=>{console.log(n)})};function p(t){if(e.tournament.leaderboard.playersList.innerHTML="",e.tournament.leaderboard.trackInfo.innerHTML="",!t)return;let s="";localStorage.TrackNumber?+localStorage.TrackNumber===JSON.parse(localStorage.Tracks).length&&(s='<span style="color:rgba(255,50,50,.8)">Last</span>',e.tournament.counts.saveBtn.disabled=!0):localStorage.TrackNumber=0;const r=JSON.parse(localStorage.Tracks),o=+localStorage.TrackNumber;e.tournament.leaderboard.trackInfo.innerHTML=`Track #${o} ${s}<br>${r[o-1]}`;const n=b(t);let a=1;for(const[l,c]of Object.entries(n))e.tournament.leaderboard.playersList.innerHTML+=`
            <div class="tournament__leaderboard_list_player">
                <span class="tournament__leaderboard_list_player-position">${a++}</span>
                <span class="tournament__leaderboard_list_player-nickname">${l}</span>
                <span class="tournament__leaderboard_list_player-points">${c}</span>
            </div>
            `}let g={1:12,2:9,3:7,4:5,5:3,6:2,7:1,8:0};localStorage.PointsSystem?(g=JSON.parse(localStorage.PointsSystem),S(g)):(S(g),localStorage.PointsSystem=JSON.stringify(g));function S(t){e.settings.pointsSystem.inputsBlock.innerHTML="";for(const[s,r]of Object.entries(t)){e.settings.pointsSystem.inputsBlock.innerHTML+=`
            <div>
                <span>${s}:</span>
                <input type="text" name=${s} value=${r} class="pointsSystemInput">
            </div>
            `;for(const o of document.querySelectorAll(".pointsSystemInput"))o.oninput=function(){g[this.name]=+this.value}}}e.settings.pointsSystem.saveBtn.onclick=()=>{localStorage.PointsSystem=JSON.stringify(g),T("PointsSystem",g),e.settings.pointsSystem.inputsBlock.parentElement.style.background="rgba(0,0,0,.155)",setTimeout(()=>{e.settings.pointsSystem.inputsBlock.parentElement.style.background="rgba(0,0,0,.1)"},200)};let f=[];function k(t){localStorage.TournamentActive=!0,f=t;const s={},r={};for(const o of f)s[o]=0;p(s);for(const o of e.tournament.counts.selectElems){const n=o.parentNode.querySelector("input[type=number]");let a="<option>...</option>";for(const c of f)a+=`<option>${c}</option>`;o.innerHTML=a;let l=JSON.parse(localStorage.PointsSystem)[o.getAttribute("st")];n.value=l,n.oninput=function(){l=+this.value,s[o.value]=l},o.onchange=function(){for(const c of e.tournament.counts.selectElems)for(const y of c.children)y.innerText===this.value&&(y.style.display="none");s[this.value]=l,r[this.value]=this.getAttribute("st")}}e.tournament.counts.saveBtn.onclick=function(o){o.preventDefault(),localStorage.EventPlayersPosition=JSON.stringify(r),this.disabled=!0,e.tournament.leaderboard.pushBtn.disabled=!1,localStorage.lastLeaderboardPushed="0",localStorage.TrackNumber?localStorage.TrackNumber=+localStorage.TrackNumber+1:localStorage.TrackNumber="";for(const a of e.tournament.counts.selectElems){const l=a.parentNode.querySelector("input[type=number]");l.value=g[a.getAttribute("st")];let c="<option>...</option>";for(const y of f)c+=`<option>${y}</option>`;a.innerHTML=c}const n={};if(localStorage.RegisteredPlayersPoints){const a=JSON.parse(localStorage.RegisteredPlayersPoints);for(const[l,c]of Object.entries(a))n[l]=c+s[l];localStorage.RegisteredPlayersPoints=JSON.stringify(n),localStorage.EventPlayersPoint=JSON.stringify(s),p(n);for(const l of Object.keys(s))s[l]=0}else localStorage.RegisteredPlayersPoints=JSON.stringify(s),p(s);localStorage.TrackNumber&&+localStorage.TrackNumber>=JSON.parse(localStorage.Tracks).length&&(this.disabled=!0)}}const v=t=>{if(t.RegisteredPlayersTime){e.settings.regist.listBlock.innerHTML="";for(const[s,r]of Object.entries(t.RegisteredPlayersTime))e.settings.regist.listBlock.innerHTML+=`
                <div class="registered_players">
                    <span class="registered_players-nickname">${s}</span>
                    <span class="registered_players-time">${r}</span>
                    <input type="button" value="-" class="removePlayerBtn">
                </div>`;for(const s of document.querySelectorAll(".removePlayerBtn"))s.onclick=function(){h(this)};Object.keys(t.RegisteredPlayersTime).length<2?(e.settings.regist.pushBtn.disabled=!0,e.startTournamentBtn.disabled=!0):(e.settings.regist.pushBtn.disabled=!1,localStorage.Tracks&&t.Tracks.length>2&&(e.startTournamentBtn.disabled=!1))}else e.settings.regist.pushBtn.disabled=!0,e.startTournamentBtn.disabled=!0;if(t.Tracks){e.settings.tracks.textarea.value="";for(const s of t.Tracks)e.settings.tracks.textarea.value+=s+`
`}t.PointsSystem&&S(t.PointsSystem)},B=`:trophy: **Стартует новый турнир!**
Ниже будет табло турнирных трасс и табло игроков допущенных к турниру.
:warning: Следите за их состоянием: они будут обновляться до начала турнира!
:trophy: **A new tournament is starting!**
The board of the tournament tracks and the board of the players admitted to the tournament will be shown below.
:warning: Keep an eye on their status: they will be updated before the start of the tournament! `;e.settings.welcome.textarea.value=B;e.settings.welcome.textarea.oninput=function(){e.settings.welcome.pushBtn.disabled=this.value.length<10};e.settings.welcome.pushBtn.onclick=()=>{e.settings.welcome.textarea.value&&fetch(m.apiURI+"/welcome",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e.settings.welcome.textarea.value})}).then(t=>{console.log(t.status),t.ok&&t.status===200?i(!0,"Welcome pushed!"):i(!1,"Error push!")}).catch(t=>{console.log(t)})};e.settings.tracks.textarea.value=`Kempton Docks
Ironhorse & Coast
Valley & State
South Fortuna Circuit
Seaside Interchange`;if(localStorage.Tracks){const t=JSON.parse(localStorage.Tracks);e.settings.tracks.textarea.value="";for(const s of t)e.settings.tracks.textarea.value+=s+`
`}else{const t=e.settings.tracks.textarea.value.split(`
`);localStorage.Tracks=JSON.stringify(t)}e.settings.tracks.pushBtn.onclick=async()=>{const t=e.settings.tracks.textarea.value.split(`
`).filter(s=>s!=="");localStorage.Tracks=JSON.stringify(t),await fetch(m.apiURI+"/tracks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then(s=>{console.log(s.status),s.ok&&s.status===200?i(!0,"Tracks pushed!"):i(!1,"Error push!")}).catch(s=>{console.log(s)}),t.length>=2&&u.length>=2?e.startTournamentBtn.disabled=!1:e.startTournamentBtn.disabled=!0,e.settings.tracks.block.style.background="rgba(0,0,0,.155)",setTimeout(()=>{e.settings.tracks.block.style.background="rgba(0,0,0,.1)"},200)};const _=async()=>{const t=await fetch(m.apiURI+"/settings"),s=await t.json();if(t.ok&&t.status===200)return s;throw new Error(`Error, status: ${t.status}`)};e.settings.pullSettingsBtn.onclick=()=>{_().then(t=>{console.log(t);for(const[s,r]of Object.entries(t))localStorage[s]=JSON.stringify(r);v(t),i(!0,"Up to dated!")}).catch(t=>{i(!1,"Error pull!"),console.log(t)})};e.startTournamentBtn.onclick=async()=>{if(u.length<2)return;confirm("Registration will be terminated. Continue?")&&await fetch(m.apiURI+"/start").then(s=>{s.ok&&s.status===200?(k(u),e.tournament.block.style.display="block",e.settings.block.style.display="none",i(!0,"Push Start!"),console.log(s.status)):i(!1,"Error push!")}).catch(s=>{console.log(s)})};e.finishTournamentBtn.onclick=()=>{if(confirm("Finish the tournament?")){let s={};localStorage.RegisteredPlayersPoints&&(s=b(JSON.parse(localStorage.RegisteredPlayersPoints))),fetch(m.apiURI+"/finish",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}).then(r=>{if(r.ok&&r.status===200){localStorage.clear(),p(!1),e.settings.regist.listBlock.innerHTML="",e.settings.tracks.textarea.value="",e.tournament.counts.saveBtn.disabled=!1,e.settings.regist.pushBtn.disabled=!0,e.startTournamentBtn.disabled=!0;for(const o of e.tournament.counts.selectElems)o.innerHTML="";e.settings.block.style.display="flex",e.tournament.block.style.display="none",i(!0,"Finish pushed!"),console.log(r.status,"finished")}else i(!1,"Error push!")}).catch(r=>{console.log(r)})}};localStorage.RegisteredPlayersTime?Object.keys(JSON.parse(localStorage.RegisteredPlayersTime)).length<2?(e.settings.regist.pushBtn.disabled=!0,e.startTournamentBtn.disabled=!0):(e.settings.regist.pushBtn.disabled=!1,localStorage.Tracks&&JSON.parse(localStorage.Tracks).length>2&&(e.startTournamentBtn.disabled=!1)):(e.settings.regist.pushBtn.disabled=!0,e.startTournamentBtn.disabled=!0);localStorage.TournamentActive&&(e.settings.block.style.display="none",e.tournament.block.style.display="block",k(u),localStorage.RegisteredPlayersPoints&&p(JSON.parse(localStorage.RegisteredPlayersPoints)));
