import { u128,storage, Context, ContractPromiseBatch,logging, PersistentVector } from "near-sdk-as"
import { AccountId, ONE_NEAR } from '../../utils';

export enum States{Free,Processing,Booked}

@nearBindgen
export class Rental {

  vehicle: string;
  owner: AccountId;
  description: string; //Contact no. ,email and physical address are must
  state: States;
  pricePerHour: u128;
  payed:bool;
  tenant:AccountId;
  approved:bool;
  price:u128;

  constructor(vehicle: string, description: string, pricePerHour:u128) {
    this.owner = Context.sender;
    this.state = States.Free;
    this.description = description;
    this.pricePerHour=pricePerHour;
    this.payed=false;
    this.approved=false;
  }

  @mutateState()
  interested( hours: u128): void{
    assert(this.state == States.Free, `Vehicle is not currently free and is in the process of being rented to ${this.tenant}`);
    this.tenant=Context.sender;
    this.state=States.Processing;
    this.price=u128.mul(ONE_NEAR,u128.mul(hours,this.pricePerHour));
    logging.log(`Once approved,you need to pay ${u128.div(this.price,ONE_NEAR)} NEAR`);
  }

  @mutateState()
  give_Approval(): void{
    if (!this.approved){
      assert(this.state == States.Processing, `No approval needed as of now`);
      assert(this.owner==Context.sender, `Approval can only be granted by the rentee.`);
      this.approved=true;
    }
  }

  @mutateState()
  do_payment(): void{
    assert(this.tenant==Context.sender,`Only ${this.tenant} can call this function once approval is given`);
    assert(this.approved==true,`Please ask the tenant for approval`);
    assert(u128.from(Context.attachedDeposit)==this.price,`Please pay ${this.price}!`);
    ContractPromiseBatch.create(this.owner).transfer(this.price);
    this.state=States.Booked;
  }

}

export let rentals= new PersistentVector<Rental>("r");
