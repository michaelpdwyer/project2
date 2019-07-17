// class gameCSS extends Phaser.Scene {
//     constructor() {
//         super({ key: "gameCSS" });
//     }

//     preload() {
//         this.load.image("sky", "assets/sky.png");
//         this.load.image("ground", "assets/platform.png");
//         this.load.image("star", "assets/html.png");
//         this.load.image("bomb", "assets/bomb.png");
//         this.load.spritesheet("dude", "assets/dude.png", {
//             frameWidth: 32,
//             frameHeight: 48
//         });
//     }

var config2 = {
  type: Phaser.AUTO,
  parent: "gameHere2",
  width: 800,
  height: 608,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var player;
var stars;

var platforms;
var cursors;

var gameOver = false;
var scoreText;
var score = 0;


var wheels;

var wheel1;
var wheel2;
var wheel3;
var wheel4;
var wheel5;

new Phaser.Game(config2);

// var spaceKey;
// function Game2(config2) {
//   Phaser.Game.call(this, config2);
// }

// Game2.prototype = Object.create(Phaser.Game.prototype);
// Game2.prototype.constructor = Game2;



// Game2.prototype.preload = 

function preload() {
  this.load.image("background", "assets/background.jpg");
  this.load.image("groundSmall", "assets/groundSmall.png");
  this.load.image("groundMedium", "assets/groundMedium.png");
  this.load.image("groundLarge", "assets/groundLarge.png");
  this.load.image("star", "assets/css.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });

  this.load.image("wheel", "assets/wheelOfDeath.png");
}

// Game2.prototype.create = 

function create() {
  //  A simple background for our game
  this.add.image(400, 300, "sky");

  //creates wheel
  //   wheels = this.physics.add.sprite(400, 300, "wheel");

  //   wheels.setCollideWorldBounds(true);

  wheels = this.physics.add.group();

  wheel1 = wheels.create(410, 300, "wheel").setCollideWorldBounds(true);
  wheel2 = wheels.create(30, 300, "wheel").setCollideWorldBounds(true);
  wheel3 = wheels.create(600, 20, "wheel").setCollideWorldBounds(true);
  wheel4 = wheels.create(310, 20, "wheel").setCollideWorldBounds(true);
  wheel5 = wheels.create(30, 20, "wheel").setCollideWorldBounds(true);

  wheel1.angle = 45;
  wheel2.angle = 45;
  wheel3.angle = 45;
  wheel4.angle = 45;
  wheel5.angle = 45;

  this.tweens.add({
    targets: [wheel2, wheel5],
    x: 200,
    ease: "Sine.easeInOut",
    flipX: true,
    duration: 2000,
    yoyo: true,
    loop: -1
  });

  this.tweens.add({
    targets: [wheel1, wheel3],
    x: 780,
    ease: "Sine.easeInOut",
    flipX: true,
    duration: 2000,
    yoyo: true,
    loop: -1
  });

  this.tweens.add({
    targets: wheel4,
    x: 510,
    ease: "Sine.easeInOut",
    flipX: true,
    duration: 2000,
    yoyo: true,
    loop: -1
  });

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  platforms.create(400, 576, "bottom");

  //ledges
  platforms.create(432, 272, "groundSmall");
  platforms.create(656, 432, "groundLarge");
  platforms.create(672, 144, "groundMedium");
  platforms.create(128, 176, "groundMedium");
  platforms.create(144, 400, "groundLarge");

  // The player and its settings
  player = this.physics.add.sprite(100, 450, "dude");

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();
  //   spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  //  create stars, cages, and levers in designated places

  stars = this.physics.add.staticGroup();
  stars.create(432, 240, "star");
  stars.create(656, 400, "star");
  stars.create(672, 112, "star");
  stars.create(128, 144, "star");
  stars.create(144, 368, "star");

  //   stars.children.iterate(function(child) {
  //     //  Give each star a slightly different bounce
  //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  //   });

  //  The score
  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000"
  });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(wheels, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar2 function
  this.physics.add.overlap(player, stars, collectStar2, null, this);

  this.physics.add.collider(player, wheels, hitWheel, null, this);
}

// Game2.prototype.update = 

function update() {
  wheel1.angle -= 0.5;
  wheel2.angle -= 0.5;
  wheel3.angle -= 0.5;
  wheel4.angle -= 0.5;
  wheel5.angle -= 0.5;

  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

  //   if (this.spaceKey.isDown) {
  //     activateLever();
  //   }
}

function collectStar2(player, star) {
  star.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText("Score: " + score);

  if (stars.countActive(true) === 0) {
    //  A new batch of stars to collect
    stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    player.x < 400
      ? Phaser.Math.Between(400, 800)
      : Phaser.Math.Between(0, 400);
  }
}

function hitWheel(player) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  $.get("/api/user_data", function(data) {
    
    var newScore = {
      score: score,
      UserId: data.id,
      gameId: 2
    }

    console.log(newScore);
    addScore2(newScore);
  });


  gameOver = true;
}

function addScore2(score) {
  $.post("/api/scores", score, function() {
    console.log("score added");
  });
}

// new Game2(config2);
