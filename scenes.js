class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    create() {
        this.add.text(20,50, "You are a fire spirit being captured and need to escape!").setFontSize(30);
        this.add.text(20,100, "Don't ask me about the details I'm bad at story writing.").setFontSize(10);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('Level 1'));
        });
    }
}

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
        this.cameras.main.alpha = 0;
        // Start a fade-in tween to gradually increase the alpha value to 1 (fully opaque)
        this.tweens.add({
        targets: this.cameras.main,
        alpha: 1,
        duration: 1000, // Duration of the fade-in effect in milliseconds
        });

        this.ground = this.physics.add.staticGroup();

        this.ground.create(500, 600, 'water').setScale(3).refreshBody();

        let instruct = this.add.text(300, 100, "Welcome to the dungeon\nUse arrow keys to move\nGet to the brown door to continue", {
            fontSize: "28px",
            fill: "#000000",
        }).setOrigin(0.5);

        // Create a static group for the platforms
        this.platforms = this.physics.add.staticGroup();

        // Create and add the platforms to the group
        this.platforms.create(150, 550, 'platform').setScale(0.75).refreshBody();
        this.platforms.create(550, 400, 'platform').setScale(0.75).refreshBody();
        this.platforms.create(950, 250, 'platform').setScale(0.75).refreshBody();

        this.platforms.children.iterate((platform) => {
            platform.body.checkCollision = { up: true, down: true, left: true, right: true };
        });

        this.player = this.physics.add.sprite(100, 450, 'fire').setScale(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setBounceX(0.2);

        this.door = this.add.rectangle(970, 163, 70, 150, 0x8B4513); // Brown color

        this.physics.add.existing(this.door);
        this.door.body.allowGravity = false;
        this.door.body.immovable = true;

        // Check for collision between player and door
        this.physics.add.overlap(this.player, this.door, () => {
            // Transition to "Summary 1" scene when player touches the door
            //this.scene.get('Summary 1').completionTime = completionTime;

            // Transition to "Summary 1" scene when player touches the door
            this.scene.start('Summary 1');
        });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.door, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.player, this.ground, () => {
            this.scene.start("Level 1");
        });
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
        
        // Get the elapsed time in seconds
        //this.elapsed = this.timedEvent.getProgress();
    }
}

class Summary1 extends Phaser.Scene {
    constructor() {
        super('Summary 1')
    }

    create() {
        this.add.text(20,100, "Don't ask me about the details I'm bad at story writing.").setFontSize(10);

        // Access the completionTime value passed from the previous scene
        const completionTime = this.scene.data.get('completionTime');

        // Use the completionTime value in the next scene
        this.add.text(20,50, "Completion time for level 1: ${completionTime} seconds.").setFontSize(30);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('Level 1'));
        });
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
    scene: [level1, Summary1],
  };
  
  // Create the Phaser game instance
  const game = new Phaser.Game(config);
  