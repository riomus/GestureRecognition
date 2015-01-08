(function(root, undefined) {

  "use strict";


/* OpticalFlow.js main */

// Base function.
var OpticalFlow = function(providedConfig){
    this.config={
      width:640,
      height:480,
      alpha:5,
      iterations:2
    };
    for (var attrname in providedConfig)  {
        this.config[attrname] = providedConfig[attrname];
    }

    var convertToBWFrames=function(frames){
      var framesBW=[];
      for(var frameIndex=0;frameIndex<frames.length;frameIndex++){
        var currentFrame=frames[frameIndex],
        frameBW=new Uint8ClampedArray(currentFrame.length/4);
        var length=+currentFrame.length;
        for(var i=+0,bwPixelIndex=+0;i<length;i+=4,bwPixelIndex++){
          frameBW[bwPixelIndex]=currentFrame[i]* 0.299+currentFrame[i+1]*0.587+currentFrame[i+2]*0.114;
        }
        framesBW[frameIndex]=frameBW;
      }
      return framesBW;
    }.bind(this);



    var calculateIndexFromCoordinatesForBW=function(x,y){
      return (x + y * this.config.width);
    }.bind(this);

    var initializeEmptyFlowMatix=function(xFlow,yFlow){
      var width=+this.config.width;
      var height=+this.config.height;
      for(var x=+0;x<width;x++){
        xFlow[x]=new Float64Array(height);
        yFlow[x]=new Float64Array(height);
        for(var y=+0;y<height;y++){
          xFlow[x][y]=0;
          yFlow[x][y]=0;
        }
      }
    }.bind(this);

    this.getFlowData=function(frames){
      var framesBW=convertToBWFrames(frames);
      var xFlow =[];
      var yFlow =[];
      var xFlowSum=0;
      var yFlowSum=0;
      var width=+this.config.width;
      var height=+this.config.height;
      var itterationsCount=+this.config.iterations;
      initializeEmptyFlowMatix(xFlow,yFlow);
      var eX=[];
      var eY=[];
      var eT=[];
      var x,y;
      for( x=+1;x<width-1;x++){
        eX[x]=new Float64Array(height);
        eY[x]=new Float64Array(height);
        eT[x]=new Float64Array(height);
        for( y=+1;y<height-1;y++){
          eX[x][y] = (framesBW[0][calculateIndexFromCoordinatesForBW(x+1,y+1)]-framesBW[0][calculateIndexFromCoordinatesForBW(x,y+1)]+framesBW[0][calculateIndexFromCoordinatesForBW(x+1,y)]-framesBW[0][calculateIndexFromCoordinatesForBW(x,y)]+framesBW[1][calculateIndexFromCoordinatesForBW(x+1,y+1)]-framesBW[1][calculateIndexFromCoordinatesForBW(x,y+1)]+framesBW[1][calculateIndexFromCoordinatesForBW(x+1,y)]-framesBW[1][calculateIndexFromCoordinatesForBW(x,y)])/4;

          eY[x][y] = (framesBW[0][calculateIndexFromCoordinatesForBW(x,y)]-framesBW[0][calculateIndexFromCoordinatesForBW(x,y+1)]+framesBW[0][calculateIndexFromCoordinatesForBW(x+1,y)]-framesBW[0][calculateIndexFromCoordinatesForBW(x+1,y+1)]+framesBW[1][calculateIndexFromCoordinatesForBW(x,y)]-framesBW[1][calculateIndexFromCoordinatesForBW(x,y+1)]+framesBW[1][calculateIndexFromCoordinatesForBW(x+1,y)]-framesBW[1][calculateIndexFromCoordinatesForBW(x+1,y+1)])/4;

          eT[x][y] = (framesBW[1][calculateIndexFromCoordinatesForBW(x,y+1)]-framesBW[0][calculateIndexFromCoordinatesForBW(x,y+1)]+framesBW[1][calculateIndexFromCoordinatesForBW(x,y)]-framesBW[0][calculateIndexFromCoordinatesForBW(x,y)]+framesBW[1][calculateIndexFromCoordinatesForBW(x+1,y+1)]-framesBW[0][calculateIndexFromCoordinatesForBW(x+1,y+1)]+framesBW[1][calculateIndexFromCoordinatesForBW(x+1,y)]-framesBW[0][calculateIndexFromCoordinatesForBW(x+1,y)])/4;
        }
      }

      for(var itteration=+0;itteration<itterationsCount;itteration++){
        xFlowSum=0;
        yFlowSum=0;
        for( x=+1;x<width-1;x++){
          for( y=+1;y<height-1;y++){
            var Vxbar = (xFlow[x][y-1]+xFlow[x+1][y]+xFlow[x][y+1]+xFlow[x-1][y])/6+(xFlow[x-1][y-1]+xFlow[x+1][x-1]+xFlow[x+1][y+1]+xFlow[x-1][y+1])/12;
            var Vybar = (yFlow[x][y-1]+yFlow[x+1][y]+yFlow[x][y+1]+yFlow[x-1][y])/6+(yFlow[x-1][y-1]+yFlow[x+1][x-1]+yFlow[x+1][y+1]+yFlow[x-1][y+1])/12;
            var temp =(eX[x][y]*Vxbar+eY[x][y]*Vybar+eT[x][y])/(Math.pow(this.config.alpha,2) +Math.pow(eX[x][y],2)+ Math.pow(eY[x][y],2));

            Vxbar=isNaN(Vxbar)?0:Vxbar;
            Vybar=isNaN(Vybar)?0:Vybar;
            temp=isNaN(temp)?0:temp;

            xFlow[x][y] = (Vxbar-eX[x][y]*temp);
            yFlow[x][y] = Vybar-eY[x][y]*temp;

            xFlowSum+=xFlow[x][y];
            yFlowSum+=yFlow[x][y];
          }
        }
      }

      var pixelsCount=(width*height);
      var xAvg=xFlowSum/pixelsCount;
      var yAvg=yFlowSum/pixelsCount;
      return {
        'xFlows':xFlow,
        'yFlows':yFlow,
        'xAvg':xAvg,
        'yAvg':yAvg
      };
    };
  };

// Version.
OpticalFlow.VERSION = '0.0.7';


// Export to the root, which is probably `window`.
root.OpticalFlow = OpticalFlow;


}(this));
