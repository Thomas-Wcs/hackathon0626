let joueurScore = 0;
let robotScore = 0;
let egaliteScore = 0;
let playerNameStorage = localStorage.getItem('player');

const buttons = document.querySelectorAll('button');

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    const joueur = buttons[i].innerHTML.trim();
    const robot =
      buttons[Math.floor(Math.random() * buttons.length)].innerHTML.trim();
    console.log(` "${joueur}","${robot}" `);

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
  });

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
