// Set
var game = new Phaser.Game(288, 600, Phaser.AUTO, 'game', {
	preload: preload,
	create: create,
	update: update
});
var start = false;
var backgrounds;
var solide;
var tuyau_haut;
var tuyau_bas;
var player;
var cursors;
var gameover = false;
var gameOverScreen;
var score;
var scoreText;
var addScore = true;
var tuyau_random = 0;

function preload(){
	game.load.image('background', 'asset/background.png');
	game.load.image('ground', 'asset/ground.png');
	game.load.image('game_over', 'asset/Game_Over.png')
	game.load.spritesheet('flappy', 'asset/flapi.png', 17, 12);
	game.load.spritesheet('tube', 'asset/Tube.png', 26,135);
	//game.load.image('chekpoint', 'asset/chekpoint.png');
}

function create(){
	score = 0;

	//charger le physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//ajouter le fond et le rescall
	backgrounds = game.add.sprite(0,0, 'background');
	backgrounds.scale.setTo(2,2.4);

	//création du group tuyau
	solide = game.add.group();
	solide.enableBody = true;
	//tuyau = game.add.group();
	//tuyau.enableBody = true;

	tuyau_haut = solide.create(300, 0, 'tube',0);
	tuyau_haut.body.immovable = true;
	tuyau_haut.scale.setTo(2,2.4);
	game.physics.arcade.enable(tuyau_haut);

	tuyau_bas = solide.create(300, 400, 'tube',1);
	tuyau_bas.body.immovable = true;
	tuyau_bas.scale.setTo(2,2.4);
	game.physics.arcade.enable(tuyau_bas);

	//créatio du sol
	var ground = solide.create(0, game.world.height - 54, 'ground');
	ground.scale.setTo(2,1);
	ground.body.immovable = true;

	// crétion du player
	player = game.add.sprite(32, 200, 'flappy', 1);
	player.rotation = 0;
	game.physics.arcade.enable(player);
	player.scale.setTo(2,2);
	player.body.collideWorldBounds = true;
	player.animations.add('up', [0,1], 5, true);
	game.debug.body(5,5);
	game.debug.body('player');


	cursors = game.input.keyboard.createCursorKeys();

	scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
}

function update(){

	game.physics.arcade.collide(player, solide, GameOver);
	//game.physics.arcade.collide(player, tuyau, GameOver);

	if(start){
		if (gameOverScreen){
			gameOverScreen.kill();
		}
		player.animations.play('up');
		gameover = false;
		playerBump();
		movePipe();
	}else{
		if(cursors.up.isDown){
			start = true;
		}
	}
	if (gameover){
		if (cursors.up.isDown){
			game.state.restart();
			gameover = false;
		}
	}
	if(cursors.up.isDown){
		player.rotation = 5;
	}else{
		player.rotation = 0;
	}
	if(player.position.y > 200){
		player.rotation  += 0.7;
	}else{
		player.rotation = 0;

	}
}
function playerBump(){
	player.body.gravity.y = 500;
	player.body.velocity.x = 0;
	if(cursors.up.isDown){
		player.body.velocity.y = -150;
	}
}
function movePipe(){
	tuyau_haut.body.x = tuyau_bas.body.x -= 1;
	tuyau_haut.body.velocity.x = tuyau_bas.body.velocity.x = -10;
	if(tuyau_haut.position.x < 0 && addScore){
		addScore = false;
		score += 10;
		scoreText.text = 'Score: ' + score;
	}
	if(tuyau_haut.position.x < -54){
		addScore = true;
		tuyau_random = Math.floor(Math.random()*140);
		tuyau_haut.position.set(300, 0 - tuyau_random);
		tuyau_bas.position.set(300, 400 - tuyau_random);
	}
}
function GameOver(){
	start = false;
	gameover = true;
	player.animations.stop();
	tuyau_haut.body.velocity.x = tuyau_bas.body.velocity.x = 0;
	player.body.gravity.y = 0;
	player.body.velocity = 0;
	gameOverScreen = game.add.sprite(game.world.width/2 - 90, game.world.height/2, 'game_over');
	gameOverScreen.scale.setTo(2,2);
}