# Renting Vehicles using NEAR!

This repo contains a smart contract written in Assemblyscript which can enable people to rent vehicles. [starter--near-sdk-as](https://github.com/Learn-NEAR/starter--near-sdk-as) was used as a starting point for this project.

To get started:

 1. Clone this repository using ``` git clone ``` 
 2. Install the dependencies using ```yarn```
 3. Use the command ```./scripts/1.dev-deploy.sh``` to deploy it on a dev account.
 4. Use ```./scripts/2.use-contract.sh``` to try out the smart contract. It requires you to have full access keys to two accounts.


## Contents

[TOC]

## Structure
```
├── asconfig.json
├── as-pect.config.js
├── package.json
├── package-lock.json
├── README.md
├── scripts
│   ├── 1.dev-deploy.sh
│   ├── 2.use-contract.sh
│   ├── 3.cleanup.sh
│   └── README.md
├── src
│   ├── as_types.d.ts
│   ├── main
│   │   ├── asconfig.json
│   │   ├── assembly
│   │   │   ├── index.ts
│   │   │   └── model.ts
│   │   └── __tests__
│   │       ├── as-pect.d.ts
│   │       └── index.unit.spec.ts
│   ├── tsconfig.json
│   └── utils.ts
└── yarn.lock
```

The smart contract resides in /src/main. The ```model.ts``` file contains the main class ```Rental``` and the PersistentVector ```rentals``` which stores all of our class objects. The ```index.ts``` file contains functions that help us to interact with our class objects by providing the index of the object in the PersistentVector.

## Exported functions

The functions which can be used are the ones in index.ts. They have been listed as follows. *Please note that the function where input isnt mentioned, takes index(u32) or index(128) of the rental in the vector.*
1. addRental (change function)
 - Takes three inputs vehicle(string), description(string) and pricePerHour(u128) to initialise the object and add it into the PersistentVector ```rentals```
2. getAllRentals (view function)
 - Logs all the rentals available
3. currentTenant (view function)
 - Logs the current tenant of the vehicle when index(u32) of the rental in the vector is provided
4. getStatus (view function)
 - Logs the status, i.e. Free, Processing or Booked
5. interestedInARental (change function)
 - Used to show interest in the rental. The account calling this function becomes the tenant provided that the state is "Free"
 - Takes in hours(u128) as an input alongwith index(32) of the rental in the vector.
6. giveApproval (change function)
 - Function will give approval to the tenant to use their vehicle. It is assumed that they have established contact and done necessary verification.
 - Can only be called by the owner of the rental
8. rejectApproval (change function)
 - Function will reject approval to the tenant to use their vehicle.It will reset the object properties.
 - Can only be called by the owner of the rental
7. pay (change function)
 - Function to pay the necessary amount i.e. ```pricePerHour * hours``` to the owner of the rental.
 -Can only be called by the tenant after seeking approval.
8. resetRental (change function)
 - To reset the rental so that it can be processed again.
 - Can only be called by the rental owner once the state is "Booked".
9. deleteRental (change function)
 - To delete a rental
 - Can only be called by owner

## Helper functions

Three helper functions were used to facilitate writing into a PersistentVector.

1. deleteAtIndex
 - Used to delete any object from the PersistentVector so as to maintain their order
2. pushAtIndex
 - Used to push any object at an index to the PersistentVector so as to maintain their order.

## Future plans

- Managing multiple interests in a rental.
- Maintaining time to ensure late fees is charged
- Addition of IOT to keep tabs on the vehicle.
- Integration of IPFS to store and serve images.
- Frontend
