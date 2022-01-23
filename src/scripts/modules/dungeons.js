"use strict";
class BeeHive extends DngDungeon{
    constructor()    {
        super("BeeHive", function() { return("There seem to live alot of giant bees here.")},window.story.state.dng[BeeHive.name])
        this.buildFloors();
    }

    buildFloors() {
        var _floors= [];
        var firstFloor//:DngFloor;
        var stairUp//:DngRoom;
        var stairDown//:DngRoom;
        firstFloor = new DngFloor("1.Floor", function() {return("This is the lowest floor of the beehive.")});
        var room//:DngRoom;
        //var rooms:LookupTable = new LookupTable(); 
        var rooms= new Map();
        /* first floor
        *  A1 - A2 - A3 - A4
        *  	    |	  |    |	
        *  B1 - B2   B3   B4
        *  |    |    |    |
        *  E    C2   C3   S
        * */
        rooms.set("Entrance", new DngRoom("Entrance", null,false));
        rooms.set("B1", new DngRoom("B1", null,false));
        rooms.set("A1",new DngRoom("A1", null,true));	//hidden
        rooms.set("B2", new DngRoom("B2", null, false));
        rooms.set("C2",new DngRoom("C2", null,false));
        rooms.set("A2",new DngRoom("A2", null,false));
        rooms.set("B3", new DngRoom("B3", null, false));
        rooms.set("C3",new DngRoom("C3", null,false));
        rooms.set("A3",new DngRoom("A3", null,false));
        rooms.set("B4",new DngRoom("B4", null,false));
        rooms.set("A4",new DngRoom("A4", null,false));
        rooms.set("Stairs",new DngRoom("Stairs", null,false));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("Entrance") , rooms.get("B1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B1" ), rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B2" ), rooms.get("A2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C2" ), rooms.get("B2"), {onlyAtoB:true});
        DngDirection.createDirection(DngDirection.DirW, rooms.get("A2" ), rooms.get("A1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A2" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A3" ), rooms.get("A4"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B3" ), rooms.get("A3"),  {onlyAtoB:true});
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C3" ), rooms.get("B3"),  {onlyAtoB:true});
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A4" ), rooms.get("B4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("B4" ), rooms.get("Stairs"));
        room = (rooms.get("Entrance") );
        room.isDungeonEntry = room.isDungeonExit = true;
        room = (rooms.get("B1"));
        //room.onEnterFct = encounterTentacle;
        room = (rooms.get("B2") );
        //room.onEnterFct = this.encounterBee2;
        room = (rooms.get("A4") );
        room.onEnterFct = this.encounterBee2;
        room = (rooms.get("A3") );
        room.onEnterFct = this.encounterBee2;
        room = (rooms.get("B4") );
        room.getDirection(DngDirection.DirS).canExitFct = this.hasItem;
        stairUp = (rooms.get("Stairs") );
        
