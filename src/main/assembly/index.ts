import { u128,storage, Context, ContractPromiseBatch,logging,PersistentVector} from "near-sdk-as"
import { AccountId, ONE_NEAR} from '../../utils';
import { States, Rental, rentals} from "./model";

//Add the rental to the vector
export function addRental(vehicle: string, description: string, pricePerHour:u128): void{
	let o=new Rental(vehicle, description, pricePerHour);
	rentals.push(o);
}

//Logs all the rentals available with their current state.
export function getAllRentals():void{
	for(let i=0;i<rentals.length; i++){
		logging.log(`Index:${i} : Rental published by ${rentals[i].owner} for vehicle ${rentals[i].vehicle} with description "${rentals[i].description}" and price per hour of ${rentals[i].pricePerHour}. Current state is ${rentals[i].state}`);
	}
}

//Gives current tenant to a rental by providing its index in the persistent vector
export function currentTenant(key:u32) :void{
	logging.log(`Current tenant is ${rentals[key].tenant}`);
}

//Gives status of the rental
export function getStatus(key:u32): void{
	if (rentals[key].state==0){
		logging.log(`It is currently free.`);
	}
	else if(rentals[key].state==1){
		logging.log(`It is currently in process of being booked by ${rentals[key].tenant}`);
	}
	else{
		logging.log(`It is booked by ${rentals[key].tenant}`)
	}
}

// Since we cant change attributes of the elements in a persistent vector, a suboptimal solution was to delete that object, apply the
// function and add it back at the initial index in the persistent vector. This is done by the two helper functions

// To show interest in a rental
export function interestedInARental(key:u128, hours:u128): void{
	let previous=deleteAtIndex(key);
	previous.interested(hours);
	logging.log(`Once approved,you need to pay ${u128.div(previous.price,ONE_NEAR)} NEAR`);
	pushAtIndex(previous, key);
}

// Give approval to tenant, can only be called by the owner
export function giveApproval(key:u128) :void{
	let previous=deleteAtIndex(key);
	previous.give_Approval();
	logging.log(`${previous.owner} has given approval to ${previous.tenant}`);
	pushAtIndex(previous, key);
}

// To reject a tenant
export function rejectApproval(key:u128) :void{
	let previous=deleteAtIndex(key);
	previous.reject_Approval();
	logging.log(`${previous.owner} has rejected the approval to ${previous.tenant}`);
	pushAtIndex(previous, key);
}

//Function to pay for the rental 
export function pay(key:u128): void{
	let previous=deleteAtIndex(key);
	previous.do_payment();
	pushAtIndex(previous, key);
	logging.log(`Successfully payment done of ${previous.price} by ${previous.tenant} towards ${previous.owner}`);
}

//Delete A Rental from the Persistent Vector
export function deleteRental( key: u32): bool {
	assert(Context.sender==rentals[key].owner,`A rental can only be deleted by their owner who is ${rentals[key].owner}`);
	logging.log(`Successfully removed Rental indexed by ${key}`);
	deleteAtIndex(u128.from(key));
	return true
}

// Reset a rental after it was booked
export function resetRental(key: u128): void{
	let previous=deleteAtIndex(key);
	previous.reset();
	pushAtIndex(previous, key);
	logging.log(`Successfully resetted. Current tenant is ${previous.tenant},price is ${previous.price}`);
}

//Helper function to delete an element at an index
function deleteAtIndex(index:u128): Rental{
	let temp=new PersistentVector<Rental>("temp");
	let i:u128;
	if(index== u128.from(rentals.length-1)){
		return rentals.pop();
	}
	for(i= u128.sub( u128.from(rentals.length), u128.from(1)); i>u128.from(index); i--){
		let element=rentals.pop();
		temp.push(element);
	}
	let main=rentals.pop();
	let successors=temp.length;
	for(let j=0;j<successors;j++){
		rentals.push(temp.pop());
	}
	return main;
}

//Helper function to push an element at an index
function pushAtIndex(toBeAdded: Rental,index:u128): bool{
	let temp=new PersistentVector<Rental>("t");
	let i:u128;
	if(index== u128.from(rentals.length-1)){
		rentals.push(toBeAdded);
		return true;
	}
	for(i= u128.sub( u128.from(rentals.length), u128.from(1)); i>=u128.from(index); i--){
		let element=rentals.pop();
		temp.push(element);
	}
	rentals.push(toBeAdded);
	let successors=temp.length;
	for(let j=0;j<successors;j++){
		rentals.push(temp.pop());
	}
	return true;
}

/*

//Demo to check if the functions are even working. This gave me insight into how we cannot change attributes of elements in a persistent vector.
export function forOneObject(vehicle: string, description: string, pricePerHour:u128, hours:u128): void{
	let o=new Rental(vehicle, description, pricePerHour);
	logging.log(`Rental published by ${o.owner} with description ${o.description} and price per hour of ${o.pricePerHour}`);
	o.interested(hours);
	logging.log(`${o.tenant} is interested for ${o.price} i.e. ${hours} hours`);
	o.give_Approval()
	logging.log(`${o.owner} has given approval and the current state is ${o.state}`);
	o.do_payment()
	logging.log(`Successfully payment done of ${o.price} by ${o.tenant} towards ${o.owner}`);
}
*/
