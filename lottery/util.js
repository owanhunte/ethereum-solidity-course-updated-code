async function enterPlayerInLottery(
  lotteryContract,
  playerAddress,
  web3Instance,
  etherAmount
) {
  await lotteryContract.methods.enter().send({
    from: playerAddress,
    value: etherAmount ? web3Instance.utils.toWei(etherAmount, "ether") : 0
  });
}

module.exports = {
  enterPlayerInLottery
};
