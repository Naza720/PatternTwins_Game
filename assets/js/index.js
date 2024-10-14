'use strict';

const card = {
  create(id, frontImage) {
    return {
      id,
      frontImage,
      backImage: 'assets/img-oneColor/Backside.webp',
      isFlipped: false,
      isMatched: false,
    };
  },
  flip(card) {
    card.isFlipped = !card.isFlipped;
  },
  match(card) {
    card.isMatched = true;
  }
};

// KONSTANTEN / VARIABLEN

const images = [ //Array pfad imgs
  'assets/img-oneColor/Pattern_1.webp',
  'assets/img-oneColor/Pattern_2.webp',
  'assets/img-oneColor/Pattern_3.webp',
  'assets/img-oneColor/Pattern_4.webp',
  'assets/img-oneColor/Pattern_5.webp',
  'assets/img-oneColor/Pattern_6.webp',
  'assets/img-oneColor/Pattern_7.webp',
  'assets/img-oneColor/Pattern_8.webp',
  'assets/img-oneColor/Pattern_9.webp',
  'assets/img-oneColor/Pattern_10.webp',
  'assets/img-oneColor/Pattern_11.webp',
  'assets/img-oneColor/Pattern_12.webp',
  'assets/img-oneColor/Pattern_13.webp',
  'assets/img-oneColor/Pattern_14.webp',
  'assets/img-oneColor/Pattern_15.webp',
  'assets/img-oneColor/Pattern_16.webp',
  'assets/img-oneColor/Pattern_17.webp',
  'assets/img-oneColor/Pattern_18.webp',
  'assets/img-oneColor/Pattern_19.webp',
  'assets/img-oneColor/Pattern_20.webp',
  'assets/img-oneColor/Pattern_21.webp',
  'assets/img-oneColor/Pattern_22.webp',
  'assets/img-oneColor/Pattern_23.webp',
  'assets/img-oneColor/Pattern_24.webp',
  'assets/img-oneColor/Pattern_25.webp',
  'assets/img-oneColor/Pattern_26.webp',
  'assets/img-oneColor/Pattern_27.webp',
  'assets/img-oneColor/Pattern_28.webp',
  'assets/img-oneColor/Pattern_29.webp',
  'assets/img-oneColor/Pattern_30.webp',
  'assets/img-oneColor/Pattern_31.webp',
  'assets/img-oneColor/Pattern_32.webp',
  'assets/img-oneColor/Pattern_33.webp',
  'assets/img-oneColor/Pattern_34.webp',
  'assets/img-oneColor/Pattern_35.webp',
  'assets/img-oneColor/Pattern_36.webp',
  'assets/img-oneColor/Pattern_37.webp',
  'assets/img-oneColor/Pattern_38.webp',
  'assets/img-oneColor/Pattern_39.webp',
  'assets/img-oneColor/Pattern_40.webp',
  'assets/img-oneColor/Pattern_41.webp',
  'assets/img-oneColor/Pattern_42.webp',
  'assets/img-oneColor/Pattern_43.webp',
  'assets/img-oneColor/Pattern_44.webp',
  'assets/img-oneColor/Pattern_45.webp',
  'assets/img-oneColor/Pattern_46.webp',
];

const backgroundColors = [ 
  '#3fa9f5', // Blue
  '#00a232', // Green
  '#fed700', //Yellow
  '#e62226' //red
];
const elements = {};
let cards = [];
let id = 1;
let numb = 9;
let cardSizeClass = 'card';
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let level = 'level1';
let matchCount = 0;
let startTime;
let clickCount = 0; 

// FUNKTIONEN
const selectLevel = evt => {
  const button = evt.currentTarget;
  const level = button.id;
  switch (level) {
    case 'level1':
      numb = 9;
      cardSizeClass = 'card';
      break;
    case 'level2':
      numb = 18;
      cardSizeClass = 'card-medium';
      break;
    case 'level3':
      numb = 36;
      cardSizeClass = 'card-large';
      break;
    default:
      numb = 9;
      cardSizeClass = 'card';
      break;
  }
  elements.board.innerHTML = ''; 
  cards = [];  
  generateCards();
  renderCards();
  startCountdown();
  matchCount = 0;
  clickCount = 0; 
  console.time('stopTime');
  startTime = Date.now(); 

  const levelSection = document.querySelector('#menu');
  setTimeout(() => {
    levelSection.classList.add('hidden');
  }, 1000);
  setTimeout(() => {
    levelSection.classList.add('disapear');
  }, 1500);
}
const createNumber = (min, max) => ~~(Math.random() * (max - min + 1) + min);

