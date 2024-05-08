//canvas variables
let cw = 1920;
let ch = 800;
let ctx;

//camera
let cam = 0;

//player
let player;

//fade/level transition variables
let blackscreen;
let f = 255;
let l = 0;
let hitDoor = false;
let fadeDone = false;

//rooms
let rooms = [];
let hallway;
let livingRoom;
let kitchen;
let hallway2;
let backyard;
let currentRoom = null;
let nextRoom = null;

//hearts
let totalHeartsCreated = 0;
let hearts = [];
let heartsCaught = 0;

//enemies
let enemies = [];
let ghost;
let witch;
let clown;
let step = 3;
let dir = 1;
let task_done = false;
let last_done = 0;

//stores state of keys
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
};
let health = 400;
let maxHealth = 400;

let font;

let startGame = false;
let isDead = false;
let playButton;
let openingScene;
let gameOver;
let doormessage = "exit locked";

let levelfloor = 640;

let backgroundMusic;

function preload() {
  font = loadFont("./assets/prstart.ttf");
  backgroundMusic = loadSound("./assets/creepy music.mp3");

  //load player images
  playerImgs = {
    idleRight: loadImage("./assets/playerIdle2.gif"),
    idleLeft: loadImage("./assets/playerIdle.gif"),
    runRight: loadImage("./assets/playerRun2.gif"),
    runLeft: loadImage("./assets/playerRun.gif"),
  };

  //load ghost's images
  ghostImgs = {
    idleRight: loadImage("./assets/ghost idle2.gif"),
    idleLeft: loadImage("./assets/ghost idle.gif"),
    moveRight: loadImage("./assets/ghost idle2.gif"),
    moveLeft: loadImage("./assets/ghost idle.gif"),
    runRight: loadImage("./assets/ghost idle2.gif"),
    runLeft: loadImage("./assets/ghost idle.gif"),
  };

  //load witch's images
  witchImgs = {
    idleRight: loadImage("./assets/witch idle2.gif"),
    idleLeft: loadImage("./assets/witch idle.gif"),
    moveRight: loadImage("./assets/witch scream2.gif"),
    moveLeft: loadImage("./assets/witch scream.gif"),
    runRight: loadImage("./assets/witch scream2.gif"),
    runLeft: loadImage("./assets/witch scream.gif"),
  };

  //load clown's images
  clownImgs = {
    idleRight: loadImage("./assets/clownIdle.gif"),
    idleLeft: loadImage("./assets/clownIdle2.gif"),
    moveRight: loadImage("./assets/clownWalking2.gif"),
    moveLeft: loadImage("./assets/clownWalking.gif"),
    runRight: loadImage("./assets/clown running2.gif"),
    runLeft: loadImage("./assets/clown running.gif"),
  };

  //load room images
  hallwayImg = loadImage("./assets/hallway.gif");
  livingRoomImg = loadImage("./assets/livingroom.png");
  kitchenImg = loadImage("./assets/kitchen.png");
  hallway2Img = loadImage("./assets/hallway2.png");
  nightimg = loadImage("./assets/night scene2.png");

  //load enemies and heart
  heartimg = loadImage("./assets/heart.png");
  ghostImg = loadImage("./assets/ghost idle.gif");
  witchImg = loadImage("./assets/witch idle.gif");
}

function createHallway() {
  //create the rooms and their images
  hallway = new Room(0, 0, hallwayImg);
  hallway.addOverlay(loadImage("./assets/overlay1.png"));
}

function createPlayer() {
  player = new Player();
  player.load(playerImgs);
}

