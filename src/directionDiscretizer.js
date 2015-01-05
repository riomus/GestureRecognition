  var discretizeDirection=function(directionAngle){
       var directions={
        'E':[-22.5,22.5],
        'NE':[22.5,67.5],
        'N':[67.5,112.5],
        'NW':[112.5,157.5],
        'W':[157.5,181],
        'W ':[-181,-157.5],
        'WS':[-157.5,-112.5],
        'S':[-112.5,-67.5],
        'ES':[-67.5,-22.5]
      };
      var directionAngleDegrees=directionAngle*180/Math.PI;
      var directionsKeys=Object.keys(directions);
      for(var i=0;i<directionsKeys.length;i++){
        var direction=directionsKeys[i];
        var range=directions[direction];
        if(directionAngleDegrees>=range[0]&&directionAngleDegrees<range[1]){
          return direction.trim();
        }
      }
};
