# POSDAO test setup

This is a modified version of the integration tests written for AuRa POSDAO with Parity nodes (see https://github.com/poanetwork/posdao-test-setup).  
This version is for testing genesis initialization with the [hbbft posdao contracts](https://github.com/artis-eco/hbbft-posdao-contracts), configured for a single validator.

## Requirements

* A binary `openethereum-hbbft` in the project root folder (can also be a symlink).
* A config file for the KeyGenHistory contract (original or symlink) inside the sub-folder `posdao-contracts`.

