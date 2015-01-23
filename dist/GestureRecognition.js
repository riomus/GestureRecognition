(function(root, undefined) {

  "use strict";


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


  var OpticalFlowTracker=function(providedConfig){
    this.config={
      width:400,
      height:300
    };
    for (var attrname in providedConfig)  {
        this.config[attrname] = providedConfig[attrname];
    }
    OpticalFlowTracker.base(this, 'constructor');
    this.hornsService=new root.OpticalFlow(this.config);
    this.lastFrame=new root.Uint8ClampedArray(this.config.width*this.config.height*4);
  };

  root.tracking.inherits(OpticalFlowTracker, root.tracking.Tracker);

  OpticalFlowTracker.prototype.track = function(pixels) {
    this.emit('track',this.hornsService.getFlowData([this.lastFrame,pixels]));
      this.lastFrame=pixels;
  };

OpticalFlowTracker.VERSION='0.0.1';

root.OpticalFlowTracker=OpticalFlowTracker;


/* GestureRecognition main */

// Base function.
var GestureRecognition = function(providedConfig) {
  this.config={
    'hmm':{
      'states':['a','b','c','d','e','f'],
      'symbols':['E','NE','N','NW','W','WS','S','ES'],
      'startProbability':{'a':0.16,'b':0.16,'c':0.16,'d':0.16,'e':0.16,'f':0.16},
      'matchFactor':0.00005,
      'minimalProbabilityFactor':0.7,
      'minimalLengthFactor':0.90,
    },
      'gestures':{
        'hearth':[['E', 'NE', 'NE', 'NE', 'NE', 'NE', 'W', 'W', 'W', 'WS', 'S', 'S', 'NE', 'N', 'N', 'W', 'WS', 'S', 'S', 'S', 'ES', 'ES', 'ES', 'ES'],['NE', 'NE', 'NE', 'NE', 'NE', 'W', 'W', 'WS', 'S', 'S', 'N', 'N', 'NW', 'W', 'WS', 'WS', 'S', 'S', 'ES', 'ES', 'E', 'E'],['NE', 'NE', 'NE', 'NE', 'NW', 'W', 'WS', 'S', 'NE', 'N', 'NW', 'WS', 'WS', 'S', 'S', 'S', 'ES', 'ES', 'ES', 'ES', 'ES'],['E', 'E', 'NE', 'NE', 'NE', 'N', 'N', 'W', 'WS', 'WS', 'WS', 'WS', 'N', 'N', 'W', 'WS', 'WS', 'S', 'S', 'S', 'ES', 'ES', 'ES', 'ES'],['NE', 'NE', 'NE', 'NE', 'N', 'N', 'W', 'W', 'WS', 'WS', 'S', 'N', 'N', 'N', 'W', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'E', 'E', 'E'],[ 'NE', 'NE', 'NE', 'NE', 'NE', 'N', 'NW', 'W', 'W', 'WS', 'WS', 'WS', 'N', 'N', 'W', 'WS', 'WS', 'S', 'S', 'S', 'ES', 'ES', 'ES', 'E'],[ 'E', 'NE', 'NE', 'NE', 'N', 'N', 'NW', 'W', 'W', 'WS', 'WS', 'WS', 'NE', 'N', 'NW', 'WS', 'WS', 'WS', 'S', 'S', 'S', 'ES', 'E', 'ES', 'E'],['E', 'NE', 'NE', 'NE', 'NE', 'N', 'NW', 'W', 'W', 'WS', 'WS', 'NE', 'N', 'NW', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'ES', 'ES', 'ES'],['E', 'NE', 'NE', 'NE', 'NE', 'NW', 'W', 'W', 'WS', 'S', 'S', 'NE', 'N', 'NW', 'W', 'WS', 'WS', 'S', 'S', 'ES', 'ES', 'ES', 'ES', 'ES', 'ES'],['NE', 'NE', 'NE', 'N', 'N', 'NW', 'W', 'WS', 'WS', 'S', 'N', 'N', 'NW', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'E', 'ES', 'ES', 'ES'],['NE', 'NE', 'NE', 'NE', 'NE', 'N', 'NE', 'N', 'NW', 'W', 'WS', 'WS', 'WS', 'WS', 'N', 'N', 'N', 'W', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'ES', 'ES', 'ES', 'ES'],['NE', 'E', 'NE', 'NE', 'NE', 'W', 'W', 'WS', 'WS', 'WS', 'N', 'N', 'NW', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'ES', 'E', 'ES', 'ES'],[ 'WS', 'E', 'E', 'E', 'NE', 'NE', 'W', 'WS', 'W', 'WS', 'WS', 'WS', 'NE', 'N', 'NW', 'W', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'E', 'ES', 'ES', 'E', 'E'],[ 'NE', 'E', 'NE', 'NE', 'W', 'W', 'WS', 'WS', 'NE', 'NE', 'NW', 'W', 'WS', 'WS', 'S', 'S', 'ES', 'ES', 'S', 'S', 'ES'],['NE', 'NE', 'NE', 'NE', 'NE', 'NE', 'N', 'W', 'W', 'WS', 'WS', 'WS', 'N', 'NE', 'N', 'W', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'E', 'ES', 'ES', 'E'],['E', 'NE', 'NE', 'NE', 'NE', 'W', 'W', 'WS', 'WS', 'WS', 'NE', 'NE', 'N', 'W', 'WS', 'WS', 'WS', 'S', 'S', 'E', 'E', 'E', 'E', 'E'],[ 'ES', 'E', 'NE', 'NE', 'NE', 'N', 'NW', 'W', 'W', 'WS', 'WS', 'WS', 'NE', 'N', 'W', 'WS', 'WS', 'WS', 'S', 'ES', 'ES', 'ES', 'S', 'ES', 'ES', 'ES'],['NE', 'E', 'NE', 'NE', 'NW', 'W', 'W', 'WS', 'WS', 'WS', 'WS', 'N', 'N', 'N', 'W', 'WS', 'WS', 'WS', 'WS', 'S', 'E', 'E', 'E', 'ES', 'ES'],['NE', 'NE', 'NE', 'N', 'NW', 'W', 'W', 'WS', 'WS', 'WS', 'NE', 'NE', 'N', 'W', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'E', 'S'],[ 'NE', 'NE', 'NE', 'NE', 'N', 'NW', 'W', 'WS', 'WS', 'WS', 'WS', 'N', 'N', 'N', 'W', 'WS', 'WS', 'WS', 'S', 'S', 'E', 'ES', 'ES', 'ES'],['NE', 'NE', 'NE', 'NE', 'NE', 'N', 'NW', 'W', 'W', 'WS', 'WS', 'WS', 'S', 'NE', 'N', 'N', 'W', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'E', 'ES', 'ES', 'S', 'ES', 'E'],['NE', 'NE', 'NE', 'NE', 'NE', 'N', 'W', 'W', 'WS', 'WS', 'WS', 'NE', 'N', 'NW', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'E', 'ES', 'E'],[ 'NE', 'NE', 'NE', 'NE', 'N', 'NW', 'W', 'WS', 'WS', 'WS', 'S', 'NE', 'N', 'NW', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'ES', 'ES', 'ES', 'ES', 'E'],['N', 'NE', 'NE', 'NE', 'NE', 'N', 'NW', 'W', 'WS', 'WS', 'WS', 'NE', 'N', 'W', 'WS', 'WS', 'WS', 'S', 'S', 'ES', 'ES', 'ES', 'ES', 'ES', 'ES', 'E'],[ 'NE', 'NE', 'NE', 'NE', 'NE', 'W', 'WS', 'WS', 'WS', 'WS', 'NE', 'NE', 'NW', 'W', 'WS', 'WS', 'S', 'S', 'ES', 'E', 'ES', 'ES', 'ES']],
        'upDownT':[['N', 'N', 'N', 'N', 'N', 'N', 'N', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'W', 'W', 'W', 'W', 'W', 'W', 'NW', 'NE', 'E', 'E', 'E', 'E', 'E', 'NE', 'E', 'E', 'E', 'E'],['N', 'N', 'N', 'N', 'N', 'N', 'NW', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'WS', 'W', 'W', 'W', 'W', 'W', 'E', 'NE', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],['NW', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'WS', 'WS', 'W', 'WS', 'W', 'W', 'W', 'W', 'E', 'E', 'E', 'E', 'NE', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],['ES', 'NE', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'WS', 'WS', 'WS', 'W', 'W', 'NW', 'NE', 'NE', 'NE', 'E', 'E', 'E'],['ES', 'NE', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'WS', 'WS', 'WS', 'W', 'W', 'NW', 'NE', 'NE', 'NE', 'E', 'E', 'E'],['ES', 'NE', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'WS', 'WS', 'WS', 'W', 'W', 'NW', 'NE', 'NE', 'NE', 'E', 'E', 'E'],['ES', 'NE', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'WS', 'WS', 'WS', 'W', 'W', 'NW', 'NE', 'NE', 'NE', 'E', 'E', 'E'],['ES', 'NE', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'WS', 'WS', 'WS', 'W', 'W', 'NW', 'NE', 'NE', 'NE', 'E', 'E', 'E'],['WS', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'WS', 'W', 'W', 'W', 'W', 'E', 'E', 'E', 'NE', 'NE', 'NE', 'NE'],[ 'S', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'S', 'S', 'S', 'S', 'S', 'S', 'WS', 'WS', 'W', 'WS', 'W', 'NW', 'NE', 'NE', 'E', 'E', 'E', 'E', 'E'],['N', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'S', 'WS', 'W', 'W', 'WS', 'WS', 'W', 'N', 'NE', 'NE', 'E', 'E', 'E', 'E', 'E'],['ES', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'NW', 'WS', 'S', 'S', 'S', 'S', 'S', 'S', 'WS', 'WS', 'WS', 'W', 'WS', 'W', 'W', 'W', 'NE', 'NE', 'NE', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],['N', 'N', 'N', 'NE', 'N', 'NW', 'WS', 'WS', 'WS', 'S', 'S', 'WS', 'W', 'W', 'W', 'WS', 'NE', 'NE', 'E', 'E', 'E', 'E'],['ES', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'NW', 'WS', 'S', 'S', 'S', 'S', 'S', 'S', 'WS', 'WS', 'WS', 'W', 'WS', 'W', 'W', 'W', 'NE', 'NE', 'NE', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],['N', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'WS', 'W', 'WS', 'W', 'N', 'NE', 'E', 'E', 'NE', 'NE', 'E'],['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'WS', 'S', 'S', 'S', 'S', 'S', 'WS', 'WS', 'WS', 'WS', 'W', 'NE', 'NE', 'E', 'E', 'E', 'E', 'E'],['W', 'N', 'N', 'N', 'N', 'N', 'N', 'S', 'S', 'S', 'S', 'S', 'WS', 'WS', 'W', 'W', 'NE', 'NE', 'E', 'E', 'E', 'E', 'E'],['W', 'WS', 'N', 'N', 'N', 'N', 'N', 'N', 'NW', 'S', 'S', 'S', 'S', 'S', 'WS', 'W', 'W', 'W', 'W', 'NE', 'NE', 'NE', 'E', 'NE', 'NE', 'NE', 'E'],['N', 'N', 'N', 'N', 'N', 'NW', 'S', 'S', 'S', 'S', 'S', 'WS', 'W', 'WS', 'W', 'N', 'NE', 'E', 'E', 'E', 'E', 'NE'],['W', 'NW', 'N', 'N', 'N', 'N', 'N', 'S', 'S', 'S', 'S', 'S', 'WS', 'W', 'W', 'W', 'W', 'NE', 'E', 'E', 'E', 'E', 'E', 'NE'],['E', 'E', 'N', 'N', 'N', 'N', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'WS', 'W', 'W', 'W', 'W', 'NE', 'NE', 'E', 'E', 'E', 'E', 'E'],['N', 'N', 'N', 'N', 'N', 'NW', 'WS', 'S', 'WS', 'S', 'S', 'S', 'S', 'W', 'W', 'W', 'W', 'W', 'NE', 'NE', 'E', 'E', 'E', 'E', 'E'],[ 'N', 'N', 'N', 'N', 'NW', 'WS', 'WS', 'S', 'S', 'S', 'WS', 'W', 'W', 'W', 'NE', 'E', 'E', 'E', 'E'],[ 'E', 'N', 'N', 'NE', 'NE', 'N', 'N', 'WS', 'S', 'S', 'S', 'S', 'S', 'WS', 'W', 'WS', 'W', 'W', 'NE', 'NE', 'E', 'E', 'NE', 'NE', 'NE'],[ 'W', 'N', 'NE', 'NE', 'NE', 'N', 'N', 'WS', 'S', 'WS', 'WS', 'S', 'S', 'WS', 'WS', 'WS', 'WS', 'W', 'NE', 'NE', 'E', 'E', 'E', 'E'],['NW', 'N', 'N', 'NW', 'NW', 'NW', 'S', 'S', 'S', 'S', 'S', 'W', 'W', 'W', 'W', 'W', 'E', 'E', 'E', 'E', 'E', 'E', 'E']]
      },
      'getVideoElement':function(){
        var element=root.document.createElement('video');
        element.style.position='absolute';
        element.style.left='-1000000000em';
        element.style.top='-10000000em';
        element.style.width='200px';
        element.style.height='150px';
        element.autoplay=true;
        element.preload=true;
        element.muted=true;
        element.looped=true;
        root.document.body.appendChild(element);
        return element;
      },
      'opticalFlow':{
        'width':200,
        'height':150
      },
      'onMove':[],
      'minimalMovementVectorLength':0.05,
      'continousTracking':true
    };
    for (var attrname in providedConfig)  {
      this.config[attrname] = providedConfig[attrname];
    }

    var hmmModel=new root.MultiGestureHMM(this.config.hmm);
    var opticalFlowTracker=new OpticalFlowTracker(this.config.opticalFlow);

    var triggerOnMove=function(directionSymbol){
      this.config.onMove.forEach(function(callback){callback(directionSymbol);});
    }.bind(this);

    this.teach=function(gestureName,gesture){
      hmmModel.teach(gestureName,gesture);
    };


    this.onDetect=function(callback,gestureName){
      hmmModel.onDetect(callback,gestureName);
    };

    this.onMove=function(callback){
      this.config.onMove.push(callback);
    };

    this.startTracking=function(){
     root.tracking.track(this.config.getVideoElement(), opticalFlowTracker, { camera: true });
   };

   this.stopContinousGestureStracking=function(){
     this.config.continousTracking=false;
   };

   this.startContinousGestureStracking=function(){
     this.config.continousTracking=true;
   };

   for(var gestureName in this.config.gestures){
    this.teach(gestureName,this.config.gestures[gestureName]);
  }

  opticalFlowTracker.on('track',function(data){
    var movementVector=[data.xAvg,data.yAvg];
    var vectorLength=Math.sqrt(movementVector[0]*movementVector[0]+movementVector[1]*movementVector[1]);

    if(vectorLength>this.config.minimalMovementVectorLength){
     var directionAngle=Math.atan2(movementVector[1],movementVector[0]);
     var directionSymbol=discretizeDirection(directionAngle);
     triggerOnMove(directionSymbol);
     if(this.config.continousTracking){
       hmmModel.newSymbol(directionSymbol);
     }
   }
 }.bind(this));

};


// Version.
GestureRecognition.VERSION = '0.0.1';


// Export to the root, which is probably `window`.
root.GestureRecognition = GestureRecognition;


}(this));
