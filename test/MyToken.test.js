require("dotenv").config({ path: "../.env" });
const MyToken = artifacts.require("./MyToken.sol");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("MyToken", async (accounts) => {
    const [deployerAccount, recipient, anotherAccount] = accounts;

    beforeEach(async () => {
        this.myToken = await MyToken.new(process.env.INITIAL_TOKENS);
    })

    it("all tokens should be in my account", async () => {
        const instance = this.myToken;
        const totalSupply = await instance.totalSupply();
        const balance =  await instance.balanceOf(deployerAccount);
        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    })

    it("is possible to send token between accounts", async () => {
        const sendTokens = 1;
        const instance = this.myToken;
        const totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        await instance.transfer(recipient, sendTokens)
        expect(instance.balanceOf(deployerAccount)).to.be.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.be.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })

    it("is not possible to send more token than available in total", async () => {
        const instance = this.myToken;
        const balanceOfDeployer = await instance.balanceOf(deployerAccount);
        const totalSupply = await instance.totalSupply();

        // console.log('account: ', deployerAccount)
        // console.log('total: ', totalSupply)
        try {
            await instance.transfer(recipient, new BN(balanceOfDeployer+1))
        } catch {
        }
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    })
});