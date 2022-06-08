"use strict";
const BN = web3.utils.BN;
const chai = require("chai");
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

module.exports = chai;