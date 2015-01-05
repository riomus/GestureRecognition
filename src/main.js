/* GestureRecognition main */

// Base function.
var GestureRecognition = function(providedConfig) {
  this.config={
    'hmm':{
      'states':['a','b','c','d','e','f','g','h'],
      'symbols':['E','NE','N','NW','W','WS','S','ES'],
      'startProbability':{'a':0.1,'b':0.1,'c':0.1,'d':0.1,'e':0.1,'f':0.1,'g':0.1,'h':0.1,'i':0.1,'j':0.1}
    },
    'gestures':{
      'right':[["W","W"],["W","W"],["W","W","W"],["W","W","W"],["W","W","W"],["W","W","W"],["WS","W","W"]]
    },
    'getVideoElement':function(){
      var element=root.document.createElement('video');
      element.style.position='absolute';
      element.style.left='-1000000000em';
      element.style.top='-10000000em';
      element.style.width='160px';
      element.style.height='120px';
      element.autoplay=true;
      element.preload=true;
      element.muted=true;
      element.looped=true;
      root.document.body.appendChild(element);
      return element;
    },
    'opticalFlow':{},
    'detect':true,
    'onMove':[],
    'minimalMovementVectorLength':0.05
  };
  for (var attrname in providedConfig)  {
    this.config[attrname] = providedConfig[attrname];
  }

  var hmmModel=new root.MultiGestureHMM(this.config.hmm);
  var opticalFlowTracker=new OpticalFlowTracker(this.config.opticalFlow);
  var gatheringGesture=false;
  var currentlyGatheredGesture=[];
  var gestures=[];

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

  this.clearGatheredGestures=function(){
    gestures=[];
    currentlyGatheredGesture=[];
  };

  this.startGestureGathering=function(){
    gatheringGesture=true;
    currentlyGatheredGesture=[];
  };

  this.stopGestureGathering=function(){
    gatheringGesture=false;
    gestures.push(currentlyGatheredGesture);
  };

  this.teachGatheredGestures=function(gestureName){
    this.teach(gestureName,gestures);
    this.clearGatheredGestures();
  };

  this.startTracking=function(){
   root.tracking.track(this.config.getVideoElement(), opticalFlowTracker, { camera: true });
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

   if(this.config.detect){
     triggerOnMove(directionSymbol);
     hmmModel.newSymbol(directionSymbol);
   }

   if(gatheringGesture){
    currentlyGatheredGesture.push(directionSymbol);
  }
}
}.bind(this));

};


// Version.
GestureRecognition.VERSION = '0.0.1';


// Export to the root, which is probably `window`.
root.GestureRecognition = GestureRecognition;
