let scoreList = localStorage.getItem('scoreList');
let playerNameOnly = localStorage.getItem('player');
console.log(scoreList);

if (scoreList) {
  scoreList = JSON.parse(scoreList);
} else {
  scoreList = [];
}

let playerNameDisplay = '';
for (let i = 0; i < scoreList.length; i++) {
  const score = scoreList[i].score ? scoreList[i].score : '';
  playerNameDisplay += `${scoreList[i].name}: ${score}<br>`;
}

document.querySelector('.liste-des-scores-nom').innerHTML = playerNameDisplay;
