const Meme = artifacts.require("Meme");

contract("Meme", function(accounts) {
  let memeInstance;
  before(async () => {
    memeInstance = await Meme.deployed();
  });

  describe("deployment", () => {
    it("deploys successfully", async () => {
      const address = await memeInstance.address;
      assert.notEqual(address, "0x0");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.notEqual(address, "");
    });
  });
});
