var config = {
  type: Phaser.AUTO,
  width: window.innerWidth * 0.95,
  height: window.innerHeight * 0.85,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
    createPeta: createPeta, // Ajoutez cette ligne
  },
};

var player;
var creatures;
var bullets;
var poops;
var cursors;
var spaceKey;
var enterKey;
var lastFired = 0;
var nextPoopTime = 0;
var score = 0;
var scoreText;
var lives = 7;
var livesText;
var health = 100;
var healthText;
var peta;
var petaCount = 0;
var atomes;
var atomesText;
var isAtomeReady = true;
var atomeCooldown = 10000;
var atomeCount = 0;
var isAtomeActive = false;

var game = new Phaser.Game(config);

game.events.on('error', function (error) {
  console.error(error);
});

function preload() {
  this.load.image('hunter', 'hunterAssets/hunter.jpg');
  this.load.image('creature', 'hunterAssets/sanglier.jpg');
  this.load.image('bullet', 'hunterAssets/bullet.jpg');
  this.load.image('poop', 'hunterAssets/poop.jpg');
  this.load.image('peta', 'hunterAssets/peta.jpg');
  this.load.image('atome', 'hunterAssets/atomeGif.gif');
}

function create() {
  player = this.physics.add.sprite(
    window.innerWidth * 0.5,
    window.innerHeight * 0.75,
    'hunter'
  );
  player.setBounce(0); // désactive l'élasticité du joueur

  player.setImmovable(true);
  player.setScale(1 / 4.6);

  creatures = this.physics.add.group();
  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

  bullets = this.physics.add.group({
    classType: Bullet,
    maxSize: 10,
    runChildUpdate: true,
  });

  poops = this.physics.add.group();
  atomes = this.physics.add.group();

  this.physics.add.collider(bullets, creatures, hitCreatureBullet, null, this);
  this.physics.add.collider(player, creatures, hitPlayerCreature, null, this);
  this.physics.add.collider(player, poops, hitPlayerPoop, null, this);
  this.physics.add.collider(atomes, creatures, hitCreatureAtom, null, this);
  this.physics.add.collider(atomes, peta, hitPeta, null, this);
  this.physics.add.collider(atomes, player, hitPlayerAtome, null, this);

  scoreText = this.add
    .text(config.width - 16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#ffffff',
    })
    .setOrigin(1, 0);

  livesText = this.add
    .text(config.width - 16, 56, 'Lives: ' + lives, {
      fontSize: '32px',
      color: '#ffffff',
    })
    .setOrigin(1, 0);

  healthText = this.add
    .text(config.width - 16, 96, 'Health: ' + health, {
      fontSize: '32px',
      color: '#ffffff',
    })
    .setOrigin(1, 0);

  atomesText = this.add.text(16, 136, 'Atomes: 0', {
    fontSize: '32px',
    color: '#ffffff',
  });

  this.time.addEvent({
    delay: 3000,
    callback: function () {
      let creature = creatures.create(
        Phaser.Math.Between(50, 1450),
        0,
        'creature'
      );
      creature.setScale(0.25);
      creature.setVelocityY(Phaser.Math.Between(50, 100));
    },
    callbackScope: this,
    loop: true,
  });

  this.time.addEvent({
    delay: 10000,
    callback: function () {
      atomeCount++;
      atomesText.setText('Atomes: ' + atomeCount);
    },
    callbackScope: this,
    loop: true,
  });
}

