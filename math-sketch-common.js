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
        mouse_dragged : [],
        mouse_released : [],
    };

    MS.add_interaction_cb = function ( {mouse_pressed, mouse_released}={})
    {
        if ( mouse_pressed )
            interaction_cbs.mouse_pressed.push(mouse_pressed);

        if ( mouse_released )
            interaction_cbs.mouse_released.push(mouse_released);
    }

    const InteractionStates = {
        Idle : "Idle",
        Dragging : "Dragging",
    }

    let interaction_state = InteractionStates.Idle;
    
    let drag_cb = null;

    MS.handle_interaction = function ()
    {
        switch ( interaction_state )
        {
            case InteractionStates.Idle :
            {
                if(mouseIsPressed) 
                    interaction_cbs.mouse_pressed.forEach( f => f() );
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

}( window.MS = window.MS || {} ));
