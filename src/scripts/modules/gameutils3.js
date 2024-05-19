"use strict";

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
    "(function(){if(!(("+_cost.energy+"<0 && window.gm.player.energy().value<"+(-1*_cost.energy)+")||("+_cost.will+"<0 && window.gm.player.Stats.get(\"will\").value<"+(-1*_cost.will)+"))){"+
    "window.gm.player.Stats.increment(\"energy\","+_cost.energy+");window.gm.player.Stats.increment(\"will\","+_cost.will+");window.gm.addTime("+_cost.time.toString()+");"+doThat+";"+
    "}else{alert(\"Cant do it!\")}}())",
    {class:(!((_cost.energy<0 && window.gm.player.energy().value<(-1*_cost.energy))||(_cost.will<0 && window.gm.player.Stats.get("will").value<(-1*_cost.will))))?"":"done"}); //TODO replace alert with ??
    return(msg);
};


window.gm.qID = window.gm.qID || {};
window.gm.questDef = window.gm.questDef || {};
{
    let quest = new Quest("qGarden","Green thumb","");
    quest.addMileStone(new QuestMilestone(1,"","Find the garden.",QuestMilestone.NOP,QuestMilestone.HIDDEN));
    quest.addMileStone(new QuestMilestone(100,"","The garden is a mess and you dont have a use for it. So why bother?.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(200,"","Get some tools to clear the garden from the rubble..",QuestMilestone.NOP));
    window.gm.qID.qGarden=quest.id;window.gm.questDef[quest.id]= quest;

    quest = new Quest("qBarJob","Serve'em drinks","");
    quest.addMileStone(new QuestMilestone(1,"","Find the Inn.",QuestMilestone.NOP,QuestMilestone.HIDDEN));
    quest.addMileStone(new QuestMilestone(100,"","Maybe the owner of the Inn has a job for you?.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(200,"","Earn money by working as a waitress.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(300,"","Work at least 6 shifts between Monday and sunday.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(10000,"","???",QuestMilestone.NOP));
    window.gm.qID[quest.id]=quest.id;window.gm.questDef[quest.id]= quest;

    quest = new Quest("qTraderThomas","A Trader to trade","");
    quest.addMileStone(new QuestMilestone(1,"","Find the Traders house.",QuestMilestone.NOP,QuestMilestone.HIDDEN));
    quest.addMileStone(new QuestMilestone(100,"","Ask around for the traders absence.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(200,"","Find the lookout point.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(300,"","Report back to the innkeeper.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(500,"","Find the traders carriage on the road to Redwick.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(900,"","Return with Thomas to his store.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(1000,"","NYI",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(10000,"","???",QuestMilestone.NOP));
    window.gm.qID.qTraderThomas=quest.id;window.gm.questDef[quest.id]= quest;

}