let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
document.body.style.backgroundColor = "black"
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 2


//classes
//creates all instances of animation
class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1}, offset = {x: 0, y: 0}) {
       this.position = position
       this.height = 150
       this.width =  50
       this.image = document.createElement('img')
       this.image.src = imageSrc
       this.scale = scale;
       this.framesMax = framesMax;
       this.framesCurrent = 0;
       this.framesElapsed = 0;
       this.framesHold = 10;
       this.offset = offset;
    }
    
    draw(){ 
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax ) * this.scale, 
            this.image.height * this.scale
            )}
    
    update(){
        this.draw()
        this.animateFrames()
    }
    
    animateFrames(){
        this.framesElapsed ++
        
        if (this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++
            }else  {
                this.framesCurrent = 0;
            }     
        }
    }
}
//specifically for the players
class Fighter extends Sprite{
    constructor({
        position,
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x: 0, y: 0},
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            imageSrc, 
            scale, 
            framesMax,
            offset
        })
       this.velocity = velocity
       this.height = 150
       this.width =  50
       this.lastKey
       this.attackBox = {
          position: {
              x: this.position.x,
              y: this.position.y
          },
          offset,
          width: this.offset.x,
          height: this.offset.y 
      }
       this.color = color
       this.isAttacking 
       this.health =100
       this.framesCurrent = 0;
       this.framesElapsed = 0;
       this.framesHold = 10;
       this.sprites = sprites;
       this.dead = false
       
       for(const sprite in this.sprites){
           sprites[sprite].image = document.createElement("img")
           sprites[sprite].image.src = sprites[sprite].imageSrc
       }
    }
    
    // draw(){
    //     c.fillStyle = this.color
    //     c.fillRect(this.position.x,this.position.y, this.width ,this.height)
    //     //attackRect
    //     if(this.isAttacking) {
    //         c.fillStyle = 'green'
    //         c.fillRect(
    //         this.attackBox.position.x, 
    //         this.attackBox.position.y, 
    //         this.attackBox.width, 
    //         this.attackBox.height)
    //     }
    // }
    
    update(){
        this.draw()
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        if(!this.dead) this.animateFrames()
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y 
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        this.position.x +=this.velocity.x 
        this.position.y +=this.velocity.y 
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }else{
             this.velocity.y += 0.2
        }
    }
    
    attack() {
        this.switchSprite('attack')
        this.isAttacking = true
    }
    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
          this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }
    takeHit() {
        this.health -= 20
        if (this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }
    switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true
      return
    }

    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack.image &&
      this.framesCurrent < this.sprites.attack.framesMax - 1
    )
      return

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.framesCurrent = 0
        }
        break
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax
          this.framesCurrent = 0
        }
        break
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.framesCurrent = 0
        }
        break

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.framesCurrent = 0
        }
        break

      case 'attack':
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image
          this.framesMax = this.sprites.attack.framesMax
          this.framesCurrent = 0
        }
        break

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image
          this.framesMax = this.sprites.takeHit.framesMax
          this.framesCurrent = 0
        }
        break

      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image
          this.framesMax = this.sprites.death.framesMax
          this.framesCurrent = 0
        }
        break
    }
  }
}


//sprites
const background = new Sprite({ //  takes position and set background image
    position:{
    x:0,
    y:0
    },
    imageSrc:'./images/Background.png'
   
})

const bat = new Sprite({ //  takes position and set background image
    position:{
    x: 50,
    y: 100
    },
    imageSrc:'./images/bat.png',
    framesMax: 5
})

