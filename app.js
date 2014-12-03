function concatData(id, data) {
      return id + ": " + data + "<br>";
    }
    
    function getFingerName(fingerType) {
      switch(fingerType) {
        case 0:
          return 'Thumb';
        break;
    
        case 1:
          return 'Index';
        break;
    
        case 2:
          return 'Middle';
        break;
    
        case 3:
          return 'Ring';
        break;
    
        case 4:
          return 'Pinky';
        break;
      }
    }
    function dot(x1, y1, z1, x2, y2, z2) {
      return x1*x2 + y1*y2 + z1*z2;
    }
    function squareItself(number) {
      //console.log("SquareItself is "+ number*number);
      return Math.pow(number, 2);
    }
    function getFingerSegmentDist(x1, y1, z1, x2, y2, z2) {
      var x = x1 - x2;
      var y = y1 - y2;
      var z = z1 - z2;
      return Math.sqrt(squareItself(x) + squareItself(y) + squareItself(y));
    }
    function getFingerAngle(a, b, c) {
      //console.log(a + " " + b + " " + c );
      return Math.acos((squareItself(a) + squareItself(b) - squareItself(c)) / (2*a*b));
    }
    function concatJointPosition(id, position) {
      return id + ": " + position[0] + ", " + position[1] + ", " + position[2] + "<br>";
    }
    var output = document.getElementById('output');
    var frameString = "", handString = "", fingerString = "", calcString = "";
    var hand, finger;
    
    // Leap.loop uses browser's requestAnimationFrame
    var options = { enableGestures: true };
    
    // Main Leap Loop
    Leap.loop(options, function(frame) {
      frameString = concatData("frame_id", frame.id);
      frameString += concatData("num_hands", frame.hands.length);
      frameString += concatData("num_fingers", frame.fingers.length);
      frameString += "<br>";
    
      // Showcase some new V2 features
      for (var i = 0, len = frame.hands.length; i < len; i++) {
        hand = frame.hands[i];
        handString = concatData("hand_type", hand.type);
        handString += concatData("confidence", hand.confidence);
        handString += concatData("pinch_strength", hand.pinchStrength);
        handString += concatData("grab_strength", hand.grabStrength);
    
        handString += '<br>';
    
        // Helpers for thumb, pinky, etc.
        fingerString = concatJointPosition("finger_thumb_dip", hand.thumb.dipPosition);

        // pip and mcp
        // mcp and carp
        // pip and carp

        var index_dip = hand.indexFinger.dipPosition;
        var index_pip = hand.indexFinger.pipPosition;
        var index_mcp = hand.indexFinger.mcpPosition;
        var index_car = hand.indexFinger.carpPosition;
        // console.table(index_dip);
        // console.table(index_pip);
        // console.table(index_mcp);

        var indexFingerSeg1 = getFingerSegmentDist(index_pip[0], index_pip[1], index_pip[2], index_mcp[0], index_mcp[1], index_mcp[2]);
        var indexFingerSeg2 = getFingerSegmentDist(index_mcp[0], index_mcp[1], index_mcp[2], index_car[0], index_car[1], index_car[2]);
        var indexFingerSeg3 = getFingerSegmentDist(index_pip[0], index_pip[1], index_pip[2], index_car[0], index_car[1], index_car[2]);
        //console.log(indexFingerSeg1 + " " + indexFingerSeg2 + " " + indexFingerSeg3);
        // for (var i = 0; i < 3; i++) {
        //   console.log(" index dip :"+ i + "| " + index_dip[i] 
        //             + " index pip :"+ i + "| " + index_pip[i] 
        //             + " index mcp :"+ i + "| " + index_mcp[i] );
        // }
        
        var angle = getFingerAngle(indexFingerSeg1, indexFingerSeg2, indexFingerSeg3)* 180 / Math.PI;
        var normalized = (angle > 170) ? 1: angle / 170;
        
        
        console.log(angle + " degrees | normalized value: " + normalized);
        //console.log('dot product of dip and mcp: ' + dotProductDipMcp);

        fingerString += "<hr />"
        // for (var j = 0, len2 = hand.fingers.length; j < len2; j++) {
        //   finger = hand.fingers[j];
        //   fingerString += concatData("finger_type", finger.type) + " (" + getFingerName(finger.type) + ") <br>";
        //   fingerString += concatJointPosition("finger_dip", finger.dipPosition);
        //   fingerString += concatJointPosition("finger_pip", finger.pipPosition);
        //   fingerString += concatJointPosition("finger_mcp", finger.mcpPosition);
        //   fingerString += "<br>";
          
        // }       
        // frameString += handString;
        // frameString += fingerString;
        // frameString += calcString;
      }   
      output.innerHTML = frameString; 
    });