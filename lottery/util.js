async function enterPlayerInLottery(
  lotteryContract,
  playerAddress,
  web3Instance
) {
  await lotteryContract.methods.enter().send({
    from: playerAddress,
    value: web3Instance.utils.toWei("0.02", "ether")
  });
}

module.exports = {
  enterPlayerInLottery
};
