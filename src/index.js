/**
*
* Test bed for PhaserPluginDVR prototype by Timothy Lee Russell
* {@link https://snoffleware.com|Snoffleware Studios LLC}
*
* See the PhaserPluginDVR project for the plugin proof of concept
*/
import 'phaser';

class playGame extends Phaser.Scene{	
    constructor(){
        super("PlayGame"); 
    }
    preload(){
    	
    	this.load.scenePlugin( {
    		key: 'PhaserPluginDVR',
    		url: 'src/phaser-plugin-dvr.js',
    		sceneKey: 'dvr'
    	});
    	
    	this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
		}
    create() {    		
		//Start PhaserPluginDVR
		this.dvr.start();
		
		//potential events to handle...just prototyping for now.
		//they write a line to the console currently
		this.dvr.pause();
		this.dvr.resume();
		this.dvr.sleep();
		this.dvr.wake();
		this.dvr.shutdown();    		
		this.dvr.startRecording();
		this.dvr.pauseRecording();
		this.dvr.stopRecording();
		
		this.lastTouchEmitter = [];
    		
        var square = gameOptions.border / Math.sqrt(2);
        
        this.matter.add.rectangle(gameOptions.border / 4, game.config.height / 2, gameOptions.border / 2, game.config.height, {
            isStatic: true,
            label: "leftwall"
        });
        this.matter.add.rectangle(game.config.width - gameOptions.border / 4, game.config.height / 2, gameOptions.border / 2, game.config.height, {
            isStatic: true,
            label: "rightwall"
        });
        this.matter.add.rectangle(game.config.width / 2, gameOptions.border / 4, game.config.width - gameOptions.border, gameOptions.border / 2, {
            isStatic: true
        });
        this.matter.add.rectangle(game.config.width / 2, game.config.height - gameOptions.border / 4, game.config.width - gameOptions.border, gameOptions.border / 2, {
            isStatic: true
        });
        
        this.flare = this.matter.add.circle(game.config.width / 2, game.config.height / 2, gameOptions.border / 2);
        Phaser.Physics.Matter.Matter.Body.setVelocity(this.flare, {
            x: 2,
            y: 0
        }); 
        this.input.on("pointerdown", this.flareGlide, this);
        this.matter.world.on("collisionstart", function (e, b1, b2) {
            if(b1.label == "leftwall" || b2.label == "leftwall"){
                Phaser.Physics.Matter.Matter.Body.setVelocity(this.flare, {
                    x: 10,
                    y: -12
                });
            }
            if(b1.label == "rightwall" || b2.label == "rightwall"){
                Phaser.Physics.Matter.Matter.Body.setVelocity(this.flare, {
                    x: -10,
                    y: -12
                });
            }
        }, this);
        
        this.particles = this.add.particles('flares');

		    this.emitter = this.particles.createEmitter({
		        frame: 'yellow',
		        radial: false,		        
		        x: -500,
		        y: -500,
		        lifespan: 2000,
		        speedX: { min: -100, max: 100 },
		        speedY: { min: -100, max: 100 },
		        quantity: 7,
		        gravityY: -50,
		        scale: { start: 0.5, end: 0, ease: 'Power3' },
		        blendMode: 'ADD'
		    });
    }
    flareGlide(){
    	
    	  Phaser.Physics.Matter.Matter.Body.setVelocity(this.flare, {
            x: this.flare.velocity.x,
            y: gameOptions.flareGlideAmount
        })
        
        var newParticles = this.add.particles('flares');
			var colors = ['white', 'red', 'blue', 'green'];
			var scale = [0.025, 0.050, 0.075, 0.1, 0.125, 0.15, 0.175, 0.2, 0.25, 0.3, 0.35];

		    var newEmitter = newParticles.createEmitter({
		        frame: Phaser.Utils.Array.GetRandom(colors),
		        radial: false,
		        x:this.flare.position.x,
		        y:this.flare.position.y,
		        lifespan: 3000,
		        speedX: { min: -200, max: 200 },
		        speedY: { min: -200, max: 200 },
		        quantity: 1,
		        scale: { start: Phaser.Utils.Array.GetRandom(scale), end: 0, ease: 'Power3' },
		        blendMode: 'ADD'
		    });
		    
		    this.lastTouchEmitter.push(newEmitter);
		    
		    if(this.lastTouchEmitter.length >= 8) {
		    	var emitter = this.lastTouchEmitter.shift();
		    	emitter.on = false;
		    }		     
    }
    update(){
        Phaser.Physics.Matter.Matter.Body.setVelocity(this.flare, {
            x: (this.flare.velocity.x > 0) ? 10 : -10,
            y: this.flare.velocity.y
        });
        
        var x = this.flare.position.x;
        var y = this.flare.position.y;
        //console.log(x,y);

        this.particles.emitParticleAt(x,y);  
    }
};

var gameOptions = {
	  border: 40,
    flareGlideAmount: -12
}

var gameConfig = {
   type: Phaser.AUTO,
   width: window.innerWidth,
   height: window.innerHeight,
   backgroundColor: 0x000000,
   scene: playGame,
   physics: {
       default: "matter",
       matter: {
           debug: false
       }
    }
}

var game = new Phaser.Game(gameConfig);