function createRooms() {
  //create the rooms and their images
  hallway = new Room(0, 0, hallwayImg);
  hallway.addOverlay(loadImage("./assets/overlay1.png"));

  livingRoom = new Room(0, 0, livingRoomImg);
  livingRoom.addOverlay(loadImage("./assets/overlay2.png"));
  livingRoom.addOverlay(loadImage("./assets/overlay3.png"));

  kitchen = new Room(0, 0, kitchenImg);

  hallway2 = new Room(0, 0, hallway2Img);

  backyard = new Room(0, 0, nightimg);

  //create room's attributes
  let parsedColls = hallwayCollisions.parse2D();
  const hallwayLeftWalls = parsedColls.createObjectsFrom2D()[0];
  const hallwayRightWalls = parsedColls.createObjectsFrom2D()[1];
  const hallwayObstacles = parsedColls.createObjectsFrom2D()[2];
  const hallwayDoors = [
    new Door(284, 363, 220, 280, livingRoom),
    new Door(1920 - 300, 0, 300, 640, kitchen),
  ];

  parsedColls = livingroomCollisions.parse2D();
  const lrleftWalls = parsedColls.createObjectsFrom2D()[0];
  const lrRightwalls = parsedColls.createObjectsFrom2D()[1];
  const lrObstacles = parsedColls.createObjectsFrom2D()[2];
  const lrDoors = [new Door(0, 0, 100, 640, hallway)];

  parsedColls = kitchenCollisions.parse2D();
  const kLeftWalls = parsedColls.createObjectsFrom2D()[0];
  const kRightWalls = parsedColls.createObjectsFrom2D()[1];
  const kObstacles = parsedColls.createObjectsFrom2D()[2];
  const kDoors = [
    new Door(0, 0, 100, 640, hallway),
    new Door(1920 - 300, 0, 300, 640, hallway2),
  ];

  parsedColls = hallway2Collisions.parse2D();
  const h2LeftWalls = parsedColls.createObjectsFrom2D()[0];
  const h2RightWalls = parsedColls.createObjectsFrom2D()[1];
  const h2Obstacles = parsedColls.createObjectsFrom2D()[2];
  const h2Doors = [new Door(0, 0, 100, 640, kitchen)];

  //no obstacles for backyard

  //add room's attributes
  hallway.addWalls(hallwayLeftWalls, hallwayRightWalls);
  hallway.addDoors(hallwayDoors);
  hallway.addObstacles(hallwayObstacles);

  livingRoom.addWalls(lrleftWalls, lrRightwalls);
  livingRoom.addDoors(lrDoors);
  livingRoom.addObstacles(lrObstacles);

  kitchen.addWalls(kLeftWalls, kRightWalls);
  kitchen.addDoors(kDoors);
  kitchen.addObstacles(kObstacles);

  hallway2.addWalls(h2LeftWalls, h2RightWalls);
  hallway2.addDoors(h2Doors);
  hallway2.addObstacles(h2Obstacles);

  backyard.addWalls([], []);
  backyard.addDoors([]);
  backyard.addObstacles([]);

  //push rooms to rooms array
  rooms.push(hallway);
  rooms.push(livingRoom);
  rooms.push(kitchen);
  rooms.push(hallway2);
  rooms.push(backyard);
}

function createHearts() {
  //setup between 0-2 hearts for the hallway
  let randomhallwaycount = floor(random(3));
  for (let i = 0; i < randomhallwaycount; i++) {
    // let randomRoom = rooms[floor(random(rooms.length))]
    let randomBlock =
      hallway.obstacles[floor(random(hallway.obstacles.length))];
    // console.log(randomBlock)

    //assign heart's pos to a random block's pos
    let hx = randomBlock.pos.x;
    let hy = randomBlock.pos.y - 60 - 10; //height - ydiff
    heart = new Heart(heartimg, hx, hy, hallway);

    hearts.push(heart);
  }

  //setup between 3-5 hearts for the living room
  let randomlrcount = round(random(3, 6));
  console.log(randomlrcount);
  for (let i = 0; i < randomlrcount; i++) {
    // let randomRoom = rooms[floor(random(rooms.length))]
    let randomBlock =
      livingRoom.obstacles[floor(random(livingRoom.obstacles.length))];
    // console.log(randomBlock)

    //assign heart's pos to a random block's pos
    let hx = randomBlock.pos.x;
    let hy = randomBlock.pos.y - 60 - 10; //height-ydiff
    heart = new Heart(heartimg, hx, hy, livingRoom);

    hearts.push(heart);
  }

  //setup between 2-5 hearts for the kitchen
  let randomkitcount = round(random(2, 6));
  for (let i = 0; i < randomkitcount; i++) {
    // let randomRoom = rooms[floor(random(rooms.length))]
    let randomBlock =
      kitchen.obstacles[floor(random(kitchen.obstacles.length))];
    // console.log(randomBlock)

    //assign heart's pos to a random block's pos
    let hx = randomBlock.pos.x;
    let hy = randomBlock.pos.y - 60 - 10; //height - ydiff
    heart = new Heart(heartimg, hx, hy, kitchen);

    hearts.push(heart);
  }

  totalHeartsCreated = randomhallwaycount + randomlrcount + randomkitcount;
}

