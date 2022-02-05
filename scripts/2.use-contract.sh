#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Check for environment variable with contract name and account names"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

[ -z "$ACC1" ] && echo "Missing \$ACC1 environment variable" && exit 1
[ -z "$ACC1" ] || echo "Found it! \$ACC1 is set to [ $ACC1 ]"

[ -z "$ACC2" ] && echo "Missing \$ACC2 environment variable" && exit 1
[ -z "$ACC2" ] || echo "Found it! \$ACC2 is set to [ $ACC2 ]"

echo ---------------------------------------------------------
echo "Adding 4 rentals in the name of [$ACC1] "
echo ---------------------------------------------------------
echo 

near call $CONTRACT addRental '{"vehicle":"Car","description":"first one","pricePerHour":"1"}' --accountId $ACC1
near call $CONTRACT addRental '{"vehicle":"Bike","description":"second one","pricePerHour":"3"}' --accountId $ACC1
near call $CONTRACT addRental '{"vehicle":"Scooter","description":"third one","pricePerHour":"4"}' --accountId $ACC1
near call $CONTRACT addRental '{"vehicle":"3-wheeled scooter","description":"fourth one","pricePerHour":"5"}' --accountId $ACC1

echo ---------------------------------------------------------
echo "Checking current rentals.."
echo ---------------------------------------------------------
echo 

near view $CONTRACT getAllRentals

echo ---------------------------------------------------------
echo "[$ACC2] is interested in rental 1"
echo ---------------------------------------------------------
echo 

near call $CONTRACT interestedInARental '{"key":"1","hours":"3"}' --accountId $ACC2

echo ---------------------------------------------------------
echo "Checking current rentals.."
echo ---------------------------------------------------------
echo 

near view $CONTRACT getAllRentals

echo ---------------------------------------------------------
echo "Giving approvals from [$ACC1]"
echo ---------------------------------------------------------
echo 

near call $CONTRACT giveApproval '{"key":"1"}' --accountId $ACC1

echo ---------------------------------------------------------
echo "Paying from [$ACC2] "
echo ---------------------------------------------------------
echo 

near call $CONTRACT pay '{"key":"1"}' --accountId $ACC2 --amount 9

echo ---------------------------------------------------------
echo "Logging final state of the vector.. "
echo ---------------------------------------------------------
echo

near view $CONTRACT getAllRentals

echo
exit 0
