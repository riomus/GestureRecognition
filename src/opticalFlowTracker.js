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

OpticalFlowTracker.VERSION='0.0.3';

root.OpticalFlowTracker=OpticalFlowTracker;