function createEnemies() {
  //create enemy objects
  ghost = new Enemy(700, 640 - 32 * 6, livingRoom);
  witch = new Enemy(700, 640 - 32 * 8, kitchen);
  clown = new Enemy(700, 640 - 32 * 8, hallway2);
  ghost.load(ghostImgs);
  witch.load(witchImgs);
  clown.load(clownImgs);

  //push to enemies array
  enemies.push(ghost);
  enemies.push(witch);
  enemies.push(clown);
}
function setup() {
  canvas = createCanvas(1520, 822);
  ctx = canvas.drawingContext;
  openingScene = loadImage("./assets/opening scene.png");
  gameOver = loadImage("./assets/gameover.png");
  blackscreen = loadImage("./assets/black.png");

  playButton = createImg("./assets/button.png", "button");
  playButton.position(150, 600);
  playButton.mousePressed(() => (startGame = true));
  createPlayer();
  createRooms();
  createHearts();
  createEnemies();

  //set default rooms
  currentRoom = hallway;
  nextRoom = livingRoom;

  //loop music
  backgroundMusic.loop();
  backgroundMusic.setVolume(0.09);
}

function displayHearts() {
  //draw hearts
  if (hearts.length > 0) {
    for (let i = 0; i < hearts.length; i++) {
      let heart = hearts[i];
      if (currentRoom == heart.room) {
        heart.display();
      }
    }
  } else {
    //game is finished, player can leave
    console.log(heartsCaught);
  }
}

function displayEnemies() {
  //draw enemy
  if (enemies.length > 0) {
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      if (currentRoom == enemy.room) {
        enemy.update();
        enemy.display();
      }
    }
  }
}

function displayHealth() {
  healthbarcol = color(235, 38, 140);
  health = min(maxHealth, health);

  if (health >= 150 && health <= 400) {
    healthbarcol = color(235, 38, 140);
  } else if (health >= 90 && health < 150) {
    healthbarcol = color(255, 255, 0);
  } else {
    healthbarcol = color(255, 0, 0);
  }

  //draws the health bar, updating with health variable
  noStroke();
  fill(healthbarcol);
  w = map(health, 0, maxHealth, 0, 200);
  if (health != 0 && w > 0) rect(29, 35, w - 4, 16);
}

//doesn't work
function displayHeartCount() {
  image(heartimg, 1400, 0, 50, 50);
  textSize(25);
  textFont(font);
  strokeWeight(20);
  fill(205, 0, 90);
  text("" + heartsCaught, 1460, 38);
}

//stops and moves enemies + switches direction (not from walls)
function duration() {
  const delay = random(1500, 40000); //ms
  if (!task_done) {
    /* do something */
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      if (currentRoom == enemy.room) {
        enemy.update(); //calls update after duration is done
      }
    }
    task_done = true;
    last_done = millis();
  } else {
    if (millis() - last_done > delay) {
      switchDirection();
      task_done = false;
    }
  }
}
function switchDirection() {
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    if (currentRoom == enemy.room) {
      if (enemy.pos.x > 0 + 30 && enemy.pos.x < width - 30) {
        enemy.dir = enemy.dir * -1;
      }
    }
  }
}

