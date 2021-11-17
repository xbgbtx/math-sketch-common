( function ( MS )
{
    MS.colors = 
    {
        background : "#2C1951",
        foreground : [
            "#FDE9C7", //white
            "#F60644", //red
            "#FFF062", //yellow
            "#50F63B", //green
            "#78FFF7", //cyan

        ]
    };

    MS.renderPoint = function (p, {label, color}={})
    {
        if ( color )
            stroke(color);
        else
            stroke(MS.colors.foreground[0]);

        strokeWeight(5);
        point(p);
        
        if ( label )
        {
            textAlign(RIGHT);
            text(label, p.x-3, p.y-3);
        }
    }
}( window.MS = window.MS || {} ));
