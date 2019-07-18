var config = {
  type: Phaser.AUTO,
  parent: "gameHere",
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
var cages;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var bullets;

var jumpSound;
var theme;
var shotSound;
var gameoverSound;
var collectSound;
var cageBreakSound;
var newBugSound;

new Phaser.Game(config);

function preload() {
  this.load.image("background", "assets/background.jpg");
  this.load.image("groundSmall", "assets/groundSmall.png");
  this.load.image("groundMedium", "assets/groundMedium.png");
  this.load.image("groundLarge", "assets/groundLarge.png");
  this.load.image("bottom", "assets/bottom.png");

  this.load.image("star1", "assets/html.png");
  this.load.image("star2", "assets/css.png");
  this.load.image("star3", "assets/javascript.png");
  this.load.image("star4", "assets/jquery.png");
  this.load.image("star5", "assets/bootstrap.png");

  this.load.image("cage", "assets/cage.png");
  this.load.image("bomb", "assets/bug.png");
  this.load.image("bullet", "assets/JSbullet.png");

  this.load.audio("theme", "assets/theme.mp3");
  this.load.audio("shot", "assets/shot.mp3");
  this.load.audio("jump", "assets/jump.mp3");
  this.load.audio("gameover", "assets/gameover.mp3");
  this.load.audio("collect", "assets/collect.mp3");
  this.load.audio("cageBreak", "assets/cageBreak.mp3");
  this.load.audio("newBug", "assets/newBug.mp3");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create() {
  theme = this.sound.add("theme", { loop: "true", volume: 0.3 });
  theme.play();

  jumpSound = this.sound.add("jump");
  shotSound = this.sound.add("shot", {volume: 0.5});
  gameoverSound = this.sound.add("gameover");
  collectSound = this.sound.add("collect", {volume: 0.5});
  cageBreakSound = this.sound.add("cageBreak");
  newBugSound = this.sound.add("newBug");

  //  background for our game
  this.add.image(400, 304, "background");

  //  The platforms group contains the ground and the ledges we can jump on
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

  cursors = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
  });
  //   spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  //  create stars and cages in designated places

  stars = this.physics.add.staticGroup();
  stars.create(432, 240, "star1");
  stars.create(656, 400, "star2");
  stars.create(672, 112, "star3");
  stars.create(128, 144, "star4");
  stars.create(144, 368, "star5");

  cages = this.physics.add.staticGroup();
  cages.create(432, 240, "cage");
  cages.create(656, 400, "cage");
  cages.create(672, 112, "cage");
  cages.create(128, 144, "cage");
  cages.create(144, 368, "cage");

  

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
}

// Game1.prototype.update =

function update() {
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

    jumpSound.play();
  }

  if (this.input.activePointer.isDown) {
    shotSound.play();
    var bullet = bullets.getFirstDead(
      true,
      player.x - 8,
      player.y - 8,
      "bullet"
    );
    this.physics.moveTo(bullet, this.input.x, this.input.y, null, 750);

    
  }

}

function collectStar(player, star) {
  collectSound.play();
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
    newBugSound.play();
  }
}



function hitBomb(player) {
  this.physics.pause();
  gameoverSound.play();
  theme.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  $.get("/api/user_data", function(data) {
    var newScore = {
      score: score,
      UserId: data.id,
      gameId: 1
    };

    console.log(newScore);
    addScore1(newScore);
  });

  $("#gameOverScreen").show();

  gameOver = true;
}

function addScore1(score) {
  $.post("/api/scores", score, function() {
    console.log("score added");
  });
}

function breakCage(bullet, cage) {
  cageBreakSound.play();
  cage.disableBody(true, true);
}


