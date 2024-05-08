function keyPressed() {
    if (keyCode == 87) {
      keys.w.pressed = true;
      if (player.velocity.y == 0) {
        player.velocity.y = -35;
      }
    } 
    else if (keyCode == 83) {
      keys.s.pressed = true;
      player.velocity.y = 35;
    }
    else if (keyCode == 65) {
      keys.a.pressed = true;
      keycode = 65;
    }else if (keyCode == 68) {
      keys.d.pressed = true;
    }
  }
  
  function keyReleased() {
    if (keyCode == 65) {
      keys.a.pressed = false;
      player.isIdleLeft = true;
      player.isIdleRight = false;

      player.velocity.x = 0;
    }else if (keyCode == 68) {
      keys.d.pressed = false;
      player.isIdleRight = true;
      player.isIdleLeft = false;

      player.velocity.x = 0;
    }
    else if (keyCode == 87) {
      keys.w.pressed = false;
  
    } 
  }