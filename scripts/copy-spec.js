const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const assert = require('assert');
const constants = require('../utils/constants');

function fixSpecBuiltin(builtin) {
  let newBuiltin = builtin;
  let newPricing = builtin.pricing;

  delete newBuiltin.activate_at;
  delete newBuiltin.eip1108_transition;
  if (newPricing.alt_bn128_const_operations) {
    newPricing.alt_bn128_const_operations.price = newPricing.alt_bn128_const_operations.eip1108_transition_price;
    delete newPricing.alt_bn128_const_operations.eip1108_transition_price;
  } else if (newPricing.alt_bn128_pairing) {
    newPricing.alt_bn128_pairing.base = newPricing.alt_bn128_pairing.eip1108_transition_base;
    newPricing.alt_bn128_pairing.pair = newPricing.alt_bn128_pairing.eip1108_transition_pair;
    delete newPricing.alt_bn128_pairing.eip1108_transition_base;
    delete newPricing.alt_bn128_pairing.eip1108_transition_pair;
  }
  newBuiltin.pricing = { "0" : { "price" : newPricing } }

  return newBuiltin;
}

function leftTrimAddress(address) {
  return address.replace(/^[0|x]+/, '');
}

async function main() {
  let specFile = await readFile(__dirname + '/../posdao-contracts/spec_hbbft.json', 'UTF-8');
  assert(typeof specFile === 'string');
  specFile = JSON.parse(specFile);

  /*

  const exec = promisify(require('child_process').exec);
  const { stdout, stderr } = await exec('./openethereum-hbbft --version');

  assert(!stderr);

  const version = stdout.match(/v([0-9]+)\.([0-9]+)\.([0-9]+)/);
  const versionMajor = version[1];
  const versionMinor = version[2];
  const versionPatch = version[3];

  function isVersionGte(expectedMajor, expectedMinor, expectedPatch) {
    if (versionMajor < expectedMajor) {
      return false;
    } else if (versionMajor == expectedMajor && versionMinor < expectedMinor) {
      return false;
    } else if (versionMajor == expectedMajor && versionMinor == expectedMinor && versionPatch < expectedPatch) {
      return false;
    }
    return true;
  }

  if (isVersionGte(2,7,0)) { // if this is Parity Ethereum >= v2.7.0
    // Apply a new format to spec.json (the new format is actual beginning from Parity 2.6.5-beta)
    const accounts = Object.keys(specFile.accounts);
    for (let i = 0; i < accounts.length; i++) {
      const address = accounts[i];
      const addressTrimmed = leftTrimAddress(accounts[i]);
      if (addressTrimmed >= 1 && addressTrimmed <= 9) {
        const account = '0x' + addressTrimmed.padStart(40, '0')
        const accountObj = specFile.accounts[address];
        delete specFile.accounts[address];
        specFile.accounts[account] = accountObj;
        specFile.accounts[account].builtin = fixSpecBuiltin(specFile.accounts[account].builtin);
      }
    }
  }

   */

  await promisify(fs.writeFile)(__dirname + '/../parity-data/spec.json', JSON.stringify(specFile, null, '  '), 'UTF-8');
}

main();
