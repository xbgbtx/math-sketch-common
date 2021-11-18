( function ( MS )
{
    let render_cbs = [];

    MS.add_render_cb = (cb) => render_cbs.push(x);

    MS.setup = function ()
    {
        draw_ = draw;
        draw = () => 
        {
            draw_();
            
            for ( const cb of render_cbs )
                cb();
        };
    };

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

}( window.MS = window.MS || {} ));