const generateCards = () => {
  const selectedImages = []; 
  const selectedIndices = []; 
  while (selectedImages.length < numb) { 
    const randomIndex = createNumber(0, images.length - 1);
    if (!selectedIndices.includes(randomIndex)) { 
      selectedIndices.push(randomIndex); 
      selectedImages.push(images[randomIndex]); 
    }    
  }
  for (const image of selectedImages) {  
    cards.push(card.create(id, image));
    cards.push(card.create(id, image));
    id++;
  }
};
const domMapping = () => {
  elements.board = document.querySelector('.container'); 
  elements.levelButtons = document.querySelectorAll('.level-btn'); 
  elements.newGame = document.querySelector('#newGame');
  elements.message  = document.querySelector('#messageDisplay');
  elements.countdown = document.querySelector('#countdown');
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const getRandomBackgroundColor = () => {
  const randomIndex = createNumber(0, backgroundColors.length - 1);
  return backgroundColors[randomIndex];
}

const renderCards = () => {
  const shuffledCards = shuffleArray(cards);
  for (const cardObj of shuffledCards) {
    const cardElement = document.createElement('div');
    cardElement.classList.add(cardSizeClass); 
    cardElement.style.backgroundImage = `url(${cardObj.frontImage})`; 
    cardElement.setAttribute('data-card-id', cardObj.id); 
    
    const randomColor = getRandomBackgroundColor();
    cardElement.style.backgroundColor = randomColor;
    setTimeout(() => {
      cardElement.style.backgroundImage = `url(${cardObj.backImage})`; 
    }, 10000);
    cardElement.addEventListener('click', () => {
      if (!cardObj.isFlipped && !lockBoard) {
        clickCount++;
        card.flip(cardObj);
        updateCardView(cardObj);
        checkForMatch(cardObj); 
      }
    });
    elements.board.appendChild(cardElement);
    cardObj.domEl=cardElement;
  }
};

const startCountdown = () => {
  let countdown = 10;
  elements.countdown.textContent = countdown;
  const countdownInterval = setInterval(() => {
    countdown--;
    elements.countdown.textContent = countdown;

    elements.countdown.classList.add('animate');
    setTimeout(() => {
      elements.countdown.classList.remove('animate');
    }, 500);

    if (countdown === 0) {
      clearInterval(countdownInterval);
      elements.countdown.textContent = '';
      elements.time.classList.add('disapear');
    }
  }, 1000);
  elements.time = document.querySelector('#time');
};
const updateCardView = (cardObj) => {
  cardObj.domEl.style.backgroundImage = `url(${cardObj.isFlipped ? cardObj.frontImage : cardObj.backImage})`;
};
const checkForMatch = (clickedCard) => { 
  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }
  secondCard = clickedCard;
  lockBoard = true;
  if (firstCard.id == secondCard.id) {
    card.match(firstCard);
    card.match(secondCard);
    const firstCardElement = document.querySelectorAll(`[data-card-id="${firstCard.id}"]`);
    firstCardElement.forEach(el => {
      let matchClass = '';
      switch (numb) {
        case 9:
          matchClass = 'matched-level1';
          break;
        case 18:
          matchClass = 'matched-level2';
          break;
        case 36:
          matchClass = 'matched-level3';
          break;
      }
      el.classList.add(matchClass);
    });
    resetBoard();
    matchCount++;
    checkAllMatched();
  } else {
    setTimeout(() => {
      card.flip(firstCard);
      card.flip(secondCard);
      updateCardView(firstCard);
      updateCardView(secondCard);
      resetBoard();
    }, 1000);
  }
};
const resetBoard = () => {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
};
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes,
    seconds
  };
};
const checkAllMatched = () => {
  if (matchCount === numb) {
    const endTime = Date.now(); 
    const milliseconds = endTime - startTime; 
    const time = formatTime(milliseconds);
    const winSection = document.querySelector('#win');
    elements.message.innerHTML = `<strong>Glückwunsch!</strong><br> Du hast alle Karten richtig zugeordnet!<br><br>Versuche: <strong>${clickCount / 2}</strong><br>Zeit:<b>${time.minutes} Minuten</b> und <strong>${time.seconds} Sekunden </strong>`;
    setTimeout(() => {
      winSection.classList.remove('youWin');
      winSection.classList.add('show');
    }, 2000);
  }
};
const NewGame = () => {
  const winSection = document.querySelector('#win');
  winSection.classList.remove('show');
  winSection.classList.add('youWin');
  const levelSection = document.querySelector('#menu');
  levelSection.classList.remove('hidden');
  levelSection.classList.remove('disapear');
  elements.time.classList.remove('disapear');

}
const appendEventlisteners = () => {
  for (const button of elements.levelButtons) {
    button.addEventListener('click', selectLevel);
  }
  elements.newGame.addEventListener('click', NewGame);
}
const init = () => {
  domMapping();
  generateCards();
  renderCards();
  appendEventlisteners();
  
}
// INIT
init();




