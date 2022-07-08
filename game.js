kaboom({
  fullscreen: true,
  clearColor: [0.4, 0.2, 1, 1],
  global: true,
  scale: 2,
});
//sprites
loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("up", "pipe_up.png");
loadSprite("lucky", "surprise.png");
loadSprite("open", "unboxed.png");
loadSprite("hero", "evil_mushroom.png");
loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("star", "star.png");
loadSprite("backround", "backround.gif");
loadSprite("mario", "mario.png");
loadSprite("zz", "z.png");
loadSprite("peach", "princes.png");
//sounds
loadSound("jumpsound", "jumpSound.mp3");
loadSound("gamesound", "gameSound.mp3");

//score
let score = 0;

scene("game", () => {
  play("gamesound");

  layers(["bg", "obj", "ui"], "obj");
  //map edit
  const map = [

    "                                                                                                                   ",
    "                                                                                                                   ",
    "                                                                                                                   ",
    "                                                                                                                   ",
    "                                                                                                                   ",
    "                          z  .   z                                                                                  ",
    "                      +===============+===                                                                          ",
    "                                        ==========                                                               ",
    "                                                                                                                   ",
    "                                                                   =!==                                             ",
    "                                                                                                                   ",
    "                                                                                                    ",
    "                                                    =!!=                                            ",
    "                                                                                                    ",
    "                                                                                       zz           ",
    "                                                                                  +===========+     ",
    "                                                  ====                                              ",
    "                ==        ==                     ===!=                                                     ",
    "               ==+   z    +==                   ====                      z       z$$*$$         z      ",
    "===========================================================         +============+==========+=========+======",
    "===========================================================         =========================================",
  ];
  //obj
  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    "+": [sprite("block"), solid(), "zz_block"],
    "-": [sprite("up"), solid(), "up"],
    "!": [sprite("lucky"), solid(), "surprise_box"],
    "^": [sprite("open"), solid()],
    $: [sprite("coin"), "coins"],
    "@": [sprite("mushroom"), "bigmushroom", body()],
    "*": [sprite("star"), "stars"],
    z: [sprite("zz"), solid(), body(), "zz"],
    ".":[sprite("peach"), solid(), "peach"],
  };
  //backround

  const player = add([
    sprite("hero"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

 const scorelabel = add([
 text("score" + score)
 ]);

  const bg = add([
    sprite("backround"),
    pos(player.pos),
    layer("bg"),
    origin("center"),
  ]);
  //player
  const movement = 150;
  let currentNumJump = 0;
  keyDown("d", () => {
    player.move(movement, 0);
  });

  keyDown("a", () => {
    player.move(-movement, 0);
  });

  keyPress("space", () => {
    if (player.grounded()) {
      currentNumJump++;
      console.log(currentNumJump);
      play("jumpsound");
      player.jump(400);
    }
    if (currentNumJump < 3) {
      currentNumJump++;
      player.jump(400);
    }
  });

  player.action(() => {
    if (player.grounded()) {
      currentNumJump = 0;
    }
  });
  //destroy
  player.on("headbump", (obj) => {
    const random = Math.floor(Math.random() * 2);
    if (obj.is("surprise_box")) {
      console.log(random);
      random_obj = ["$", "@"];
      destroy(obj);
      gamelevel.spawn("^", obj.gridPos);
      gamelevel.spawn(random_obj[random], obj.gridPos.sub(0, 1));

      scorelabel.pos = player.pos.sub(400,200)
    }
  });

  const gamelevel = addLevel(map, mapSymbols);
  //items
  action("bigmushroom", (obj) => {
    obj.move(20);
  });

  player.collides("coins", (obj) => {
    score += 5;
    destroy(obj);
  });

  player.collides("bigmushroom", (obj) => {
    destroy(obj);
    player.biggify(15);
  });

  player.collides("stars", (obj) => {

    score += 20;
    destroy(obj);
  });

    player.collides('peach', (x) => {    
      go("win")
    });
  // camera
  player.action(() => {
    camPos(player.pos);
    scorelabel.pos = player.pos.sub(0,200);
    scorelabel.text = "score: " + score;
    bg.pos = player.pos;
  });

  //enemy

  let isjumping = false;

  player.collides("zz", (obj) => {
    if (isjumping) {
      destroy(obj);
    } else {
      go("gameover");
    }
  });

  const Fall_Down = 1000;

  player.action(() => {
    isjumping = !player.grounded();

    if (player.pos.y >= Fall_Down) {
      go("gameover");
    }
  });
  let eMove = 20;

  action("zz", (obj) => {
    obj.move(eMove, 0);
  });

  action("zz", (obj) => {
    obj.collides("zz_block", () => {
      eMove *= -1;
    });
  });

  //secne end
});

scene("gameover", () => {
  add([sprite("backround"), pos(width() / 2, height() / 2), origin("center")]);
  add([
    text("Game Over\nTry Again\nscore: " + score, 45),
    
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    go("game");
  });
});

scene("win", () => {
  add([sprite("backround"), pos(width() / 2, height() / 2), origin("center")]);
  add([
    text("You saved the princes\nscore:"+ score, 45),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    go("game");
  });
});


start("game");
