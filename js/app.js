// Set
var game = new Phaser.Game(288, 600, Phaser.AUTO, 'game', {
	preload: preload,
	create: create,
	update: update
});
var start = false;
var backgrounds;
var solid;
var tuyau;
var tuyau_haut;
var tuyau_bas;
var player;
var cursors;
var gameover = false;

function preload(){
	game.load.image('background', 'asset/background.png');
	game.load.image('ground', 'asset/ground.png');
	game.load.image('game_over', 'asset/Game_Over.png')
	game.load.spritesheet('flappy', 'asset/flapi.png', 17, 12);
	game.load.spritesheet('tube', 'asset/Tube.png', 26,135);
}

function create(){
	//charger le physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//ajouter le fond et le rescall
	backgrounds = game.add.sprite(0,0, 'background');
	backgrounds.scale.setTo(2,2.4);

	//création du group tuyau
	tuyau = game.add.group();
	tuyau.enableBody = true;

	tuyau_haut = tuyau.create(300, 0, 'tube',0);
	tuyau_haut.body.immovable = true;
	tuyau_haut.scale.setTo(2,2.4);
	game.physics.arcade.enable(tuyau_haut);

	tuyau_bas = tuyau.create(300, 400, 'tube',1);
	tuyau_bas.body.immovable = true;
	tuyau_bas.scale.setTo(2,2.4);
	game.physics.arcade.enable(tuyau_bas);

	//créatio du sol
	solid = game.add.group();
	solid.enableBody = true;
	var ground = solid.create(0, game.world.height - 54, 'ground');
	ground.scale.setTo(2,1);
	ground.body.immovable = true;

	// crétion du player
	player = game.add.sprite(32, 200, 'flappy', 1);
	game.physics.arcade.enable(player,true);
	player.scale.setTo(2,2);
	player.body.collideWorldBounds = true;
	player.animations.add('up', [0,1], 10, true);

	cursors = game.input.keyboard.createCursorKeys();

}

function update(){

	game.physics.arcade.collide(player, solid);
	game.physics.arcade.collide(player, tuyau);
	if(cursors.up.isDown){
		start = true;
		player.body.gravity.y = 500;

	}
	if(start){
		playerBump();
		movePipe();
		if()
	}

}
function playerBump(){
	player.body.velocity.x = 0;
	if(cursors.up.isDown){
		player.body.velocity.y = -150;
	}
}
function movePipe(){
	tuyau_haut.body.x = tuyau_bas.body.x -= 1;
	tuyau_haut.body.velocity.x = tuyau_bas.body.velocity.x = -10;
	if(tuyau_haut.position.x < -54){
		tuyau_haut.position.set(300,0);
		tuyau_bas.position.set(300,400);
	}
}
function GameOver(){
	start = false;
	gameover = true;
	tuyau_haut.body.x = tuyau_bas.body.x = 300;
	tuyau_haut.body.velocity.x = tuyau_bas.body.velocity.x = 0;
	player.body.gravity.y = 0;
	player.body.velocity = 0;
}