export function convertPoinToMap(poin: any) {
  let data = new Map();
  let old_quiz = poin[0].quiz.split(",");
  for (let i = 0; i < old_quiz.length; i++) {
    data.set(old_quiz[i], null);
  }
  for (let i = 0; i < poin[0].quiz.split(",").length; i++) {
    let temp = [];
    for (let j = 0; j < poin.length; j++) {
      temp.push(poin[j].poin.split(",")[i]);
    }
    data.set(old_quiz[i], temp);
  }
  return data;
}
