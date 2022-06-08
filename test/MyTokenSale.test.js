require("dotenv").config({ path: "../.env" });
const MyTokenSale = artifacts.require("./MyTokenSale.sol");
const MyToken = artifacts.require("./MyToken.sol");
const KycContract = artifacts.require("./KycContract.sol");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("MyTokenSale", async (accounts) => {
    const [deployerAccount, recipient, anotherAccount] = accounts;

    it("should not have any tokens in my deployerAccount", async () => {
        const instance = await MyToken.deployed();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("all tokens should be in the TokenSale Smart Contract by default", async () => {
        const instance = await MyToken.deployed();
        const balanceOfTokenSaleSmartContract = await instance.balanceOf(MyTokenSale.address);
        const totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
    })

    it("should be possible to buy tokens", async () => {
        const myTokenInstance = await MyToken.deployed();
        const myTokenSaleInstance = await MyTokenSale.deployed();
        const kycInstance = await KycContract.deployed();
        const balanceBefore = await myTokenInstance.balanceOf(deployerAccount);
        await kycInstance.setKycCompleted(deployerAccount);
        await myTokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", "wei")});
        return expect(myTokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
    })
});