let fadeDone2 = false;
function draw() {
  getAudioContext().resume();

  background(0);
  resizeCanvas(windowWidth, windowHeight);

  if (startGame === true) {
    if (fadeDone2 == false) {
      fadeDone2 = fade(openingScene, currentRoom.img);
    }
    //remove button
    playButton.remove();

    //check health
    if (health <= 0) {
      isDead = true;
      console.log(isDead);
    }

    if (isDead != true) {
      if (totalHeartsCreated == heartsCaught) {
        console.log("exit is open");
        fill(0, 255, 0);
        hallway2.doors.push(new Door(1920 - 300, 0, 300, 640, backyard));
        if (currentRoom == backyard) {
          levelfloor = 640;
        }
        doormessage = "exit is open";
      }
      //display (fixed) objects after camera move (translation)
      push();
      translate(cam, 0);
      currentRoom.display();
      // currentRoom.displayBlocks();
      player.display();
      duration();
      displayEnemies();
      displayHearts();
      pop();

      //let user know if they can exit game (collected all the hearts)
      text(doormessage, 500, 60);

      //display stats after camera move to follow the player across the screen
      displayHealth();

      // displayHeartCount
      image(heartimg, 1400, 25, 50, 50);
      textSize(25);
      textFont(font);
      strokeWeight(20);
      fill(205, 0, 90);
      text("" + heartsCaught, 1460, 60);

      //move player on x-axis (more smooth)
      player.velocity.x = 0;
      if (keys.a.pressed) player.velocity.x = -10;
      if (keys.d.pressed) player.velocity.x = 10;

      //listen for room change and change levels
      changeLevels();

      //detect walls, floors, obstacles etc
      detect();

      //update camera position on x-axis
      scroll();
      return;
    } else {
      console.log(windowWidth, windowHeight);
      image(gameOver, 0, 0);
      console.log("change");
    }
  } else {
    if (startGame === false) {
      image(openingScene, 0, 0);
    }
  }
}

function scroll() {
  if (player.pos.x > 350 && player.pos.x < 1220) {
    cam = -player.pos.x - -350; //speed of camera
  }
}

function detect() {
  player.pos.x += player.velocity.x;
  detectWalls();
  detectDoors();
  detectFloor();
  detectObstacles();
  detectHearts();
  detectHearts();
  detectEnemies();
}

//check against hitbox for detection adjusting for actual vs sprite size
function detectWalls() {
  //check for left walls
  if (currentRoom.leftWalls.length != 0) {
    //check horizontal wall collision
    for (let i = 0; i < currentRoom.leftWalls.length; i++) {
      let block = currentRoom.leftWalls[i];

      //check if hitting left wall
      if (
        player.pos.x + player.hitbox.xdiff <=
        block.pos.x //wall is a line not a block, this is a buffer amount
      ) {
        // console.log("hit wall");

        //kill velocity and reassign player pos
        player.velocity.x = 0;
        player.pos.x = block.pos.x - player.hitbox.xdiff;
        break;
      }
    }
  }

  if (currentRoom.rightWalls.length != 0) {
    //check horizontal wall collision
    for (let i = 0; i < currentRoom.rightWalls.length; i++) {
      let block = currentRoom.rightWalls[i];
      //check if hitting right wall
      if (
        player.pos.x + (player.width - player.hitbox.xdiff) >=
        block.pos.x + block.width
      ) {
        // console.log("hit wall");

        //kill velocity and reassign player pos
        player.velocity.x = 0;
        player.pos.x =
          block.pos.x + block.width - player.width + player.hitbox.xdiff;
        break;
      }
    }
  }
}

function detectDoors() {
  //check door collision
  if (currentRoom.doors.length != 0) {
    //check horizontal wall collision
    for (let i = 0; i < currentRoom.doors.length; i++) {
      let door = currentRoom.doors[i];
      //check if it hits left or right
      if (
        player.pos.x + player.hitbox.xdiff >= door.pos.x &&
        player.pos.x + player.width - player.hitbox.xdiff <=
          door.pos.x + door.width
      ) {
        console.log("in between");
        if (keys.w.pressed === true) {
          nextRoom = door.openTo;
          hitDoor = true;
          break;
        }
      }
    }
  }
}

