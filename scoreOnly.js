let scoreList = localStorage.getItem('scoreList');
let playerNameOnly = localStorage.getItem('player');
console.log(scoreList);

if (scoreList) {
  scoreList = JSON.parse(scoreList);
} else {
  scoreList = [];
}

const scoresBody = document.getElementById('scores-body');

for (let i = 0; i < scoreList.length; i++) {
  const name = scoreList[i].name;
  const score = scoreList[i].score;

  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.textContent = name;
  row.appendChild(nameCell);

  const scoreCell = document.createElement('td');
  scoreCell.textContent = score;
  row.appendChild(scoreCell);

  scoresBody.appendChild(row);
}

document.querySelector('.liste-des-scores-nom').innerHTML = scoreList;
