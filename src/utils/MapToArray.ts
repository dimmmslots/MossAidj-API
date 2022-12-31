export const convertMapToArray = (data: Map<string, string[]>) => {
  let result = [];
  data.forEach((value, key) => {
    let temp = {
      quiz: key,
      poin: value,
    };
    result.push(temp);
  });
  return result;
};
