let joueurScore = 0;
let robotScore = 0;
let egaliteScore = 0;
let playerNameStorage = localStorage.getItem('player');
let playerScoreStorage = localStorage.getItem('scoreList');
let endGame = false;
console.log(playerScoreStorage);

const buttons = document.querySelectorAll('button');

const handleClick = (i) => {
  if (!endGame) {
    const joueur = buttons[i].innerHTML.trim();
    const robot =
      buttons[Math.floor(Math.random() * buttons.length)].innerHTML.trim();

    let resultat = '';

    if (
      (joueur === 'Pierre' && robot === 'Ciseaux') ||
      (joueur === 'Feuille' && robot === 'Pierre') ||
      (joueur === 'Ciseaux' && robot === 'Feuille')
    ) {
      resultat = 'Le joueur a gagné';
      joueurScore++;
    } else if (joueur === robot) {
      resultat = 'Égalité';
      egaliteScore++;
    } else {
      resultat = 'Le joueur a perdu';
      robotScore++;
    }

    const resultMessage = `Joueur : ${joueur}. Robot : ${robot}. Résultat : ${resultat} !`;
    const humanScore = ` Joueur : ${joueurScore}  `;
    const robotDisplayScore = ` Robot : ${robotScore}  `;
    const playerNameDisplay = ` hi ${playerNameStorage}: `;

    document.querySelector('.name-player-and-score').innerHTML =
      playerNameDisplay;
    document.querySelector('.joueur-annonce').innerHTML = humanScore;
    document.querySelector('.robot-annonce').innerHTML = robotDisplayScore;
    document.querySelector('.result-annonce').innerHTML = resultMessage;
  }

  function rejouer() {
    location.reload();
  }

  let countdown = 5;

  if (joueurScore === 5 || robotScore === 5) {
    endGame = true;
    let endGameMessage = `Le jeu est terminé ! Joueur : ${joueurScore} Robot : ${robotScore}`;

    const countdownInterval = setInterval(() => {
      countdown--;
      endGameMessage = ` Joueur : <span style="color: yellow">${joueurScore}</span> Robot : <span style="color: blue">${robotScore}</span> </br> Restart dans : <span style="color: red">${countdown}</span> seconde(s)!  `;
      document.querySelector('.result-annonce').innerHTML = endGameMessage;
      if (countdown === 0) {
        localStorage.setItem('scoreList', JSON.stringify(joueurScore));
        clearInterval(countdownInterval);
        rejouer();
      }
    }, 1000);
  }
};
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => handleClick(i));

  //Gestion du son ==>

  const cardClickButtons = document.querySelectorAll(
    '.conteneur-buttons button'
  );
  const clickSoundCart = document.getElementById('clickCardSound');

  cardClickButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      clickSoundCart.play();
    });
  });

  const playButton = document.getElementById('playButton');
  const clickSound = document.getElementById('clickSound');

  let isPlaying = false;

  playButton.addEventListener('click', function () {
    if (isPlaying) {
      clickSound.pause();
      isPlaying = false;
      playButton.style.backgroundImage = "url('./assets/images/son2.png')";
    } else {
      clickSound.play();
      isPlaying = true;
      playButton.style.backgroundImage = "url('./assets/images/sonNon.png')";
    }
  });
}