function detectFloor() {
  //checks floor collision
  player.pos.y += player.velocity.y;
  player.sides.bottom = player.pos.y + player.height;

  if (player.sides.bottom + player.velocity.y + 1 < levelfloor) {
    player.velocity.y += player.gravity;
  } else {
    player.velocity.y = 0;
    player.pos.y = levelfloor - player.height + 1; //small adjustment for bottom
  }
}

function detectObstacles() {
  //check for obstacles
  if (currentRoom.obstacles.length != 0) {
    //check horizontal wall collision
    for (let i = 0; i < currentRoom.obstacles.length; i++) {
      let block = currentRoom.obstacles[i];

      if (
        player.pos.x + player.width - player.hitbox.xdiff >= block.pos.x &&
        player.pos.x + player.width - (player.hitbox.xdiff + 30) <=
          block.pos.x + block.width
      ) {
        // 90 = playerdiff + 30 (for feet)
        // console.log("hit");
        //check if bottom of player is ontop obstacle not underneath
        if (
          player.pos.y + player.height + player.velocity.y >= block.pos.y &&
          player.pos.y + player.height + player.velocity.y <=
            block.pos.y + block.height
        ) {
          console.log(player.pos.y + player.height);
          player.velocity.y = 0;
          player.pos.y = block.pos.y - player.height;
          break;
        }
      }
    }
  }
}

function detectHearts() {
  //check for heart collision
  for (let i = 0; i < hearts.length; i++) {
    let heart = hearts[i];
    if (currentRoom == heart.room) {
      //check if player consumed heart
      if (
        heart.pos.x + heart.hitbox.xdiff >=
          player.pos.x + player.hitbox.xdiff &&
        player.pos.x + player.width - player.hitbox.xdiff >=
          heart.pos.x + heart.width - heart.hitbox.xdiff
      ) {
        // console.log('hit heartx')
        if (
          heart.pos.y + heart.height - heart.hitbox.ydiff >=
            player.pos.y + player.hitbox.ydiff &&
          player.pos.y + player.height >=
            heart.pos.y + heart.height - heart.hitbox.ydiff
        ) {
          // console.log('hit heart y')
          hearts.splice(i, 1);
          displayHearts();
          heartsCaught++;
        }
      }
    }
  }
}

function detectEnemies() {
  //check for enemy collision
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    if (currentRoom == enemy.room) {
      if (
        enemy.pos.x <= player.pos.x + player.width - player.hitbox.xdiff &&
        enemy.pos.x + enemy.width >= player.pos.x + player.hitbox.xdiff &&
        enemy.pos.y + enemy.height >= player.pos.y + player.hitbox.ydiff &&
        enemy.pos.y <= player.pos.y + player.height - player.hitbox.ydiff
      ) {
        //decrease player health
        health -= 4;
      }
    }
  }
}

function changeLevels() {
  if (hitDoor == false) {
    return;
  } else {
    fadeDone = false;
    console.log("entering");
    cam = 0;
    if (nextRoom == backyard) {
      resizeCanvas(windowWidth, windowHeight);
    }
    fadeDone = fade(currentRoom.img, nextRoom.img);
    if (fadeDone == true) {
      player.velocity.x = 0;
      player.velocity.y = 0;
      player.pos.x = 200;
      player.pos.y = 640 - player.height;
      // player.img = player.player.idleRight;
      // player.isLeft = false;
      // player.isRight = false;
      // player.isIdleLeft = false;
      // player.isIdleRight = true;
      player.display();
      currentRoom = nextRoom;
      hitDoor = false;
    }
  }
}
//function that fades between levels
function fade(img1, img2) {
  // compute fadeIn(f)
  f -= 8;

  // compute fadeOut
  l += 4;

  background(0);

  // use fade in / out values to tint
  tint(255, f);
  image(img1, 0, 0);

  tint(255, l);
  image(blackscreen, 0, 0);

  //control fade in timing and return true when fade is done
  if (l >= 255) {
    image(img2, 0, 0);
    l = 0;
    f = 255;
    return true;
  }

  //else return false
  return false;
}
