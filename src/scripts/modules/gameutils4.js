"use strict";
//special stuff for AB
//call to navigate from current room to target
//either you just walk move to target or some event happens; after the event continue to target or return to current 
window.gm.triggerExploreEvt=function(targetLocation){
    let s=window.story.state,currentLocation=window.gm.player.location;
    let cnt=s.vars.WM_Lv1.Explored[currentLocation]||0,lstEncounter=s.vars.WM_Lv1.rollEncounter;
    let _Enc,_Encs=[
        {id:"WM_Lv1_VineSnare",roll:"Strength",min:60},
        {id:"WM_Lv1_VineGrab",roll:"Agility",min:60},
        {id:"WM_Lv1_Barrel",roll:"Strength",min:60}
    ]
    let possLocation=[],loc,rnd2,rnd;
    if(targetLocation=='WM_Lv1_A1'){    
        possLocation = ['WM_Lv1_A2','WM_Lv1_A3','WM_Lv1_A4'].filter((x)=>{return(!s.vars.WM_Lv1.Explored[x]>0);})
    } else if(targetLocation=='WM_Lv1_B1'){    
        possLocation = ['WM_Lv1_B2','WM_Lv1_B3','WM_Lv1_B4'].filter((x)=>{return(!s.vars.WM_Lv1.Explored[x]>0);})
    }
    //pick encounter according location
    rnd2=_.random(0,_Encs.length-1);
    _Enc=_Encs[rnd2];

    switch(_Enc.roll){
        case "Strength":  rnd=s.vars.qStrength;
            break;
        case "Intelect":  rnd=s.vars.qWisdom;
            break;
        //case "Agility":
        default: rnd=s.vars.qAgility; 
            break;
    }
    //do a roll and check roll+stat
    rnd+=_.random(0,50);
    if(_Enc.min>rnd){   //encounter if roll+stat < d100
        window.story.state.tmp.args=[null,"Rolling failed due to "+_Enc.roll+" of "+ rnd + "."]
        s.vars.WM_Lv1.rollEncounter=_Enc;
        window.story.show(_Enc.id);
    }else{
        if(possLocation.length<=0){
            window.story.show("WM_Lv1_ExploredAll");
        } else if((rnd+cnt*10.0)>80){  //if rolled high enough move on //the more you have explored here the more likely to succeed
            rnd2=_.random(0,possLocation.length-1),loc=possLocation[rnd2];
            s.vars.WM_Lv1.Explored[loc]=1+(s.vars.WM_Lv1.Explored[loc]||0);
            s.vars.WM_Lv1.Explored[currentLocation]=1+(s.vars.WM_Lv1.Explored[currentLocation]||0);
            window.story.show(loc)
        } else { //bad luck -  return
            window.story.show("WM_Lv1_ExploreFail");
        }
    }   
}
window.gm.printUseItem=function(what){
    window.story.state.tmp.args=[null,1];
    window.story.show("WM_Lv1_Use_"+what)
}
window.gm.printRemoveItem=function(what){
    let Inv=window.story.state.vars.Inv;
    for(var i=Inv.length-1;i>=0;i--){
        if(Inv[i]==what) { Inv[i]='';break}
    }
}
window.gm.printPickup=function(){
    let s=window.story.state,item=s.vars.WM_Lv1.qLocItems[window.passage.name];
    let Text=""
    if(item=="HealthUp"){
        Text="There is a healthpotion stashed away.";
        if(s.vars.Inv.length>=4){
            Text+="Unfortunatly your inventory is already full."
        } else {
            Text+='Would you like to <a0 onclick=window.gm.pickupItem(\"'+item+'\",\"'+window.passage.name+'\")>pick it up?</a>'
        }
    }
    if(item=="Tshirt"){//,"","Shorts","Adrenalin
        Text="There is a Tshirt stashed away.";
        if(s.vars.Inv.length>=4){
            Text+="Unfortunatly your inventory is already full."
        } else {
            Text+='Would you like to <a0 onclick=window.gm.pickupItem(\"'+item+'\",\"'+window.passage.name+'\")>pick it up?</a>'
        }
    }
    return("<p>"+Text+"</p>");
}
window.gm.pickupItem=function(what,where){
    let s=window.story.state;
    s.vars.Inv.push(what);
    s.vars.WM_Lv1.qLocItems[where]="";
    window.story.show(window.passage.name )
}
//prints link to other passage
window.gm.printGoto=function(location,cost,alias){
    let msg='',res={OK:true,msg:''};
    msg=window.gm.printDo("window.story.show(\""+location+"\");",cost,alias);
    return(msg);
};
//prints link that executes doThat f.e. "window.story.show(\"NewGame\")";
window.gm.printDo=function(doThat,cost,alias){
    let k='',msg='',res={OK:true,msg:''};
    let _cost = cost||{}; //cost={time:30,energy:-10,will:-10,difficult:hard}  easy, average, hard
    _cost.time=(cost&&cost.time)?cost.time:0, _cost.energy=(cost&&cost.energy)?cost.energy:0, _cost.will=(cost&&cost.will)?cost.will:0; 
    _cost.difficult=(cost&&cost.difficult)?cost.difficult:'';
    k=((_cost.time>0)?' '+_cost.time+'min':'') + ((_cost.energy!==0)?' '+_cost.energy+'E':'') + 
      ((_cost.will!==0)?' '+_cost.will+'W':'') + (_cost.difficult?(' <b>'+_cost.difficult+'</b>'):'');
    if(k!=='')k=" ("+k+")";
    msg=window.gm.printLink((alias===''?location:alias)+k,
    "(function(){let v=window.story.state.vars;if(!(("+_cost.energy+"<0 && v.qBattery<"+(-1*_cost.energy)+")||("+_cost.will+"<0 && v.qSanity<"+(-1*_cost.will)+"))){"+
    "v.qBattery+="+_cost.energy+";v.qSanity+="+_cost.will+";window.gm.addTime("+_cost.time.toString()+");"+doThat+";"+
    "}else{alert(\"Cant do it!\")}}())",
    {class:(!((_cost.energy<0 && window.story.state.vars.qBattery<(-1*_cost.energy))||(_cost.will<0 && window.story.state.vars.qSanity<(-1*_cost.will))))?"":"done"}); //TODO replace alert with ??
    return(msg);
};
class Player { //fake class
    constructor() {
      this.location='';
      this.id=this.name="Player";
    }
  }
