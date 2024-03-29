﻿/*
==============================
Duedo.Stage
Updates all the game entities
Author: http://www.edoardocasella.it
==============================
*/

Duedo.Stage = function (gameContext) {
    Duedo.Object.call(this);
    this.Game = gameContext || Duedo.Global.Games[0];
};

/*Inherit generic Object*/
Duedo.Stage.prototype = Object.create(Duedo.Object.prototype);
Duedo.Stage.prototype.constructor = Duedo.Stage;


/*
 * Update levels
 * Called by the main loop
*/
Duedo.Stage.prototype.PreUpdate = function (dt) {
    this.__Update(dt, this.Game.Entities, "PreUpdate");
};
Duedo.Stage.prototype.Update = function (dt) {
    this.__Update(dt, this.Game.Entities, "Update");
};
Duedo.Stage.prototype.PostUpdate = function (dt) {
    this.__Update(dt, this.Game.Entities, "PostUpdate", true);
};


/*
 * IsGraphical
*/
Duedo.Stage.prototype.IsGraphical = function(o) {
    return (typeof o["Draw"] !== "undefined");
};


/*
 * __Update
 * @private
*/
Duedo.Stage.prototype.__Update = function (deltaT, ents, upLevel, considerRendering = false) {

    /*Update entities*/
    var len = ents.length - 1;
    
    /*Cycle through all entities*/
    while ((ent = ents[len--]) != null) {
        
        if (ent["NeedsUpdate"] && ent["NeedsUpdate"] == false) {
            continue;
        }

        /*Check entity life*/
        if (!Duedo.Null(ent["InUse"])) 
        {
            
            if (ent.MustBeDead(this.Game)) 
            {
                ent.InUse = false;
                
                if(ent instanceof Duedo.Entity) 
                {
                    ent.Kill();
                }
            }

            /*Entity is dead*/
            if (!ent.InUse) 
            {
                if (!Duedo.Null(ent["_CallTriggers"])) 
                {
                    ent._CallTriggers("destroy");
                }

                this.Game.Entities.splice(ents.indexOf(ent), 1);
                continue;
            }


            if(this.IsGraphical(ent) && ent.ShouldBeRendered && considerRendering)
            {
                this.Game.Renderer.Buffer.push(ent);
            }

        } //#ENT-INUSE
        
        /*Step entity*/
        this.__StepEntity(deltaT, ent, upLevel);
        /*Save previous updated entity*/
        Duedo.Global.PreviousEntity = ent;
    }
};


/*
 * __StepEntity
 * Update an individual entity and all his sub-children
*/
Duedo.Stage.prototype.__StepEntity = function (deltaT, ent, upLevel) {

    if (Duedo.Null(upLevel)) upLevel = "Update";

    /*Update entity*/
    if (!Duedo.Null(ent[upLevel])) 
    {

        /*SuperUpdate*/
        if (!Duedo.Null(ent["Super" + upLevel])) 
        {
            ent["Super" + upLevel](deltaT);
        }

        /*Update*/
        ent[upLevel](deltaT);

        /*Update sub-children*/
        if (ent.ChildrenList && Duedo.IsArray(ent.ChildrenList.List)) 
        {
            this.__Update(deltaT, ent.ChildrenList.List, upLevel);
        }
    }

};
