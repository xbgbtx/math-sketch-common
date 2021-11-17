( function ( MS )
{
    MS.colours = 
    {
        background : "2C1951"
    };

    MS.renderPoint = function (p, {label}={})
    {
        strokeWeight(5);
        point(p);
        
        if ( label )
        {
            textAlign(RIGHT);
            text(label, p.x-3, p.y-3);
        }
    }
}( window.MS = window.MS || {} ));
