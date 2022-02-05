#!/usr/bin/env bash

near call $CONTRACT trialAdd '{"vehicle":"E","description":"one","pricePerHour":"1"}' --accountId alice.evin.testnet
near call $CONTRACT trialAdd '{"vehicle":"E","description":"two","pricePerHour":"1"}' --accountId alice.evin.testnet
near call $CONTRACT trialAdd '{"vehicle":"E","description":"three","pricePerHour":"1"}' --accountId alice.evin.testnet
near call $CONTRACT trialAdd '{"vehicle":"E","description":"four","pricePerHour":"1"}' --accountId alice.evin.testnet
near view $CONTRACT trialGet
near call $CONTRACT tryingToDelete '{"index":"1"}' --accountId bob.evin.testnet
near view $CONTRACT trialGet

exit 0
