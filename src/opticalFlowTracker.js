  var OpticalFlowTracker=function(providedConfig){
    this.config={
    };
    for (var attrname in providedConfig)  {
        this.config[attrname] = providedConfig[attrname];
    }
    OpticalFlowTracker.base(this, 'constructor');
  };

  root.tracking.inherits(OpticalFlowTracker, root.tracking.Tracker);

  OpticalFlowTracker.prototype.track = function(pixels,width,height) {
    if(!this.initialized){
      this.config.width=width;
      this.config.height=height;
      this.hornsService=new root.OpticalFlow(this.config);
      this.initialized=true;
    }else{
    this.emit('track',this.hornsService.getFlowData([this.lastFrame,pixels]));
    }

      this.lastFrame=pixels;
  };

OpticalFlowTracker.VERSION='0.0.1';

root.OpticalFlowTracker=OpticalFlowTracker;