        firstFloor.setRooms(Array.from(rooms.values( )));
        _floors.push(firstFloor);
        
        
        var secondFloor;
        secondFloor = new DngFloor("2.Floor",function(){return("This is the second floor of the beehive.")});
        rooms= new Map(); 
        /* second floor
        * 	A1# - A2 - A3# - A4
        *  |	  |	   |     |	
        *  B1 -  B2 - B3 -  B4
        *  |     |    |     |
        *  C1 - C2# - C3# - S
        * */
        rooms.set("C1", new DngRoom("C1", null,false));
        rooms.set("B1", new DngRoom("B1", null,false));
        rooms.set("A1", new DngRoom("A1", null,false));
        rooms.set("C2", new DngRoom("C2", null,false));
        rooms.set("B2",new DngRoom("B2", null,false));
        rooms.set("A2", new DngRoom("A2", null,false));
        rooms.set("C3", new DngRoom("C3", null,false));
        rooms.set("B3",new DngRoom("B3", null,false));
        rooms.set("A3", new DngRoom("A3", null,false));
        rooms.set("StairsDown",new DngRoom("StairsDown", null,false));
        rooms.set("B4",new DngRoom("B4", null,false));
        rooms.set("A4", new DngRoom("A4", null,false));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C3" ), rooms.get("StairsDown"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C2" ), rooms.get("C3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C1" ), rooms.get("C2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A3" ), rooms.get("A4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A2" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A1" ), rooms.get("A2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B3" ), rooms.get("B4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B2" ), rooms.get("B3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B1" ), rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C3" ), rooms.get("C4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C2" ), rooms.get("C3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C1" ), rooms.get("C2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B1" ), rooms.get("A1"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C1" ), rooms.get("B1"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B2" ), rooms.get("A2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C2" ), rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B3" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C3" ), rooms.get("B3"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B4" ), rooms.get("A4"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("StairsDown"), rooms.get("B4"));
        room = (rooms.get("B4") );
        stairDown = room = (rooms.get("StairsDown") );
        room.getDirection(DngDirection.DirW).onExitFct = this.trapDoor;	//its a trap
        room = (rooms.get("B3") );
        room.getDirection(DngDirection.DirW).canExitFct = this.hasItem;
        room.getDirection(DngDirection.DirN).onExitFct = this.trapDoor;	//its a trap
        room.getDirection(DngDirection.DirS).onExitFct = this.trapDoor;	//its a trap
        room = (rooms.get("B2") );
        room.getDirection(DngDirection.DirE).onExitFct = this.trapDoor;	//its a trap
        room = (rooms.get("A2"));
        room.getDirection(DngDirection.DirW).onExitFct = this.trapDoor;	//its a trap
        room = (rooms.get("B1"));
        room.getDirection(DngDirection.DirN).onExitFct = this.trapDoor;	//its a trap
        secondFloor.setRooms(Array.from(rooms.values( )));
        _floors.push(secondFloor);
        //now create floor links
        DngDirection.createDirection(DngDirection.StairUp, stairUp , stairDown);
        this.setFloors(_floors);//assign floors to dng
    }
    exitDungeon() {
        super.exitDungeon();
        window.story.show("ForestEntrance");
    }
    encounterTentacle(Me) {
        window.story.show('DungeonFoundNothing');
        return true;
    }
    encounterBee2(Me) {
        window.story.show('DungeonFoundNothing');
        return true;
    }
    hasItem(Me) {
       /* if (!player.hasItem(ItemType.lookupItem("BeeHony"), 1))
        {
            Me.tooltip = "You dont have a vial of beehoney";
            return false;
        }*/
        return true;
    }
    //player falls down to 1.floor when entering the room
    trapDoor(Me) {
        window.story.show('DungeonCrashedThroughFloor');
        return(true);
    }
}
class ShatteredCity extends DngDungeon{
    persistentDngDataTemplate() {
        let _data = {
            A1Chest:["TailRibbon","HorsePotion"],
            A2defeated : 0
        };
        return(_data);
    }
    constructor()    {
        super("ShatteredCity", function() { return("A once thriving city now lies in ruins.")},window.story.state.dng[ShatteredCity.name]);
        this.buildFloors();
    }
    buildFloors() {
        var _floors= [];
        var firstFloor//:DngFloor;
        var stairUp//:DngRoom;
        var stairDown//:DngRoom;
        firstFloor = new DngFloor("main street");
        var room//:DngRoom;
        var rooms= new Map();
        /* main street
        *  A1 - A2 - A3 - A4
        *      |      |    |	
        *  B1 - B2   B3   B4
        *  |    |    |    |
        *  C1   C2   C3   C4
        * B1 = Entrance; B2 Camp; A1 Chest
        * */
        rooms.set("C1",new DngRoom("C1", null,false));
        rooms.set("B1",new DngRoom("B1", null,false));
        rooms.set("A1",new DngRoom("A1", null,false));
        rooms.set("B2",new DngRoom("B2", function(){return('Campfire');},false));
        rooms.set("C2",new DngRoom("C2", null,false));
        rooms.set("A2",new DngRoom("A2", null,false));
        rooms.set("B3",new DngRoom("B3", null,false));
        rooms.set("C3",new DngRoom("C3", null,false));
        rooms.set("A3",new DngRoom("A3", null,false));
        rooms.set("B4",new DngRoom("B4", null,false));
        rooms.set("A4",new DngRoom("A4", null,false));
        rooms.set("C4",new DngRoom("C4", null,false));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C1") , rooms.get("B1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B1" ), rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B2" ), rooms.get("A2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C2" ), rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirW, rooms.get("A2" ), rooms.get("A1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A2" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A3" ), rooms.get("A4"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B3" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C3" ), rooms.get("B3"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A4" ), rooms.get("B4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("B4" ), rooms.get("C4"));
        room = (rooms.get("B1") );
        room.isDungeonEntry = room.isDungeonExit = true;
        room = (rooms.get("A1"));
        let _evt = new DngOperation("Chest");
        _evt.canTrigger = function(){return(true);};
        _evt.onTrigger = function(){
            this.renderEvent = this.renderChestA1;
            this.evtData = {};
            this.renderNext(1);
        };
        room.operations = [_evt]; //adds an loot-chest in this room
        room = (rooms.get("B2") );
        room.allowSave=true;
        room = (rooms.get("C1") );
        _evt = new DngOperation("Scavenge");
        _evt.canTrigger = function(){return(true);};
        _evt.onTrigger = function(){
            this.renderEvent = this.renderScavengeA3;
            this.evtData = {};
            this.renderNext(1);
        };
        room.operations = [_evt];
        room = (rooms.get("A3") );
        room.onEnterFct = this.sneekAround();
        room = (rooms.get("A4") );
        //room.onEnterFct = this.sneekAround();
        room.getDirection(DngDirection.DirS).canExitFct = this.hasItem;
        stairUp = (rooms.get("C4") );
        
        firstFloor.setRooms(Array.from(rooms.values( )));
        _floors.push(firstFloor);
        this.setFloors(_floors);
    }
    exitDungeon() {
        super.exitDungeon();
        window.story.show("ForestEntrance");
    }
    sneekAround() {
        let cb = function(that){ 
            return(function(me){
                that.renderEvent = that.renderSneekAround;
                that.evtData = {};
                that.renderNext(1);
                return true;
        });}(this);
        return(cb);        
    }
    renderSneekAround(evt) {
        let msg ='';
        let _rnd = _.random(0,100);
        if(evt.id===1) {
            window.gm.addTime(30);
            msg = 'There is a gang of barbarians. You could try to sneek around them, talk your way through it or start a surprise attack.</br>';
            msg+= window.gm.printLink("sneak around","window.gm.dng.renderNext(2)");
            msg+= window.gm.printPassageLink("approach","SC_BarbarianMeetup");
            msg+= window.gm.printLink("attack","window.gm.dng._fight(1)");
        } else if(evt.id===2) {
            if(_rnd>70) {
                msg+='Someone spotted you !</br>';
                msg+= window.gm.printLink("Next",'window.gm.dng._fight()');
            } else  {
                msg = 'You succesfully bypassed the threat.</br>';
                msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
            }
        }else if(evt.id===3) {
                msg+='Someone spotted you !</br>';
                msg+= window.gm.printLink("Next",'window.gm.dng._fight()');
        }
        return(msg);
    }
    renderChestA1(evt) { //this is some statemachine to render the screen for lootchest
        let msg ='';
        if(evt.id===1) {
            window.gm.addTime(30);
            msg = 'There is a chest. Do you dare to open it?</br>';
            msg+= window.gm.printLink("open chest","window.gm.dng.renderNext(2)");
            msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
        } else if(evt.id===2 && this.data.A1Chest.length>0) {
            msg = 'You find:'+this.data.A1Chest.join(",")+'</br>';
            msg+= window.gm.printLink("Take all","window.gm.dng.renderNext(3)");
        } else if(evt.id===3) {
            for(el of this.data.A1Chest){
                this._addItemToPlayer(el);
            }
            this.data.A1Chest = [];
            msg = 'You take everything from the chest.</br>';
            msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
        } else {
            msg = 'There is nothing useful.</br>';
            msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
        }
        return(msg);
    }
    renderScavengeA3(evt) { //
        let msg ='';
        let _rnd = _.random(0,100);
        if(evt.id===1) {
            window.gm.addTime(30);//todo would be better to update time after battle
            msg = 'You search the area for something useful...</br>';
            if(_rnd>30) {
                msg+='... and found some trouble !</br>';
                msg+= window.gm.printLink("Next",'window.gm.dng._fight()');
            } else  {
                msg = '...but you didnt find anything.</br>';
                msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
            }
        } 
        return(msg);
    }
    _fight(evt) {
        if(evt===1) window.gm.encounters.wolf();
        else window.gm.encounters.wolf();
    }
    _addItemToPlayer(id) {
        let item = new window.storage.constructors[id]();
        if(item.canEquip) {
            window.gm.player.Wardrobe.addItem(item);
        } else {
            window.gm.player.Inv.addItem(item);
        }
    }
}
class MinoLairLv1 extends DngDungeon{
    persistentDngDataTemplate() {
        let _data = {
            mobData: []
        };
        return(_data);
    }
    constructor()    {
        super()
        this.Mapper = new DngMapper(this.extMapInfo.bind(this));
        this.Mapper.printLegend= function(){return(this.__proto__.printLegend()+'<pre>p=Patrol t=Turret</pre>');}
        this.buildFloors();
        this.onEnterRoom = this.checkCollisionPlayer;
        this.addMobs();
    }
    printRoomScene(){
        let panel=$("div#panel2")[0];
        var entry =document.createElement('p');
        entry.textContent="You listen for suspicious sounds around but there is just to much noise from running machinery.";
        panel.appendChild(entry);
        entry =document.createElement('div');
        entry.innerHTML=window.story.render("Inv_Hud2");
        panel.appendChild(entry);
    }
    desc() {return("Escape the Mean Mino");}
    buildFloors() {
        var _floors= [];
        var firstFloor//:DngFloor;
        firstFloor = new DngFloor("1.Floor", function() {return("floor#1.")});
        var room//:DngRoom;
        var rooms= new Map();

        let _evt2 = new DngOperation("wait");
        _evt2.canTrigger = function(){return(true);};
        _evt2.onTrigger = function(){
            this.tickMobs();this.resumeRoom();
        };
        let desc=function(){
            let msg=this.name+'</br>';
            return(msg);
        };
        rooms.set("A1",new DngRoom("A1", desc,false));
        rooms.set("B1", new DngRoom("B1", desc,false));
        rooms.set("C1", new DngRoom("C1", desc, false));
        rooms.set("D1", new DngRoom("D1", desc, false));
        rooms.set("E1",new DngRoom("E1", desc,false));
        rooms.set("F1", new DngRoom("F1", desc, false));
        rooms.set("A2", new DngRoom("A2", desc,false));
        rooms.set("B2", new DngRoom("B2", desc,false));
        rooms.set("C2", new DngRoom("C2", desc, false));
        rooms.set("D2", new DngRoom("D2", desc, false));
        rooms.set("E2",new DngRoom("E2", desc,false));
        rooms.set("F2", new DngRoom("F2", desc, false));
        rooms.set("A3",new DngRoom("A3", desc,false));
        rooms.set("B3", new DngRoom("B3", desc,false));
        rooms.set("C3", new DngRoom("C3", desc, false));
        rooms.set("D3", new DngRoom("D3", desc, false));
        rooms.set("E3",new DngRoom("E3", desc,false));
        rooms.set("F3", new DngRoom("F3", desc, false));
        rooms.set("A4",new DngRoom("A4", desc,false));
        rooms.set("B4", new DngRoom("B4", desc,false));
        rooms.set("C4", new DngRoom("C4", desc, false));
        rooms.set("D4", new DngRoom("D4", desc, false));
        rooms.set("E4",new DngRoom("E4", desc,false));
        rooms.set("F4", new DngRoom("F4", desc, false));
        rooms.set("A5",new DngRoom("A5", desc,false));
        rooms.set("B5", new DngRoom("B5", desc,false));
        rooms.set("C5", new DngRoom("C5", desc, false));
        rooms.set("D5", new DngRoom("D5", desc, false));
        rooms.set("E5",new DngRoom("E5", desc,false));
        rooms.set("F5", new DngRoom("F5", desc, false));
        /* first floor
        *  
        * A1   B1 o C1 o D1   E1   F1
        * |     o        o    |    |
        * A2 - B2 - C2 - D2 - E2 - F2
        * |                   |    |
        * A3 - B3 - C3 - D3 - E3 - F3
        *      |     |   |    |    |
        * A4 - B4   C4 - D4 - E4   F4  
        * |          |             |
        * A5 - B5 - C5 - D5 - E5 - F5
        * */
        //horizontal
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("A1") , rooms.get("B1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B1" ), rooms.get("C1"),{tags:['duct']});
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C1" ), rooms.get("D1"),{tags:['duct']});
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("D1" ), rooms.get("E1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A2") , rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B2" ), rooms.get("C2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C2" ), rooms.get("D2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("D2" ), rooms.get("E2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("E2" ), rooms.get("F2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A3") , rooms.get("B3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B3" ), rooms.get("C3"),{tags:['barrier']});
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C3" ), rooms.get("D3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("D3" ), rooms.get("E3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("E3" ), rooms.get("F3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A4") , rooms.get("B4"));
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("B4" ), rooms.get("C4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C4" ), rooms.get("D4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("D4" ), rooms.get("E4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A5" ), rooms.get("B5"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B5" ), rooms.get("C5"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C5" ), rooms.get("D5"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("D5" ), rooms.get("E5"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("E5" ), rooms.get("F5"));
        //vertical
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A1" ), rooms.get("A2"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("B1" ), rooms.get("B2"),{tags:['duct']});
        DngDirection.createDirection(DngDirection.DirS, rooms.get("D1" ), rooms.get("D2"),{tags:['duct']});
        DngDirection.createDirection(DngDirection.DirS, rooms.get("E1" ), rooms.get("E2"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A2" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("E2" ), rooms.get("E3"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("B3" ), rooms.get("B4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("C3" ), rooms.get("C4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("D3" ), rooms.get("D4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A4" ), rooms.get("A5"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("F1" ), rooms.get("F2"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("F2" ), rooms.get("F3"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("F3" ), rooms.get("F4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("F4" ), rooms.get("F5"));
        for (room of rooms.values( )) {  room.operations = [_evt2];   }
        room =rooms.get("A3"); room.isDungeonEntry = true;
        room =rooms.get("E1"); room.isDungeonExit = true;
        //room =rooms.get("A4"); room.allowSave=true;
        firstFloor.setRooms(Array.from(rooms.values( )));
        _floors.push(firstFloor);
        this.setFloors(_floors);
    }
    addMobs(){
        let mob=window.gm.dngmobs.MinoGuard(); mob.data.homeTile=mob.data.actualTile='E3',mob.data.name='bad bull';
        this.addMob(mob,"1.Floor");
        mob=window.gm.dngmobs.Turret(); mob.data.homeTile=mob.data.actualTile='C2',mob.data.name='Laser turret';
        this.addMob(mob,"1.Floor");
        mob=window.gm.dngmobs.Patrol(); mob.data.homeTile=mob.data.actualTile='B3',mob.data.name='Hound',mob.data.targets=[{to:'C5'},{to:'B3'}];
        this.addMob(mob,"1.Floor");
        mob=window.gm.dngmobs.Hunter(); mob.data.homeTile=mob.data.actualTile='F1',mob.data.name='Lurker';
        this.addMob(mob,"1.Floor");
    }
    exitDungeon() {
        super.exitDungeon();
        window.story.show("Intro");
    }
    checkCollisionPlayer(room) {
        //check if there is a mob
        this.tickMobs();
        for(var i=this.actualRoom.floor.Mobs.length-1;i>=0;i--) {
            let mob=this.actualRoom.floor.Mobs[i];
            if(mob.data.actualTile!==room.name) continue
            if(mob.onCollidePlayer()) {     }
        }
        return(false);
    }
    extMapInfo(roomInfo) { //show mino on map
        if(!this.actualRoom) return(roomInfo);
        for(var i=this.actualRoom.floor.Mobs.length-1;i>=0;i-- ){
            if(roomInfo.name===this.actualRoom.floor.Mobs[i].data.actualTile) {
                roomInfo.boss=this.actualRoom.floor.Mobs[i].data.mark;
            }
        }
        return(roomInfo);
    }    
}
class MinoLairLv2 extends MinoLairLv1 {
    constructor() {super();}
    buildFloors() {
        var _floors= [];
        var firstFloor//:DngFloor;
        var stairUp//:DngRoom;
        var stairDown//:DngRoom;
        firstFloor = new DngFloor("1.Floor", function() {return("floor#1.")});
        var room//:DngRoom;
        var rooms= new Map();

        let _evt2 = new DngOperation("wait");
        _evt2.canTrigger = function(){return(true);};
        _evt2.onTrigger = function(){
            this.tickMobs();this.resumeRoom();
        };
        let desc=function(){
            let msg=this.name+'</br>';
            //msg+=window.story.render("Inv_Hud2");
            return(msg);
        };
        rooms.set("A1",new DngRoom("A1", desc,false));
        rooms.set("B1", new DngRoom("B1", desc,false));
        rooms.set("C1", new DngRoom("C1", desc, false));
        rooms.set("D1", new DngRoom("D1", desc, false));
        rooms.set("E1",new DngRoom("E1", desc,false));
        rooms.set("F1", new DngRoom("F1", desc, false));
        rooms.set("A2", new DngRoom("A2", desc,false));
        rooms.set("B2", new DngRoom("B2", desc,false));
        rooms.set("C2", new DngRoom("C2", desc, false));
        rooms.set("D2", new DngRoom("D2", desc, false));
        rooms.set("E2",new DngRoom("E2", desc,false));
        rooms.set("F2", new DngRoom("F2", desc, false));
        rooms.set("A3",new DngRoom("A3", desc,false));
        rooms.set("B3", new DngRoom("B3", desc,false));
        rooms.set("C3", new DngRoom("C3", desc, false));
        rooms.set("D3", new DngRoom("D3", desc, false));
        rooms.set("E3",new DngRoom("E3", desc,false));
        rooms.set("F3", new DngRoom("F3", desc, false));
        rooms.set("A4",new DngRoom("A4", desc,false));
        rooms.set("B4", new DngRoom("B4", desc,false));
        rooms.set("C4", new DngRoom("C4", desc, false));
        rooms.set("D4", new DngRoom("D4", desc, false));
        rooms.set("E4",new DngRoom("E4", desc,false));
        rooms.set("F4", new DngRoom("F4", desc, false));
        rooms.set("A5",new DngRoom("A5", desc,false));
        rooms.set("B5", new DngRoom("B5", desc,false));
        rooms.set("C5", new DngRoom("C5", desc, false));
        rooms.set("D5", new DngRoom("D5", desc, false));
        rooms.set("E5",new DngRoom("E5", desc,false));
        rooms.set("F5", new DngRoom("F5", desc, false));
        /* first floor
        *  
        * A1 - B1 - C1 - D1 - E1 - F1
        *  |    |        |         |
        * A2   B2 - C2 - D2   E2 - F2
        *  |         |        |    |
        * A3 - B3 - C3 - D3   E3   F3
        *  |   |     |   |    |    |
        * A4   B4   C4 - D4 - E4   F4  
        *  |         |             |
        * A5 - B5 - C5 - D5 - E5 - F5
        * */
        //horizontal
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A1") , rooms.get("B1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B1" ), rooms.get("C1"),{tags:['barrier']});
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C1" ), rooms.get("D1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("D1" ), rooms.get("E1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("E1" ), rooms.get("F1"));
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("A2") , rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B2" ), rooms.get("C2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C2" ), rooms.get("D2"));
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("D2" ), rooms.get("E2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("E2" ), rooms.get("F2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A3") , rooms.get("B3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B3" ), rooms.get("C3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C3" ), rooms.get("D3"));
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("D3" ), rooms.get("E3"));
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("E3" ), rooms.get("F3"));
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("A4") , rooms.get("B4"));
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("B4" ), rooms.get("C4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C4" ), rooms.get("D4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("D4" ), rooms.get("E4"));
        //DngDirection.createDirection(DngDirection.DirE, rooms.get("E4" ), rooms.get("F4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A5" ), rooms.get("B5"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B5" ), rooms.get("C5"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C5" ), rooms.get("D5"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("D5" ), rooms.get("E5"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("E5" ), rooms.get("F5"));
        //vertical
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A1" ), rooms.get("A2"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("B1" ), rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("D1" ), rooms.get("D2"));
        //DngDirection.createDirection(DngDirection.DirS, rooms.get("E1" ), rooms.get("E2"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("F1" ), rooms.get("F2"))
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A2" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("C2" ), rooms.get("C3"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("E2" ), rooms.get("E3"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("F2" ), rooms.get("F3"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A3" ), rooms.get("A4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("B3" ), rooms.get("B4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("C3" ), rooms.get("C4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("D3" ), rooms.get("D4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("E3" ), rooms.get("E4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("F3" ), rooms.get("F4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A4" ), rooms.get("A5"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("F4" ), rooms.get("F5"));
        for (room of rooms.values( )) {  room.operations = [_evt2];   }
        room =rooms.get("A2"); room.isDungeonEntry = true;
        room =rooms.get("F5"); room.isDungeonExit = true;
        //room =rooms.get("A4"); room.allowSave=true;
        firstFloor.setRooms(Array.from(rooms.values( )));
        _floors.push(firstFloor);
        this.setFloors(_floors);
    }
    addMobs(){
        let mob=window.gm.dngmobs.Patrol(); mob.data.homeTile=mob.data.actualTile='A1',mob.data.startAP=2,mob.data.name='Scanner1',mob.data.targets=[{to:'F1'},{to:'F5'},{to:'A5'},{to:mob.data.homeTile}];
        this.addMob(mob,"1.Floor");
        mob=window.gm.dngmobs.Patrol(); mob.data.homeTile=mob.data.actualTile='F5',mob.data.name='Scanner2',mob.data.targets=[{to:'A5'},{to:'A1'},{to:'F1'},{to:mob.data.homeTile}];
        this.addMob(mob,"1.Floor");
        mob=window.gm.dngmobs.Hunter(); mob.data.homeTile=mob.data.actualTile='C4',mob.data.name='Lurker';
        this.addMob(mob,"1.Floor");
        let _evt = new DngOperation("Inspect Battery");
        _evt.canTrigger = function(){return(true);};
        _evt.onTrigger = function(){
            this.renderEvent = this.renderTakeEmptyBattery;this.evtData = {};
            this.renderNext(1);
        };
        this.getFloor("1.Floor").getRoom("B4").operations = [_evt];
        _evt = new DngOperation("Charge Battery");
        _evt.canTrigger = function(){return(true);};
        _evt.onTrigger = function(){
            this.renderEvent = this.renderChargeBattery; this.evtData = {};
            this.renderNext(1);
        };
        this.getFloor("1.Floor").getRoom("E2").operations = [_evt];
    }
    renderTakeEmptyBattery(evt) {
        let msg ='';
        if(evt.id===1) {
            msg = 'There is a battery. Maybe you can use it elsewhere?</br>';
            msg+= window.gm.printLink("take battery","window.story.state.Glob.hasEmptyBattery+=1;window.gm.dng.renderNext(2)");
            msg+= window.gm.printLink("ignore it","window.gm.dng.resumeRoom()");
        } else if(evt.id===2 ) {
            msg = 'You grab the battery. Unfortunatly it is empty and would need to be charged first.</br>';
            msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
        } else {
            msg = 'There is nothing useful.</br>';
            msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
        }
        return(msg);
    }
    renderChargeBattery(evt) {
        let msg ='';
        if(evt.id===1) {
            msg = 'Here is a charging station where you could recharge empty batteries.</br>';
            msg+= (window.story.state.Glob.hasEmptyBattery>0)? 
                window.gm.printLink("charge battery","window.story.state.Glob.hasEmptyBattery-=1;window.story.state.Glob.hasFullBattery+=1;window.gm.dng.renderNext(2)"):'You dont have empty batteries.';
            msg+= window.gm.printLink("ignore it","window.gm.dng.resumeRoom()");
        } else if(evt.id===2 ) {
            msg = 'After the charger is done with the battery, you remove it from the socket.</br>';
            msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
        } else {
            msg = 'There is nothing useful.</br>';
            msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
        }
        return(msg);
    }
}
class MinoLairLv3 extends MinoLairLv1 {
    constructor() {super();
        this.data.doorC3=0;
    }
    addMobs(){
        let mob=window.gm.dngmobs.Patrol(); mob.data.homeTile=mob.data.actualTile='B3',mob.data.name='Scanner',mob.data.targets=[{to:'F3'},{to:mob.data.homeTile,jump:true}];
        this.addMob(mob,"1.Floor");
        mob=window.gm.dngmobs.Hunter(); mob.data.homeTile=mob.data.actualTile='E3',mob.data.name='Lurker';
        this.addMob(mob,"1.Floor");
        let _evt = new DngOperation("Inspect Lever");
        _evt.canTrigger = function(){return(true);};
        _evt.onTrigger = function(){
            this.renderEvent = this.renderToggleDoor; this.evtData = {};
            this.renderNext(1);
        };
        this.getFloor("1.Floor").getRoom("A3").operations.push(_evt);
    }
    renderToggleDoor(evt) {
        let msg ='';
        if(evt.id===1) {
            msg = 'There is a lever to control the door further down east.</br>';
            if(this.data.doorC3===0){
                msg+= 'The door is currently closed. Would you like to toggle the lever?</br>';
            } else {
                msg+= 'The door is open.</br>';
            }
            msg+=window.gm.printLink("pull lever","window.gm.dng.toggleDoor(),window.gm.dng.resumeRoom()");
            msg+= window.gm.printLink("ignore it","window.gm.dng.resumeRoom()");
        } else {
            msg = 'There is nothing useful.</br>';
            msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
        }
        return(msg);
    }
    toggleDoor() {
        if(this.data.doorC3===1) {
            this.data.doorC3=0;
            this.getFloor("1.Floor").getRoom("B3").getDirection(DngDirection.DirE).addTags(['barrier']);
        } else {
            this.data.doorC3=1;
            this.getFloor("1.Floor").getRoom("B3").getDirection(DngDirection.DirE).removeTags(['barrier']);
        }
    }
}
class CargoBay extends MinoLairLv1 {
    constructor() {super();
        this.data.doorC3=0;
    }
    addMobs(){
        let mob=window.gm.dngmobs.Patrol(); mob.data.homeTile=mob.data.actualTile='B3',mob.data.name='Scanner',mob.data.targets=[{to:'F3'},{to:mob.data.homeTile,jump:true}];
        this.addMob(mob,"1.Floor");
        mob=window.gm.dngmobs.Hunter(); mob.data.homeTile=mob.data.actualTile='E3',mob.data.name='Lurker';
        this.addMob(mob,"1.Floor");
        let _evt = new DngOperation("Inspect Lever");
        _evt.canTrigger = function(){return(true);};
        _evt.onTrigger = function(){
            this.renderEvent = this.renderToggleDoor; this.evtData = {};
            this.renderNext(1);
        };
        this.getFloor("1.Floor").getRoom("A3").operations.push(_evt);
    }
    renderToggleDoor(evt) {
        let msg ='';
        if(evt.id===1) {
            msg = 'There is a lever to control the door further down east.</br>';
            if(this.data.doorC3===0){
                msg+= 'The door is currently closed. Would you like to toggle the lever?</br>';
            } else {
                msg+= 'The door is open.</br>';
            }
            msg+=window.gm.printLink("pull lever","window.gm.dng.toggleDoor(),window.gm.dng.resumeRoom()");
            msg+= window.gm.printLink("ignore it","window.gm.dng.resumeRoom()");
        } else {
            msg = 'There is nothing useful.</br>';
            msg+= window.gm.printLink("Leave","window.gm.dng.resumeRoom()");
        }
        return(msg);
    }
    toggleDoor() {
        if(this.data.doorC3===1) {
            this.data.doorC3=0;
            this.getFloor("1.Floor").getRoom("B3").getDirection(DngDirection.DirE).addTags(['barrier']);
        } else {
            this.data.doorC3=1;
            this.getFloor("1.Floor").getRoom("B3").getDirection(DngDirection.DirE).removeTags(['barrier']);
        }
    }
}
window.gm.dngs = (function (dngs) {
    dngs.BeeHive = function () { return(new BeeHive());};  
    dngs.ShatteredCity = function () { return(new ShatteredCity());};  
    dngs.ArenaTrialsNo1 = function () { return(new ArenaTrialsNo1());};
    dngs.MinoLairLv1 = function () { return(new MinoLairLv1());};
    dngs.MinoLairLv2 = function () { return(new MinoLairLv2());};
    dngs.MinoLairLv3 = function () { return(new MinoLairLv3());};
    dngs.CargoBay = function () { return(new CargoBay());};
    return dngs; 
}(window.gm.dngs || {}));