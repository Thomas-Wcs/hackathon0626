let joueurScore = 0;
let robotScore = 0;
let egaliteScore = 0;

// const playerName = prompt('Veuillez entrer votre nom :');
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

    document.querySelector('.joueur-annonce').innerHTML = humanScore;
    document.querySelector('.robot-annonce').innerHTML = robotDisplayScore;

    document.querySelector('.result-annonce').innerHTML = resultMessage;
  });
}
