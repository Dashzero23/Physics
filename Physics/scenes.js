class level1 extends Phaser.Scene {
    constructor() {
        super("Level 1");
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image("platform", "image/platform.png");
        this.load.image("water", "image/water.png");
        this.load.image("fire", "image/fire.png");
    }  

    create() {
        this.ground = this.physics.add.staticGroup();
        this.ground.create(500, 600, 'water').setScale(3).refreshBody();
        //ground.body.checkCollision = { up: true, down: true, left: true, right: true };

        this.plat0 = this.physics.add.staticGroup();
        this.plat0.create(150, 550, 'platform').setScale(0.75).refreshBody();
        //plat0.body.checkCollision = { up: true, down: true, left: true, right: true };

        this.plat1 = this.physics.add.staticGroup();
        this.plat1.create(550, 400, 'platform').setScale(0.75).refreshBody();
        //plat1.body.checkCollision = { up: true, down: true, left: true, right: true };

        this.plat2 = this.physics.add.staticGroup();
        this.plat2.create(950, 250, 'platform').setScale(0.75).refreshBody();
        //plat2.body.checkCollision = { up: true, down: true, left: true, right: true };
        this.player = this.physics.add.sprite(100, 450, 'fire').setScale(0.2);

        this.physics.add.collider(this.player, this.plat0);
        this.physics.add.collider(this.player, this.plat1);
        this.physics.add.collider(this.player, this.plat2);

        this.physics.add.collider(this.player, this.ground);
    } 
}

// Create the Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 600,
    backgroundColor: '#808080', // Set the background color to gray
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [level1],
  };
  
  // Create the Phaser game instance
  const game = new Phaser.Game(config);
  