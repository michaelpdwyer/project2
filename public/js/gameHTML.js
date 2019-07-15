// var config = require(config);

// module.exports = config;
// // end of file
// // -------------
// //begin of file
// var config = require("gameconfig");

// var Game = require("mygame");

// var myGame = new Game(config);

// end of file
// ---------------
// begin of file

var config = {
  type: Phaser.AUTO,
  parent: "gameHere",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: Game1
};

var player;
var stars;
var cages;
//var levers;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var bullets;

// var spaceKey;

function Game1(config) {
  Phaser.Game.call(this, config);
}

Game1.prototype = Object.create(Phaser.Game.prototype);
Game1.prototype.constructor = Game1;

// module.exports = Game;

Game1.prototype.preload = function() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/html.png");
  this.load.image("cage", "assets/cage.png");
  //this.load.image("lever", "assets/leverOn.png");
  this.load.image("bomb", "assets/bug.png");
  this.load.image("bullet", "assets/JSbullet.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
};

Game1.prototype.create = function() {
  //  A simple background for our game
  this.add.image(400, 300, "sky");

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms
    .create(400, 568, "ground")
    .setScale(2)
    .refreshBody();

  platforms
    .create(400, 250, "ground")
    .setScale(0.5)
    .refreshBody();

  //  Now let's create some ledges
  platforms.create(600, 450, "ground");
  platforms.create(50, 350, "ground");
  platforms.create(750, 800, "ground");
  platforms.create(780, 140, "ground");
  platforms.create(40, 110, "ground");

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
  stars.create(12, 82, "star");
  stars.create(12, 322, "star");
  stars.create(788, 112, "star");
  stars.create(788, 422, "star");
  stars.create(395, 230, "star");

  cages = this.physics.add.staticGroup();
  cages.create(12, 83, "cage");
  cages.create(12, 323, "cage");
  cages.create(788, 113, "cage");
  cages.create(788, 423, "cage");
  cages.create(395, 231, "cage");

  //   levers = this.physics.add.staticGroup();
  //   levers.create(48, 85, "lever");
  //   levers.create(48, 325, "lever");
  //   levers.create(752, 115, "lever");
  //   levers.create(752, 425, "lever");
  //   levers.create(431, 233, "lever");

  //   stars.children.iterate(function(child) {
  //     //  Give each star a slightly different bounce
  //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  //   });

  bombs = this.physics.add.group();
  bullets = this.physics.add.group();

  //  The score
  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000"
  });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(cages, platforms);
  this.physics.add.collider(bullets, platforms);
  this.physics.add.collider(player, cages);
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(bullets, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);

  //   this.physics.add.overlap(cage, bullets, removeCage, null, this);

  this.physics.add.collider(player, bombs, hitBomb, null, this);
  this.physics.add.collider(bullets, cages, breakCage, null, this);
};

Game1.prototype.update = function() {
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

  if (this.input.activePointer.isDown) {
    var bullet = bullets.getFirstDead(
      true,
      player.x - 8,
      player.y - 8,
      "bullet"
    );
    this.physics.moveTo(bullet, this.input.x, this.input.y, null, 750);

    //bullet.setCollideWorldBounds(true);
  }

  //   if (this.spaceKey.isDown) {
  //     activateLever();
  //   }

  //   bullets.children.each(
  //     function(b) {
  //       if (b.active) {
  //         if (b.y < 0) {
  //           b.setActive(false);
  //         }
  //       }
  //     }.bind(this)
  //   );
};
function collectStar(player, star) {
  star.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText("Score: " + score);

  if (stars.countActive(true) === 0) {
    //  A new batch of stars to collect
    stars.children.iterate(function(child) {
      child.enableBody(true, child.x, child.y, true, true);
    });

    
    cages.children.iterate(function(child) {
      child.enableBody(true, child.x, child.y, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}

// function activateLever(player, lever, cages) {
//   cages.destroy();

//   console.log("at lever");
// }

function hitBomb(player) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  $.get("/api/user_data", function(data) {
    
    var newScore = {
      score: score,
      UserId: data.id,
      gameId: 1
    }

    console.log(newScore);
    addScore1(newScore);
  });

  gameOver = true;
}

function addScore1(score) {
  $.post("/api/scores", score, function() {
    console.log("score added");
  });
}

function breakCage(bullet, cage) {
  cage.disableBody(true, true);
}

// function removeBullet(bullet) {}

// function shoot(pointer) {
//   var bullet = this.bullets.get(pointer.x, pointer.y);
//   if (bullet) {
//     bullet.setActive(true);
//     bullet.setVisible(true);
//     bullet.body.velocity.y = -200;
//   }
// }







// new Game1(config);