function update(time) {
  if (cursors.left.isDown) {
    player.setVelocityX(-400);
  } else if (cursors.right.isDown) {
    player.setVelocityX(400);
  } else {
    player.setVelocityX(0);
  }

  if (spaceKey.isDown && time > lastFired) {
    var bullet = bullets.get();
    if (bullet) {
      bullet.fire(player.x, player.y);
      lastFired = time + 500;
    }
  }

  if (
    Phaser.Input.Keyboard.JustDown(enterKey) &&
    atomeCount > 0 &&
    isAtomeReady &&
    !isAtomeActive
  ) {
    isAtomeActive = true;
    isAtomeReady = false;
    atomeCount--;
    atomesText.setText('Atomes: ' + atomeCount);

    var atome = atomes.create(0, 0, 'atome');
    atome.setScale((config.width * 0.9) / atome.width);
    atome.x = config.width / 2;
    atome.y = config.height / 2;
    atome.setOrigin(0.5);

    this.tweens.add({
      targets: atome,
      scaleX: 0.95,
      scaleY: 1.05,
      duration: 300,
      yoyo: true,
      repeat: 2,
    });

    this.time.delayedCall(
      3000,
      function () {
        atome.disableBody(true, true);
        isAtomeActive = false;
        isAtomeReady = true;
      },
      [],
      this
    );

    creatures.getChildren().forEach(function (creature) {
      creature.disableBody(true, true);
      score += 10;
    });
    scoreText.setText('Score: ' + score);
  }

  if (isAtomeActive) {
    this.physics.pause();
  } else {
    this.physics.resume();
  }

  if (time > nextPoopTime) {
    let creature = Phaser.Utils.Array.GetRandom(creatures.getChildren());
    if (creature) {
      let newPoop = poops.create(creature.x, creature.y, 'poop');
      newPoop.setScale(0.1);
      newPoop.setVelocityY(100);
      nextPoopTime = time + 12000;
    }
  }

  if (health <= 0 && lives > 0) {
    health = 100;
    healthText.setText('Health: ' + health);
    lives -= 1;
    livesText.setText('Lives: ' + lives);
  }

  if (lives === 0) {
    // Si les vies sont à 0, affiche "game over" et arrête le jeu
    var gameOverText = this.add.text(
      config.width / 2,
      config.height / 2,
      'Game Over',
      {
        fontSize: '64px',
        color: '#ffffff',
      }
    );
    gameOverText.setOrigin(0.5);
    this.physics.pause(); // Pause la physique du jeu
    player.setTint(0xff0000); // Change la couleur du joueur pour indiquer qu'il est "mort"
    player.anims.play('turn'); // Si vous avez une animation spécifique pour le joueur "mort"

    this.time.removeAllEvents(); // Stop all timed events
    cursors.left.isDown = false; // Stop player movement
    cursors.right.isDown = false; // Stop player movement
    spaceKey.isDown = false; // Stop player shooting
  }
}

function hitCreatureBullet(bullet, creature) {
  console.log('tuc');

  bullet.destroy();
  creature.setActive(false);
  creature.setVisible(false);

  score += 10;
  scoreText.setText('Score: ' + score);
  petaCount++;
  if (petaCount % 3 == 0) {
    createPeta.call(this);
  }
}

function hitPlayerCreature(player, creature) {
  creature.disableBody(true, true);
  score += 50;
  scoreText.setText('Score: ' + score);
  health -= 50;
  healthText.setText('Health: ' + health);
}

function hitPlayerPoop(player, poop) {
  poop.disableBody(true, true);
  health -= 10;
  healthText.setText('Health: ' + health);
}

function hitPlayerAtome(player, atome) {
  atome.disableBody(true, true);
  lives -= 1;
  livesText.setText('Lives: ' + lives);
}

function hitPeta(atome, peta) {
  if (atome.texture.key === 'atome' && peta.texture.key === 'peta') {
    atome.disableBody(true, true);
    peta.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
  }
}

function hitCreatureAtom(atome, creature) {
  creature.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
}

function createPeta() {
  peta = this.physics.add.image(
    Phaser.Math.Between(50, 1150),
    Phaser.Math.Between(-300, -100),
    'peta'
  );
  peta.setBounce(0);
  peta.setVelocity(0, 0);
  peta.setScale(0.2).setGravityY(80);
  peta.setImmovable(true);
  this.physics.add.collider(player, peta, hitPlayerAtome, null, this);
}

var Bullet = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function Bullet(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
    this.speed = Phaser.Math.GetSpeed(400, 1);
  },
  fire: function (x, y) {
    this.setPosition(x, y - 50);
    this.setActive(true);
    this.setVisible(true);
    this.setScale(0.1);
  },
  update: function (time, delta) {
    this.y -= this.speed * delta;

    if (this.y < -50) {
      this.setActive(false);
      this.setVisible(false);
    }
  },
});
