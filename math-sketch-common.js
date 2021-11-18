( function ( MS )
{
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

    let interaction_cbs =
    {
        mouse_pressed : [],
    };

    MS.add_interaction_cb = function ({
        mouse_pressed,
        priority=0,
    }={})
    {
        if ( mouse_pressed )
            interaction_cbs.mouse_pressed.push(mouse_pressed);
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
                    for ( const f of interaction_cbs.mouse_pressed )
                    {
                        let flag = f();

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
    {
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
    };

}( window.MS = window.MS || {} ));
