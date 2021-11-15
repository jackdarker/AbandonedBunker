"use strict;"

//stationary turrets shoots at close targets
class dmTurret extends DngMob {
    constructor() {
        super();
        this.data.oldmode='idle',
        this.data.health=1,
        this.data.enabled=true,
        this.data.mark='T';
    }

    get enabled() {return(this.data.enabled);}
    sensorSee() { return([{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}]) };
    sensorHear() { return([]) };
    decide(){  //doesnt move
    }

    do() {
    }
    onCollideMob(mob) {
        this.dungeon.pushFct(
            (function(other){
                this.dungeon.renderEvent = function(me,other){return function(id){ other.data.health-=1;
                    return(me.data.name+" fires at "+other.data.name+".</br>"+ (other.data.health<=0?"And killed it.":"Its still alive.")+
                    window.gm.printLink("Whatever","window.gm.dng.resumeRoom()"))}}(this,other);
                this.dungeon.renderNext(1);
            }).bind(this,mob));
        return(true);
    }
}

// someone standing around, if he sees player he follows him but returns to home if loss of sight
class dmGuard extends DngMob {
    constructor() {
        super();
        this.data.oldmode=this.data.mode,
        this.data.waitBeforeHome=3,
        this.data.moveTimer=0, //
        //settings:
        this.data.moveSpeed=1.5,   
        this.data.enabled=true,
        this.data.health=2;
        this.data.mark='G';
    }

    get enabled() {return(this.data.enabled);}
    sensorSee() { return([{x:2,y:0},{x:0,y:2},{x:-2,y:0},{x:0,y:-2},{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}]) };
    sensorHear() { return([{x:-1,y:1},{x:1,y:1},{x:-1,y:-1},{x:1,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}]) };
    navigate(from,to) {
        if(from===null || to===null) return;
        let graph = new window.Graph(this.dungeon.actualRoom.floor.allRooms());
        let start = new window.GraphNode(from,1), end = new window.GraphNode(to,1),
        path = window.astar.search(graph,start,end);
        this.data.path=path.map((el)=>{return(el.origNode.name);})
    }
    decide(){
        let floor = this.dungeon.actualRoom.floor;
        let grid = floor.allRooms();
        let graph = new window.Graph(grid);
        let end=null,path=null;
        let room=floor.getRoom(this.dungeon.actualRoom.name),//player
        start = floor.getRoom(this.data.actualTile);
        //check line of sight
        const checkView=this.sensorSee();
        for(var i=checkView.length-1;i>=0;i--) {
            if(room.x===start.x+checkView[i].x && room.y===start.y+checkView[i].y){
                //ignore if room is not connected in straight line
                path = window.astar.search(graph,new window.GraphNode(start,1),
                    new window.GraphNode(room,1),{closest:false});
                if(path.length===Math.abs(checkView[i].x)+Math.abs(checkView[i].y)) {
                    end=room;  //found player
                    this.data.mode='hunt';
                    break;
                }
            }
        }
        if(end===null) {//check noise
            const checkHear=this.sensorHear();
            for(var i=checkHear.length-1;i>=0;i--) {
                if(room.x===start.x+checkHear[i].x && room.y===start.y+checkHear[i].y){
                    end=room;  //found player
                    this.data.mode='hunt';
                    break;
                }
            }
        }
        //check smell
        //decide
        if(end===null) { //lost player
            if(this.data.mode==='hunt') {
                this.data.waitBeforeHome=3; this.data.mode='wait';
            } else if(this.data.mode==='wait') {
                this.data.waitBeforeHome-=1;
                if(this.data.waitBeforeHome<=0) {
                    this.data.mode==='return';
                    end = floor.getRoom(this.data.homeTile);
                }
            } else if(this.data.mode==='return') {
                if(this.data.actualTile===this.data.homeTile) {
                    this.data.mode==='idle';
                }
            }
        }
        this.navigate(start,end);
    }
    //return true if scene plays 
    //to return back to dungeon add to scene window.gm.printLink('Next','window.gm.dng.resumeRoom()')
    do() {
        this.data.moveTimer-=1;
        if(this.data.moveTimer>0) return; //speedcheck
        this.data.moveTimer += this.data.moveSpeed; // 1 = -0.5 +1.5; next round 1,5= 0 + 1,5

        let res=false, nextTile=this.data.path.shift();
        if(nextTile!==undefined && nextTile!=='' && nextTile!==this.data.actualTile) {
            this.data.actualTile=nextTile; //move to
        }
        if(this.data.oldmode!==this.data.mode ){
            this.data.oldmode=this.data.mode;
            this.dungeon.pushFct(
                (function(){
                    this.dungeon.renderEvent = function(me){return function(id){ return(
                        me.data.name+" huffs angryly.</br> He is now "+me.data.mode +".</br>"+ window.gm.printLink("Whatever","window.gm.dng.resumeRoom()"));}}(this);
                    this.dungeon.renderNext(1);
                }).bind(this));
        } else if (this.dungeon.actualRoom.name===this.data.actualTile) {
            res=this.onCollidePlayer();            
        } else {
            res=this.checkCollisionMob();
        }
        return(false);
    }
    checkCollisionMob() {
        //check if there is a mob
        for(var i=this.floor.Mobs.length-1;this.data.health>0 && i>=0;i--) {
            let mob=this.floor.Mobs[i];
            if(mob.data.actualTile!==this.data.actualTile) continue
            mob.onCollideMob(this);
        }
        return(false);
    }
    onCollidePlayer() {
        this.dungeon.pushFct(
        (function(){
            this.dungeon.renderEvent = function(me){return function(id){ return(me.data.name+" found you.</br>"+ window.gm.printLink("Whatever","window.gm.dng.resumeRoom()"));}}(this);
            this.dungeon.renderNext(1);
        }).bind(this));
        return(false);
    }
    onCollideMob(mob){
        return(false);
    }
}
// walks along a path 
// set data.targets to at least 2 room names
class dmPatrol extends dmGuard {
    constructor() {
        super();
        this.data.lastTile='';
        this.data.jump=false;
        this.data.targets=[];  // [{to:'A1'},{to:'C4',jump:true}]
        //settings
        this.data.waitAtHome=1;
        this.data.moveSpeed=1.5;
        this.data.mark='P';
    }
    //todo only sees in forward direction?
    decide(){
        let floor = this.dungeon.actualRoom.floor;
        let grid = floor.allRooms();
        let graph = new window.Graph(grid);
        let end=null,path=null;
        let start = floor.getRoom(this.data.actualTile);

        if(this.data.mode==='patrol' && this.data.homeTile===this.data.actualTile) {
            //after arrival at hometile -> wait
            this.data.mode='wait';
        } else if(this.data.mode==='wait' && this.data.homeTile===this.data.actualTile) {
            // after wait at hometile -> idle
            if(this.data.waitAtHome<=0) this.data.mode='idle';
            else this.data.waitAtHome-=1;
        } else if(this.data.mode==='idle') {
            // after idle at hometile -> patrol to next (set new home)
            let target =this.data.targets.shift();
            this.data.homeTile=target.to,this.data.jump=target.jump||false;
            this.data.targets.push(this.data.homeTile);
            this.data.mode='patrol';this.data.waitAtHome=1;
        } else if(this.data.mode==='patrol'){
            if(this.data.jump) { //teleport
                this.data.path=[this.data.homeTile];
            } else {
                end=floor.getRoom(this.data.homeTile);
            }
        }
        this.navigate(start,end);
    }
}
// hunts the player until out of sight, doesnt return to homebase, moves around randomly for some time, then hides
class dmHunter extends dmGuard {
    constructor() {
        super();
        this.data.lastTile='';
        this.data.seekTimer=0;
        //settings
        this.data.waitAtHome=6;
        this.data.mark='H';
        this.data.moveTimer=this.data.moveSpeed=2;
    }
    
