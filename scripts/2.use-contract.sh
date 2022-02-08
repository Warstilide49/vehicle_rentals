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

near call $CONTRACT addRental '{"vehicle":"Car","description":"A Tesla is available for rent. Contact tesla@gmail.com or +1234567890 for more details.","pricePerHour":"1"}' --accountId $ACC1
near call $CONTRACT addRental '{"vehicle":"Bike","description":"A bike is available for rent. Contact bike@gmail.com or +1111111111 for more details","pricePerHour":"3"}' --accountId $ACC1
near call $CONTRACT addRental '{"vehicle":"Scooter","description":"A scooter is available for rent. Contact scooty@gmail.com or +2222222222 for details.","pricePerHour":"4"}' --accountId $ACC1
near call $CONTRACT addRental '{"vehicle":"3-wheeled scooter","description":"A 3-wheeled scooter is available for rent. Contact us for details.","pricePerHour":"5"}' --accountId $ACC1

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
