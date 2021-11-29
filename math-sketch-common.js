/**
 * @module math-sketch-common
 */

/**
 * @class
 * @name MS
 * @description Use window.MS to access common sketch functions.
 * @param {Object} context for exported MS.
 */
( function ( MS )
/**
 * @lends MS
 */
{
    /**
     * Object containing standard colours.
     */
    MS.colors = 
    {
        background : "#200C49",
        foreground : [
            "#FDE9C7", //white
            "#F60644", //red
            "#FFF062", //yellow
            "#50F63B", //green
            "#78FFF7", //cyan

        ]
    };

    /**
     * Creates a canvas with the standard size (512x512) and adds
     * event listeners.
     */
    MS.create_canvas = function ()
    { 
        const drawCtx = createCanvas( 512, 512 );
        const canvas = drawCtx.canvas;

        canvas.style.touchAction = "none";

        /**
         * Listen to the document pointermove event.
         *
         * @name pointermove
         * @param {HTMLEvent} e - Observable event.
         * @event document:pointermove
         */
        canvas.addEventListener ( 
            "pointermove",
            e => 
            {
                console.log(`pointer_move s=${interaction_state}`);

                const flag = pointer_move ({
                    pointerX : e.clientX,
                    pointerY : e.clientY,
                });
                
                //if ( flag == InteractionFlags.InteractionHappened )
                e.preventDefault ();
                e.stopPropagation();
            },
            {passive : false}
        );

        /**
         * Listen to the document pointerup event.
         *
         * @name pointerup
         * @param {HTMLEvent} e - Observable event.
         * @event document:pointerup
         */
        canvas.addEventListener ( 
            "pointerup",
            e => 
            {
                console.log(`pointer_up s=${interaction_state}`);
                if ( e.isPrimary )
                    pointer_up ();
            },
            {passive : false}
        );

        /**
         * Listen to the document pointerleave event.
         *
         * @name pointerleave
         * @param {HTMLEvent} e - Observable event.
         * @event document:pointerleave
         */
        canvas.addEventListener ( 
            "pointerleave",
            e => 
            {
                console.log(`pointer_leave s=${interaction_state}`);
                pointer_up ();
            },
            {passive : false}
        );

        /**
         * Listen to the document pointerdown event.
         *
         * @name pointerdown
         * @param {HTMLEvent} e - Observable event.
         * @event document:pointerdown
         */
        canvas.addEventListener ( 
            "pointerdown",
            e => 
            {
                console.log(`pointer_down s=${interaction_state}`);
                if ( e.isPrimary )
                    pointer_down ({
                        pointerX : e.clientX,
                        pointerY : e.clientY,
                    });
            },
            {passive : false}
        );
    };

    /**
     * Draw a point on canvas using p5js.
     *
     * @param {Object} p - p5.Vector2 location to draw the point.
     * @param {Object=} obj - Optional parameters object.
     * @param {string} obj.label - Display text for point.
     * @param {string} obj.color - Hex string to color point.
     * @param {number} obj.point_weight - Size of point to draw.
     * @param {number} obj.text_size - Size of text for point label.
     */
    MS.renderPoint = function (p, 
    {
        label, 
        color=MS.colors.foreground[0],
        point_weight=8,
        text_size=15,
    }={})
    {
        stroke(color);
        fill(color);

        strokeWeight(point_weight);
        point(p);
        
        if ( label )
        {
            strokeWeight(0);
            textSize(text_size);
            textAlign(RIGHT);
            text(label, p.x-3, p.y-3);
        }
    }

    /**
     * Class to hold the data needed for an interaction callback.
     */
    class InteractionCB
    {
        /**
         * The interaction callback is called when the associated
         * interaction event occurs,
         *
         * @callback interactionCallback
         */

        /**
         * Create an interaction callback.
         * @param {interactionCallback} cb - Called when interaction event 
         * occurs.
         * @param {number} priority - Higher priority events will be triggered
         * before lower priority if multiple interaction activation 
         * areas overlap.
         */
        constructor ( cb, priority ) 
        {
            this.cb = cb;
            this.priority = priority;
        }
    }

    const InteractionStates = {
        Idle : "Idle",
        Dragging : "Dragging",
    };

    const InteractionFlags = {
        BlockOtherInteractions : "BlockOtherInteractions",
        InteractionHappened : "InteractionHappened",
    };

    let interaction_state = InteractionStates.Idle;
    
    let drag_cb = null;



    //Store InteractionCB objects here as they are added.
    let interaction_cbs =
    {
        mouse_pressed : [],
    };

    MS.add_interaction_cb = function ({
        mouse_pressed,
        priority=0,
    }={})
    {
        let sort_interaction_priority = l =>
            l.sort((i,j) => i.priority > j.priority ? 0 : 1 );

        if ( mouse_pressed )
        {
            let cb_data = new InteractionCB(mouse_pressed, priority);
            interaction_cbs.mouse_pressed.push(cb_data);
            sort_interaction_priority(interaction_cbs.mouse_pressed);
        }
    }

    const start_drag = function ( cb )
    {
        if ( interaction_state != InteractionStates.Idle )
            return;

        drag_cb = cb;
        interaction_state = InteractionStates.Dragging;
    };

    const stop_drag = function ()
    {
        if ( interaction_state != InteractionStates.Dragging )
            return;

        drag_cb = undefined;
        interaction_state = InteractionStates.Idle;
    }

    const pointer_down = function ({pointerX, pointerY}={})
    {
        if ( interaction_state != InteractionStates.Idle )
            return;

        for ( const cb_data of interaction_cbs.mouse_pressed )
        {
            let flag = cb_data.cb();

            if (flag == InteractionFlags.BlockOtherInteractions)
                break;
        }
    }

    const pointer_move = function ({pointerX, pointerY}={})
    {
        if ( interaction_state != InteractionStates.Dragging )
            return;

        if ( drag_cb )
            drag_cb({pointerX, pointerY});
    }

    const pointer_up = function ()
    {
        stop_drag();
    }
    
    /**
    * Collection of factory methods that construct function pointers
    * for frequently used interactions
    * @namespace MS.Interactions
    */
    MS.Interactions = {};
        
    /**
     * Add a list of points that can be dragged using the same drag callback.
     * @name drag_points
     * @memberof MS.Interactions
     */
    MS.Interactions.drag_points = ( points, point_drag_cb ) =>
    ({
        mouse_pressed : function ()
        {
            let mouse_pos = new p5.Vector(mouseX, mouseY);

            for ( const p of points )
            {
                if ( p5.Vector.dist(mouse_pos, p ) < 15 )
                {
                    start_drag((drag_data) => point_drag_cb(p, drag_data));
                    return InteractionFlags.BlockOtherInteractions;
                }
            }
        }
    });

}( window.MS = window.MS || {} ));