    decide(){
        let floor = this.dungeon.actualRoom.floor;
        let grid = floor.allRooms();
        let graph = new window.Graph(grid);
        let end=null,path=null;
        let room=floor.getRoom(this.dungeon.actualRoom.name),//player
        start = floor.getRoom(this.data.actualTile);

        if(this.data.mode!=='hide'&& this.data.mode!=='seek') {
            this.data.seekTimer=this.data.waitAtHome,this.data.mode='seek'; //
        }
        //check line of sight
        const checkView=this.sensorSee();
        for(var i=checkView.length-1;i>=0;i--) {
            if(room.x===start.x+checkView[i].x && room.y===start.y+checkView[i].y){
                //ignore if room is not connected in straight line
                path = window.astar.search(graph,new window.GraphNode(start,1),
                    new window.GraphNode(room,1),{closest:false});
                if(path.length===Math.abs(checkView[i].x)+Math.abs(checkView[i].y)) {
                    end=room;  //found player
                    this.data.mode='hunt';
                    break;
                }
            }
        }
        if(end===null && this.data.mode==='hunt'){ 
            if(this.data.path.length>0) {
                //lost target -> move to targets last position (finish path)
                end = floor.getRoom(this.data.path[0]);
            } else {
                this.data.mode==='seek';this.data.seekTimer=this.data.waitAtHome;
            }
        }
        if(this.data.mode==='seek') { //lost target and no further path -> random search for some time
            this.data.seekTimer-=1;
            if(this.data.seekTimer>0) {           
                if(this.data.path.length<=0) { //get random goal
                    end=floor.allRooms()[_.random(0,floor.allRooms().length-1)];
                    this.navigate(start,end);
                } 
                end = floor.getRoom(this.data.path[0]);                
            } else {
                // stop seek and hide
                this.data.mode='hide';
            }
        } 
        this.navigate(start,end);
    }
}
// flees in any direction but where hunter is
//dmPrey

window.gm.dngmobs = (function (mobs) {
    mobs.MinoGuard = function () { return(new dmGuard());};  
    mobs.Turret = function () { return(new dmTurret());};
    mobs.Patrol = function () { return(new dmPatrol());};
    mobs.Hunter = function () { return(new dmHunter());};
    return mobs; 
}(window.gm.dngmobs || {}));