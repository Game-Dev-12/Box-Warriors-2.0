let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
document.body.style.backgroundColor = 'black'
canvas.width = 1024
canvas.height = 534

//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 2


//classes
//creates all instances of animation
class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1}) {
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
    }
    
    draw(){ 
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x,
            this.position.y, 
            (this.image.width / this.framesMax ) * this.scale, 
            this.image.height * this.scale
            )}
    
    update(){
        this.draw()
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
class Fighter {
    constructor({position,velocity, spriteSrc, offset}) {
       this.position = position
       this.velocity = velocity
       this.height = 150
       this.width =  50
       this.lastKey
       this.spriteSrc = spriteSrc
       this.attackBox = {
           position: {
               x: this.position.x,
               y: this.position.y
           },
           offset,
           width: 100,
           height: 50 
       }
    
       this.isAttacking 
       this.health =100
      
    }
    
    draw(){
        //c.fillStyle = this.color
        //c.fillRect(this.position.x,this.position.y, this.width ,this.height)
        let sprite = new Image()
        sprite.src = this.spriteSrc
       // c.drawImage(sprite,sx,sy,swidth,sheight,this.position.x,this.position.y, this.width ,this.height)
        c.drawImage(sprite,this.position.x,this.position.y, this.width ,this.height)
    
        
        //attackRect
        if(this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height)
        }
    }
    
    update(){
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y 
        
        this.position.x +=this.velocity.x 
        this.position.y +=this.velocity.y 
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }else{
             this.velocity.y += 0.2
        }
    }
    
    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
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
    spriteSrc:'./images/HuntressSprite/Idle.1.png',
    offset: {
        x: 0,
        y: 0
    }
    
})


const enemy = new Fighter({
    position:{
    x:972,
    y:130
    },
    velocity:{
    x:0,
    y:0
    },
    spriteSrc:'./images/WarriorSprite/Idle.1.png',
    offset: {
        x: -50,
        y: 0
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
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }
    
    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
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
    
    if ( newC < 0 || newC + player.height -1 > canvas.height) {
        console.log({
            newA, canvasHeight: canvas.height
        })
        player.velocity.y = 0
    }
    
    if ( newD < 0 || newD + enemy.height -1 > canvas.height) {
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
        && player.isAttacking){
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
        && enemy.isAttacking){
            enemy.isAttacking = false
            player.health -= 5
            document.getElementById('player-health').style.width = player.health + '%'
            console.log('enemy hit!')
    }
    
    // end game based on health
    if (enemy.health <= 0 || player.health <=0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()


//event listner adding action
window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
         case 'a':
            keys.a.pressed = true 
            player.lastKey = 'a'
            break;
         case 'w':
            player.velocity.y = -10
            break
        case 's':
            player.attack()
            break;
    
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
         case 'ArrowLeft':
            keys.ArrowLeft.pressed = true 
            enemy.lastKey = 'ArrowLeft'
            break
         case 'ArrowUp':
            enemy.velocity.y = -10
            break
        case 'ArrowDown':
            enemy.attack()
            break
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