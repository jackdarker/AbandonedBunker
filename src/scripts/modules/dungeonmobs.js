"use strict;"

//stationary turrets shoots at close targets
class dmTurret extends DngMob {
    constructor() {
        super();
        this.data.oldmode='idle',
        this.data.waitBeforeHome=3,
        this.data.health=1,
        this.data.enabled=true
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
        this.data.enabled=true,
        this.data.health=1
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
        let res=false, nextTile=this.data.path.shift();
        if(nextTile!==undefined && nextTile!=='' && nextTile!==this.data.actualTile) {
            this.data.actualTile=nextTile; //move to
        }
        if(this.data.oldmode!==this.data.mode ){
            this.data.oldmode=this.data.mode;
            this.dungeon.pushFct(
                (function(){
                    this.dungeon.renderEvent = function(me){return function(id){ return(me.data.name+" huffs angryly.</br>"+ window.gm.printLink("Whatever","window.gm.dng.resumeRoom()"));}}(this);
                    this.dungeon.renderNext(1);
                }).bind(this));
            //return(true);
        } else if (this.dungeon.actualRoom.name===this.data.actualTile) {
            res=this.onCollidePlayer();            
        } else {
            res=this.checkCollisionMob();
        }
        return(false);//res);
    }
    checkCollisionMob() {
        //check if there is a mob
        for(var i=this.dungeon.Mobs.length-1;this.data.health>0 && i>=0;i--) {
            let mob=this.dungeon.Mobs[i];
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
        this.data.targets=[];
        this.data.waitAtHome=1;
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
            this.data.homeTile=this.data.targets.shift();
            this.data.targets.push(this.data.homeTile);
            this.data.mode='patrol';this.data.waitAtHome=1;
        } else if(this.data.mode==='patrol'){
            end=floor.getRoom(this.data.homeTile);
        }
        this.navigate(start,end);
    }
}
// hunts the player until out of sight, doesnt return to homebase, moes around randomly for some time, then hides
//dmLurker

// flees in any direction but where hunter is
//dmPrey

window.gm.dngmobs = (function (mobs) {
    mobs.MinoGuard = function () { return(new dmGuard());};  
    mobs.Turret = function () { return(new dmTurret());};
    mobs.Patrol = function () { return(new dmPatrol());};
    return mobs; 
}(window.gm.dngmobs || {}));