const player = new Fighter({
    position:{
        x:0,
        y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset: {
        x: 0,
        y:0
    },
    imageSrc:'./images/HuntressSprite/Idle.png',
    framesMax: 8, 
    scale: 2,
    offset: {
        x: 200,
        y: 160
    }, 
    sprites: {
        idle: {
            imageSrc: './images/HuntressSprite/Idle.png',
            framesMax: 8
            },
        run: {
            imageSrc: './images/HuntressSprite/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './images/HuntressSprite/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './images/HuntressSprite/Jump.png',
            framesMax: 2
        },
        attack: {
            imageSrc: './images/HuntressSprite/Attack1.png',
            framesMax: 5
        },
        takeHit: {
            imageSrc: './images/HuntressSprite/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './images/HuntressSprite/Death.png',
            framesMax: 8
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
  }
})


const enemy = new Fighter({
    position:{
    x:200,
    y:130
    },
    velocity:{
    x:0,
    y:0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './images/WarriorSprite/Idle.png',
    framesMax: 10,
    scale: 2,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
          imageSrc: './images/WarriorSprite/Idle.png',
          framesMax: 10
        },
        run: {
          imageSrc: './images/WarriorSprite/Run.png',
          framesMax: 8
        },
        jump: {
          imageSrc: './images/WarriorSprite/Jump.png',
          framesMax: 3
        },
        fall: {
          imageSrc: './images/WarriorSprite/Fall.png',
          framesMax: 3
        },
        attack: {
          imageSrc: './images/WarriorSprite/Attack1.png',
          framesMax: 7
        },
        takeHit: {
          imageSrc: './images/WarriorSprite/Take hit.png',
          framesMax: 3
        },
        death: {
          imageSrc: './images/WarriorSprite/Death.png',
          framesMax: 7
        }
    },
    attackBox: {
        offset: {
          x: -170,
          y: 50
        },
        width: 170,
        height: 50
    }
})
    


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}


//functionality
//the rectangle parameters represent player1 & player2
function rectangularCollision({rectangle1, rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}


//takes in cuurent health and waits for a winner, if the timer runs out before a winner there is a tie
function determineWinner({player, enemy, timerId}) {
        gameOver = true
        document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
        }
        else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 wins'
        }
        else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 wins'
        }
}
let gameOver = false 




//timer function
let timer = 60
let timerId
function decreaseTimer() {
    if (!gameOver){
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0 ){
            determineWinner({player, enemy, timerId})
        }
    }
}
decreaseTimer()


//animation
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle ='black'
    c.fillRect(0,0,canvas.width, canvas.height)
    background.update()
    bat.update()
    player.update()
    enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0
    
    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.image = player.sprites.run.image
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }
    
    //player jump sprite animation
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    
    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }
    
    //enemy jumping sequence
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }
    
    // X-axis border
    const newA = player.position.x + player.velocity.x
    const newB = enemy.position.x + enemy.velocity.x
    
    if ( newA < 0 || newA + player.width -1 > canvas.width) {
        console.log({
            newA, canvasWidth: canvas.width
        })
        player.velocity.x = 0
    }
    
    if ( newB < 0 || newB + enemy.width -1 > canvas.width) {
        console.log({
            newB, canvasWidth: canvas.width
        })
        enemy.velocity.x = 0
    }
    
    // y-axis border
    const newC = player.position.y + player.velocity.y
    const newD = enemy.position.y + enemy.velocity.y
    
    if ( newC < 0 || newC + player.height -1 > canvas.height - 100) {
        console.log({
            newA, canvasHeight: canvas.height
        })
        player.velocity.y = 0
    }
    
    if ( newD < 0 || newD + enemy.height -1 > canvas.height - 100) {
        console.log({
            newB, canvasHeight: canvas.height
        })
        enemy.velocity.y = 0
    }

    //collision properties (player)
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) 
        && player.isAttacking &&
    player.framesCurrent === 4){
            enemy.takeHit()
            player.isAttacking = false
            enemy.health -= 5
            document.getElementById('enemy-health').style.width = enemy.health + '%'
            console.log('player hit!')
    }
    //collision properties (enemy attack)
    else if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) 
        && enemy.isAttacking &&
    enemy.framesCurrent === 2){
            player.takeHit()
            enemy.isAttacking = false
            player.health -= 5
            document.getElementById('player-health').style.width = player.health + '%'
            console.log('enemy hit!')
    }
    
    //check for missed shots
    
    //player 
    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
    }
    
    //enemy
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }
    
    // end game based on health
    if (enemy.health <= 0 || player.health <=0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()


//event listner adding action
window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
      case 's':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
})
//event listner undoing action
window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
           case 'a':
            keys.a.pressed = false
            break
    }
    
    //enemy keys
     switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})
