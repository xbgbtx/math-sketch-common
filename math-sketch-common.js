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

    MS.setup_interaction_hooks = function ()
    {
        mousePressed_ = mousePressed;
        mousePressed = ( e ) => 
        {
            if ( interaction_state != InteractionStates.Idle )
                return;

            mousePressed_( e );
            interaction_cbs.mouse_pressed.forEach( f => f( e ) );
        };

        mouseDragged_ = mouseDragged;
        mouseDragged = ( e ) => 
        {
            mouseDragged_( e );

            if ( interaction_state != InteractionStates.Dragging )
                return;

            drag_cb();
        };

        mouseReleased_ = mouseReleased;
        mouseReleased = ( e ) => 
        {
            if ( interaction_state == InteractionStates.Dragging )
                MS.end_drag();

            mouseReleased_( e );
            interaction_cbs.mouse_released.forEach( f => f( e ) );
        };

    };

    MS.start_drag = function ( cb )
    {
        if ( interaction_state != InteractionStates.Idle )
            return;

        interaction_state = InteractionStates.Dragging;
        drag_cb = cb;
    };

    MS.end_drag = function ()
    {
        if ( interaction_state != InteractionStates.Dragging )
            return;

        drag_cb = null;
        interaction_state = InteractionStates.Idle;
    };


}( window.MS = window.MS || {} ));
