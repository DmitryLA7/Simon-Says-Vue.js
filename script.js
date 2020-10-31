// create a root instance
var app = new Vue({
  el: '#app',
  data: {
    counter : 0,
    wholeSequence: [],
    buttonPressesLeft: [],
    sequenceLength: 20,
    difficult: '',
    lightingSpeed: 1400,
    highlightedItem: " ",
    green: "#0A860A",
    red: "#A80C0C",
    yellow: "#A88D0C",
    blue: "#2B1473",
    strictEnabled: false,
    buttonsLocked: false
  },
  methods:{
    checkButton: function(userColor){
      if(this.buttonPressesLeft.length>0 && !this.buttonsLocked){
        this.buttonsLocked = true;
        let color = this.buttonPressesLeft.shift();
        this.highlightedItem=userColor;
        this.blinkColor();
        if(color!==userColor){
          this.onUserError();
          this.buttonPressesLeft=this.getCurrentSequence();
        }
        else if(this.buttonPressesLeft.length===0){
          if(this.counter===this.sequenceLength){
            this.onGameComplete();
          }
          else{
            this.onSequenceComplete();
          }
        }
        // user pressed correct button so nothing to do else, unlock and wait for next button press*/
        else{
        this.buttonsLocked = false;
        }
      }
    },
    onSequenceComplete: function(){
      this.counter++;
      this.buttonPressesLeft = this.getCurrentSequence();
      setTimeout(this.playSequence, this.lightingSpeed, this.getCurrentSequence());
    },
    onGameComplete: function(){
          this.counter="You win!";
          this.clearGameState();
    },
    onUserError:function(){
      this.notifyError();
      if(this.strictEnabled){
        setTimeout(this.startGame, this.lightingSpeed);
        return;
      }
      setTimeout(this.playSequence, 1000,this.getCurrentSequence());
    },
    getCurrentSequence: function(){
      return this.wholeSequence.slice(0,this.counter);
    },
    notifyError: function(){
      const counter = this.counter;
      const interval1 = setInterval(()=>{
        if(this.counter!=="!!")
           this.counter="!!"
        else
           this.counter="--";
      },500);
      setTimeout(()=>{clearInterval(interval1);
                      this.counter = counter;}
                 , 500);
    },
    clearGameState: function(){
      this.wholeSequence=[];
      this.timeOutLength = this.lightingSpeed;
    },
    startGame: function(){
      this.clearGameState();
      this.counter=1;
      this.createSequence();
      this.buttonPressesLeft=this.wholeSequence.slice(0,1);
      this.playSequence(this.wholeSequence.slice(0,1));
    },
    createSequence: function(){
      let colorNumber = null,
          lastColor=null;
      for(let i=0;i<this.sequenceLength;i++){
        do{
          colorNumber = Math.round(Math.random()*4);
        }while(colorNumber===lastColor);
        if(colorNumber===0)
          this.wholeSequence.push("green");
        else if(colorNumber===1)
          this.wholeSequence.push("red");
        else if(colorNumber===2)
          this.wholeSequence.push("yellow");
        else if(colorNumber===3)
          this.wholeSequence.push("blue");
        lastColor = colorNumber;
      }
    },
    blinkColor: function(){
      this.highlightColor();
      window.setTimeout(this.shadeColor, 200);
    },
    playSequence: function(sequence){
      this.sequencePlaying = true;
      if(sequence.length>0){
        this.highlightedItem = sequence.shift();
        this.blinkColor();
        window.setTimeout(this.playSequence, this.lightingSpeed, sequence);
      }
      else
        this.unlockButtons();
    },
    unlockButtons: function(){
      this.buttonsLocked=false;
    },
    highlightColor:function(){
      var audio=null;
      switch(this.highlightedItem){
          case "green":
            this.green="#33D833";
            audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
            break;
          case "red":
            this.red="#FF3C3C";
            audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
            break;
          case "yellow":
            this.yellow="#FFDE3C";
            audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
            break;
          case "blue":
            this.blue="#5E3FC3";
            audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
            break;
          }
          if(audio!==null)
            audio.play();
    },
    shadeColor:function(){
      switch(this.highlightedItem){
          case "green":
            this.green="#0A860A";
            break;
          case "red":
            this.red="#A80C0C";
            break;
          case "yellow":
            this.yellow="#A88D0C";
            break;
          case "blue":
            this.blue="#2B1473";
            break;
          }
       },
       changeDifficult: function(event){
         if (event.target.value === 'easy'){
           this.lightingSpeed = 1400
         } else if(event.target.value === 'normal'){
           this.lightingSpeed = 1000
         } else if(event.target.value === 'hard'){
           this.lightingSpeed = 400
         } else{
           this.lightingSpeed = 200
         }
       }
    }
})