/* bundles some utility operations*/
window.gm.getSaveVersion= function(){   return([0,1,0]); };

// reimplement to setup the game
//_origInitGame = window.gm.initGame;
window.gm.initGame= function(forceReset,NGP=null) {
_origInitGame(forceReset,NGP);
    var s = window.story.state;
    window.gm.images = imagesBattlers(window.gm.images||{});
    window.gm.images = imagesMaps(window.gm.images);
    window.gm.images = imagesEquip(window.gm.images);
    window.gm.images = imagesIcons(window.gm.images);
    window.gm.images = imagesScenes(window.gm.images);
    s._gm.timeRL= s._gm.timeVR = s._gm.time;
    s._gm.dayRL= s._gm.dayVR = s._gm.day;
    //TODO set debug to 0 for distribution !
    s._gm.debug = 1,   
    s._gm.dbgShowCombatRoll= true,
    s._gm.dbgShowQuestInfo= true;
    s._gm.dbgShowMoreInfo=true;
    if(!s.chars.player || forceReset) {
        window.gm.player=new Player();
        s.chars[window.gm.player.id]=window.gm.player;
    }
    window.gm.initGameFlags(forceReset,NGP);
    window.gm.switchPlayer(window.gm.player.id);
}
//stuff for AB
window.gm.initGameFlags = function(forceReset,NGP=null) {
    let s= window.story.state;
    function dataPrototype(){return({visitedTiles:[],mapReveal:[],tmp:{},version:0});}
    if (forceReset) { 
        s.NGP=s.Settings=s.DngSY=null; 
        s.Lab=s.Known=null;
    }
    let Settings = {
        autoSave:true,
        showCombatPictures:true,
        showNSFWPictures:true,
        showDungeonMap:true
    };
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        activePlayer : '', //id of the character that the player controls currently
        qSanity:100,
        qSanityMax:100,
        qArousal:0,
        qArousalMax:40,
        qAgility:40,
        qAgilityMax:40,
        qStrength:40,
        qStrengthMax:40,
        qWisdom:40,
        qWisdomMax:40,
        qUpperWear:1,
        qLowerWear:1,
        qNextLocation:""
        };
        s.vars.Inv=[]; //Inventory
        s.vars.U={  //Unlockables
            ShowRooms:1,
            ShowRoll:1,
        }
        s.vars.WM_Lv1= {  };
    }
    let DngSY = {
        visitedTiles: [],mapReveal: [],
        dng:'', //current dungeon name
        prevLocation:'', nextLocation:'', //used for nav-logic
        dngMap:{} //dungeon map info
    };
    if(!window.gm.achievements){//||forceReset) { 
        window.gm.resetAchievements();
    }
    window.storage.loadAchivementsFromBrowser();

    //see comment in rebuildFromSave why this is done
    s.Settings=window.gm.util.mergePlainObject(Settings,s.Settings);
    s.NGP=window.gm.util.mergePlainObject(NGP,s.NGP);
    s.DngSY=window.gm.util.mergePlainObject(DngSY,s.DngSY);
    //todo cleanout obsolete data ( filtering those not defined in template) 
}
window.gm.printBodyDescription = function() {
    let msg="",v=window.story.state.vars;
    msg = "You have short brwon hair.</br>";
    if(v.qBabble===1){ msg+= "A datapad is in your possession."; }
    if(v.qBabble===2){msg+= "The babble companion is talking by an in-ear speaker to you.";}
    return msg+"</br>"
}
window.gm.resetAchievements = function() { //declare achievements here
    window.gm.achievements={
        looseEnd: 0 //
        ,swamToFar: 0
        ,starveBreakfast:0
        ,survive7days: 0
        ,insaneTFHuman: 0
      }
      window.gm.achievementsInfo={ //this is kept separate to not bloat savegame
          //hidden bitmask: 0= all visisble, 1= Name ???, 2= Todo ???
          looseEnd: {set:1, hidden:3, name:"loose end", descToDo:"Find a loose end.",descDone:"Found a link without target. Gained a NGPtoken."} //
          ,starveBreakfast: {set:1, hidden:3, name:"starved at breakfast", descToDo:"Have nothing to eat at breakfast and no will.",descDone:"You starved at breakfast because you had no food left and no will to go and find something."} //
          ,swamToFar: {set:1, hidden:2, name:"swam to far", descToDo:"swim to far into the sea",descDone:"You swam to far and drowned."} //
          ,survive7days: {set:1, hidden:1, name:"survive 7 days", descToDo:"Make it to day 8.",descDone:"You survived a week. But this is only the beginning."} //
          ,insaneTFHuman: {set:1, hidden:1, name:"insane human TF", descToDo:"Got insane by transforming to much.",descDone:"You stayed human but all the TF are stressing you to much."} //
      }
}
window.gm.setValve=function(evt,cbfail,cbsucess) {
    var bit=0;
    switch(evt.target.id) {
        case 'ValveA':
            bit= 0x1;
            break;
        case 'ValveB':
            bit= 0x2;
            break;
        case 'ValveC':
            bit= 0x4;
            break;
        case 'ValveD':
            bit= 0x8;
            break;
        case 'ValveE':
            bit= 0x10;
            break
        default:
            break;
    }
    flow=flow^bit;
    document.querySelector('#'+evt.target.id).textContent=evt.target.id+': '+((flow&bit)?'ON':'OFF');
    var val = ((flow>>0)&1)*30+((flow>>1)&1)*15+((flow>>2)&1)*45+((flow>>3)&1)*25+((flow>>4)&1)*20;
    document.querySelector('#flow').textContent=val+'%';
    if(val===100) {
        cbsucess();
    } else if(val>100) {
        cbfail();
    }
  };
  
  
  /*  combat-sm:  from AM_Lv2_H3 set ..args[1]=null and move to AM_Lv2_H3_Attack
    AM_Lv2_H3_Attack calls printMinePodCombatMenu
  
    window.story.state.tmp.args[0] = called by GenericPassage to render output + Next-Link
  *  ...args[1] = {} - store for your temporary data between combat-steps
    ...args[2] = passage-name to return on flee success 
    ...args[3] = foe variable name
    ...args[4] = CombatMenu-function
  */
  
  window.gm.printCombatSceneNext=function(msg) {
    window.story.state.tmp.args[0] = function() {window.gm.printOutput(msg,"section article div#choice");};
    window.story.show("GenericPassage");
  };
  
  window.gm.printMinePodCombatMenu=function(FoeId){
    let msg ='',s=window.story.state.vars.mine;
    window.story.state.tmp.args[1] = window.story.state.tmp.args[1]||{blast:0}; //buffers data between calls
    if(s[FoeId]<=0) {
        let tmp = window.story.state.tmp.args[2];//window.gm.player.location.slice(0,window.gm.player.location.lastIndexOf('_')); //AM_Lv2_G2_Attack -> AM_Lv2_G2
        msg= 'The hull of the pod is completely deflated. Should be no thread anymore.</br>';
        msg+= '<a href=\'javascript:void(0)\' onclick=\'window.story.show(\"'+tmp+'\")\'>Next</a></br>';
    } else { 
        if(s[FoeId]<50) {
            msg= 'The pod is still alive.</br>';
        } else {
            msg= 'The pod looks healthy.</br>';
        }
        if(s.qSprayerCharge>0) {
            msg+= '<hr><a href=\'javascript:void(0)\' onclick=\'window.gm.printMinePodCombat(\"'+FoeId+'\",\"Sprayer\")\'>use Sprayer</a></br>';
        } else {
            msg+= 'Your sprayer is empty.</br>';
        }
        if(s.qHasCrowbar>0) {
            msg+= '<hr><a href=\'javascript:void(0)\' onclick=\'window.gm.printMinePodCombat(\"'+FoeId+'\",\"Crowbar\")\'>use Crowbar</a></br>'//;window.gm.printLink('use Crowbar','window.gm.printMinePodCombat(\"'+FoeId+'\",\"Crowbar\")');
        }
        msg+= '<hr><a href=\'javascript:void(0)\' onclick=\'window.gm.printMinePodCombat(\"'+FoeId+'\",\"Stone\")\'>throw a Stone</a></br>'
        msg+= '<hr><a href=\'javascript:void(0)\' onclick=\'window.gm.printMinePodCombat(\"'+FoeId+'\",\"Flee\")\'>Run away</a></br>'
    }
    return(msg);
  }
  window.gm.printMinePodCombat=function(FoeId,Weapon){
    let msg='',s=window.story.state.vars.mine;
    let rnd = _.random(0,100);
    if(Weapon==='Flee') {
        msg+= 'You fled from the fight.</br>' 
        msg+= window.gm.printLink('Next','window.story.show(window.story.state.tmp.args[2])');
        window.gm.printCombatSceneNext(msg);
        return;
    }else if(Weapon==='Crowbar') { //
        msg = 'Your crowbar deals some damage to the pods hull.'
        s[FoeId]+=-45;
    } else if(Weapon==='Stone') {
        msg = 'Grabing a stone from the ground, you throw it full force against the pod.</br>'
        if(rnd<30) {
            msg += 'You hit the pod but only deal little damage.</br>'
            s[FoeId]+=-25;
        } else {
            msg += 'Your throw missed its target.</br>'
        }
    } else if(Weapon==='Sprayer') { s.qSprayerCharge-=1;
        window.story.state.tmp.args[1].blast+=1;
        msg = 'The color of the pod changes and it expands as well.'
        s[FoeId]+=-60;
    }
    if(s[FoeId]<=0) { 
        s[FoeId]=0;
        if(window.story.state.tmp.args[1].blast>1) {
            msg += '</br>The pod explodes in a fiery mess, scatering its remains around.</br>'+window.gm.printMinePodDamage();
        } else {
            msg += '</br>The pod shakes violently but its content just squirts out from a wound at its side. The once proud bulb quickly deflates in a pitiable sag.</br>';
        }
    } else {
        msg+='As the bulb releases some of its content into the air you try to gain some distance.</br>'
        if(rnd<30) {
            msg += 'But unfortunatly you got a good dose of it.</br>'+window.gm.printMinePodDamage();
        } else {
        }
    }
    //back to combat passage
    msg+= "</br>"+window.gm.printLink('Next','window.story.show(window.gm.player.location)');
    window.gm.printCombatSceneNext(msg);
  }
  window.gm.printMinePodDamage=function() { //pod blast or spray attack
    let msg='',s=window.story.state.vars;
    if(s.qCoverallHP>0) {
        s.qCoverallHP=Math.max(0,s.qCoverallHP-10);
        msg += 'You got hit too and whatever was inside the pod, is now eating away your cloths!</br><statdown>clothing damage</statdown></br>';
        if(s.qCoverallHP<=0) msg += 'All of your overgarment is now falling apart. You use some of the shreds to wipe off the fluids from your skin.</br>';
    } else {
        msg += 'You got hit too and and you feel the goo stinging your skin. You should find something to wash it off !</br><statdown>sanity damage</statdown></br>';
        s.qSanity=Math.max(0,s.qSanity-5);
    }
    return(msg);
  }
  window.gm.printMineTentacleCombatMenu=function(FoeId){
    let msg ='',s=window.story.state.vars;
    window.story.state.tmp.args[1] = window.story.state.tmp.args[1]||{bound:0, enraged:0}; //buffers data between calls
    if(s[FoeId]<=0) {
        let tmp = window.story.state.tmp.args[2];
        s[FoeId]=0;
        msg+='</br>Finally you dealt enough damage to break free from the grip of the tentacle. It quickly retreats in the safety of its encasing and you crawl away quickly to get a safe distance as well.'
        msg+='<a href=\'javascript:void(0)\' onclick=\'window.story.show(\"'+tmp+'\")\'>Next</a></br>';
    } else if(window.story.state.tmp.args[1].bound===4){ //BAD END
        msg+='</br></br>The vile creature finally proved to strong (or your tactic to bad). As it now entwines your lower body with multiple of its strong appendages and can easily move you insides its own homestead.';
        msg+='</br>TODO BAD END';
    } else { 
        if(s[FoeId]<50) {
            msg= 'The tentacle is twitching around.</br>';
        } else {
            msg= 'The tentacle has a strong grip on you.</br>';
        }
        if(s.qSprayerCharge>0) {
            msg+= '<hr><a href=\'javascript:void(0)\' onclick=\'window.gm.printMineTentacleCombat(\"'+FoeId+'\",\"Sprayer\")\'>use Sprayer</a></br>';
        } else {
            msg+= 'Your sprayer is empty.</br>';
        }
        if(s.qHasCrowbar>0) {
            msg+= '<hr><a href=\'javascript:void(0)\' onclick=\'window.gm.printMineTentacleCombat(\"'+FoeId+'\",\"Crowbar\")\'>use Crowbar</a></br>';
        } 
        msg+= '<hr><a href=\'javascript:void(0)\' onclick=\'window.gm.printMineTentacleCombat(\"'+FoeId+'\",\"Struggle\")\'>Struggle</a></br>';
    }
    return(msg);
  };
  window.gm.printMineTentacleCombat=function(FoeId,Weapon){
    let msg='',s=window.story.state.vars.mine,t=window.story.state.tmp.args[1];
    let rnd = _.random(0,100);
    if(Weapon==='Crowbar') { //
        msg = 'You hit the tentacle and it seemed to release its grip somewhat, even if just for a moment. Maybe with some more hits you can break free.'
        s[FoeId]+=-20;
    } else if(Weapon==='Sprayer') {
        s.qSprayerCharge-=1;
        if(t.enraged===0) {
            msg+= 'The tentacles starts sweeling and its color get more lifely, the grip on you tightens even more.'
            s[FoeId]+=-35;t.enraged+=1;
        } else {
            msg+= 'The sprayer doesnt seem to affect the creature any further. Maybe it needs a higher dose?'
        }
    } else if(Weapon==='Struggle') {
        t.bound = Math.max(0,t.bound-2);
        msg+= 'You trash around to get away from the slimy appendage. ' + (t.bound===0)?'The thing still has a hold on you. You need to deal soe damage to break free.':'';
    }
    if(t.enraged>=1) {
        t.bound+=1;
        if (t.bound>=3) {
            msg+= '</br>You have to struggle free or you will be entwined by the creature completely !'
        } else {
            msg+= '</br>The angry tentacle pulls you in closer !'
        }
    }
    if(t.bound>1) {}
    //back to combat passage
    msg+= "</br>"+window.gm.printLink('Next','window.story.show(window.gm.player.location)');
    window.gm.printCombatSceneNext(msg);
  };
  window.gm.printMineTentacleDamage=function() {
    let msg='',s=window.story.state.vars.mine;
    if(s.qCoverallHP>0) {
        s.qCoverallHP=Math.max(0,s.qCoverallHP-5);
        msg += 'TODO !</br><statdown>clothing damage</statdown></br>';
        if(s.qCoverallHP<=0) msg += 'All of your overgarment is now falling apart.</br>';
    } else {
        msg += '</br>You can feel the slimy appendage squishing around your limbs.</br><statdown>sanity damage</statdown></br>';
        s.qSanity=Math.max(0,s.qSanity-35);
    }
    return(msg);
  };