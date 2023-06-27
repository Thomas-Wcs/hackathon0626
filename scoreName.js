let scoreList = localStorage.getItem('scoreList');
let playerNameOnly = localStorage.getItem('player');
// console.log(playerNameOnly);
// console.log(existingPlayer);

if (scoreList) {
  scoreList = JSON.parse(scoreList);
} else {
  scoreList = [];
}

const playerForm = document.getElementById('playerForm');

playerForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const playerNameInput = document.getElementById('playerName');
  const playerName = playerNameInput.value;

  const score = Number;

  const playerScore = {
    name: playerName,
    score: score,
  };

  scoreList.push(playerScore);

  localStorage.setItem('scoreList', JSON.stringify(scoreList));
  localStorage.setItem('player', JSON.stringify(playerName));

  const existingPlayer = scoreList.find((player) => player.name === playerName);

  if (existingPlayer) {
    existingPlayer.score = score;
  } else {
    scoreList.push(playerScore);
  }

  playerNameInput.value = '';
});
