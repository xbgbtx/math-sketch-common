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
     * Creates a canvas with the standard size (512x512)
     */
    MS.create_canvas = () => createCanvas( 512, 512 );

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

    class InteractionCB
    {
        constructor ( cb, priority ) 
        {
            this.cb = cb;
            this.priority = priority;
        }
    }

    //Prevent scrolling window on sketches
    document.addEventListener ( 
        "touchmove",
        e => e.preventDefault(),
        {passive : false}
    );

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

    const InteractionStates = {
        Idle : "Idle",
        Dragging : "Dragging",
    };

    const InteractionFlags = {
        BlockOtherInteractions : "BlockOtherInteractions",
    };

    let interaction_state = InteractionStates.Idle;
    
    let drag_cb = null;

    MS.handle_interaction = function ()
    {
        switch ( interaction_state )
        {
            case InteractionStates.Idle :
            {
                if(mouseIsPressed) 
                {
                    for ( const cb_data of interaction_cbs.mouse_pressed )
                    {
                        let flag = cb_data.cb();

                        if (flag == InteractionFlags.BlockOtherInteractions)
                            break;
                    }
                } 
                break;
            }
            case InteractionStates.Dragging :
            {
                if(mouseIsPressed) 
                {
                    drag_cb();
                }
                else
                {
                    drag_cb = null;
                    interaction_state = InteractionStates.Idle;
                }
                break;
            }
        }
    };

    MS.start_drag = function ( cb )
    {
        if ( interaction_state != InteractionStates.Idle )
            return;

        drag_cb = cb;
        interaction_state = InteractionStates.Dragging;
    };

    //Collection of factory methods that construct function pointers
    //for frequently used interactions
    MS.Interactions = {};
        
    MS.Interactions.drag_points = ( points, point_drag_cb ) =>
    ({
        mouse_pressed : function ()
        {
            let mouse_pos = new p5.Vector(mouseX, mouseY);

            for ( const p of points )
            {
                if ( p5.Vector.dist(mouse_pos, p ) < 10 )
                {
                    MS.start_drag(() => point_drag_cb(p));
                    return InteractionFlags.BlockOtherInteractions;
                }
            }
        }
    });

}( window.MS = window.MS || {} ));
