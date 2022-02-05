#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

near call $CONTRACT addRental '{"vehicle":"Car","description":"first one","pricePerHour":"1"}' --accountId alice.evin.testnet
near call $CONTRACT addRental '{"vehicle":"Bike","description":"second one","pricePerHour":"3"}' --accountId alice.evin.testnet
near call $CONTRACT addRental '{"vehicle":"Scooter","description":"third one","pricePerHour":"4"}' --accountId alice.evin.testnet
near call $CONTRACT addRental '{"vehicle":"3-wheeled scooter","description":"fourth one","pricePerHour":"5"}' --accountId alice.evin.testnet
near view $CONTRACT getAllRentals
near call $CONTRACT interestedInARental '{"key":"1","hours":"3"}' --accountId bob.evin.testnet
near view $CONTRACT getAllRentals
near call $CONTRACT giveApproval '{"key":"1"}' --accountId alice.evin.testnet
near call $CONTRACT pay '{"key":"1"}' --accountId bob.evin.testnet --amount 9
near view $CONTRACT getAllRentals

echo
exit 0
