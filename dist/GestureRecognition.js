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
      'states':['a','b','c'],
      'symbols':['E','NE','N','NW','W','WS','S','ES'],
      'startProbability':{'a':0.1,'b':0.1,'c':0.1}
    },
    'gestures':{
      'right':[["W","W","W","W","W","W","W","W"],["W","W","W","W","W","W","W","W"],["W","W","W","W","W","W","W","W"],["W","W","W","W","W","W","W","W"],["W","W","W","W","W","WS","W","W"],["W","WS","W","W","W","W","W","W"]]
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
   hmmModel.newSymbol(directionSymbol);
   if(this.config.continousTracking){
     this.hmmModel.newSymbol(directionSymbol);
   }
 }
}.bind(this));

};


// Version.
GestureRecognition.VERSION = '0.0.1';


// Export to the root, which is probably `window`.
root.GestureRecognition = GestureRecognition;


}(this));
