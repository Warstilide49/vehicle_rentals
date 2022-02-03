import { u128,storage, Context, ContractPromiseBatch,logging,PersistentVector} from "near-sdk-as"
import { AccountId, ONE_NEAR} from '../../utils';
import { States, Rental, rentals} from "./model";


export function addRental(vehicle: string, description: string, pricePerHour:u128): void{
	let o=new Rental(vehicle, description, pricePerHour);
	rentals.push(o);
}
 
export function getAllRentals():void{
	for(let i=0;i<rentals.length; i++){
		logging.log(`Index:${i} : Rental published by ${rentals[i].owner} with description ${rentals[i].description} and price per hour of ${rentals[i].pricePerHour}. Current state is ${rentals[i].state}`);
	}
}

export function currentTenant(key:u32) :void{
	logging.log(`Current tenant is ${rentals[key].tenant}`);
}

export function getState(key:u32): States{
	return rentals[key].state;
}

export function interestedInARental(key:u32, hours:u128): void{
	let previous=removeRentalInContract(key);
	let o=new Rental(previous.vehicle, previous.description, previous.pricePerHour);
	o.owner=previous.owner;
	o.interested(hours);
	rentals.push(o);
}

export function giveApproval(key:u32) :void{
	let previous=removeRentalInContract(key);
	let o=new Rental(previous.vehicle, previous.description, previous.pricePerHour);
	o.owner=previous.owner;
	o.interested(u128.div (u128.div (previous.price,ONE_NEAR), previous.pricePerHour));
	o.give_Approval();
	logging.log(`${o.owner} has given approval`);
	rentals.push(o);
}

export function pay(key:u32): void{
	let previous=removeRentalInContract(key);
	let o=new Rental(previous.vehicle, previous.description, previous.pricePerHour);
	o.owner=previous.owner;
	o.approved=previous.approved;
	o.interested(u128.div (u128.div (previous.price,ONE_NEAR), previous.pricePerHour));
	o.give_Approval();
	o.do_payment();
	rentals.push(o);
	logging.log(`Successfully payment done of ${o.price} by ${o.tenant} towards ${o.owner}`);
}

function removeRentalInContract( key:u32 ): Rental{
	return rentals.swap_remove(key);
}

export function deleteRental( key: u32): Rental {
	assert(Context.sender==rentals[key].owner,`A rental can only be deleted by their owner who is ${rentals[key].owner}`);
	logging.log(`Successfully removed Rental indexed by ${key}`);
	return rentals.swap_remove(key);
}

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
