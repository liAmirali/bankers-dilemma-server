export const getMyScore = (myMove: MoveOption, theirMove: MoveOption) => {
  if (myMove === theirMove) {
    if (myMove === "confront") return 1;
    else if (myMove === "cooperate") return 3;
    else return -1;
  } else {
    if (myMove === "confront") return 5;
    else if (myMove === "cooperate") return 0;
    else return -1;
  }
};
