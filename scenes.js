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
        let ground = this.add.sprite(500, 600, "water").setScale(3);

        // Create a static group for the platforms
        this.platforms = this.physics.add.staticGroup();

        // Create and add the platforms to the group
        this.platforms.create(150, 550, 'platform').setScale(0.75).refreshBody();
        this.platforms.create(550, 400, 'platform').setScale(0.75).refreshBody();
        this.platforms.create(950, 250, 'platform').setScale(0.75).refreshBody();

        // Optional: Set collision properties for the platforms
        this.platforms.children.iterate((platform) => {
            platform.body.checkCollision = { up: true, down: true, left: true, right: true };
        });

        this.player = this.physics.add.sprite(100, 450, 'fire').setScale(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setBounceX(0.2);

        this.physics.add.collider(this.player, this.platforms);

        this.physics.add.collider(this.player, this.ground);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.player, this.ground, this.touchWater, null, this);
    }

    update() {
        const { left, right, up } = this.cursors;
    
        // Track the player's movement direction only if they are on the ground
        if (this.player.body.touching.down) {
            if (left.isDown) {
                this.player.setVelocityX(-160);
                this.playerDirection = 'left';
            } else if (right.isDown) {
                this.player.setVelocityX(160);
                this.playerDirection = 'right';
            } else {
                this.player.setVelocityX(0);
                this.playerDirection = null;
            }
        }
    
        // Apply the jump only if the player is on the ground and the jump key is pressed
        if (up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }
    
        // Prevent changing direction mid-air
        if (!this.player.body.touching.down && this.playerDirection !== null) {
            if (this.playerDirection === 'left') {
                this.player.setVelocityX(-160);
            } else if (this.playerDirection === 'right') {
                this.player.setVelocityX(160);
            }
        }
    }

    touchWater (player, ground)
    {
        this.scene.start("Level 1");
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
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: [level1],
  };
  
  // Create the Phaser game instance
  const game = new Phaser.Game(config);
  