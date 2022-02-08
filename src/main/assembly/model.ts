import { u128,storage, Context, ContractPromiseBatch,logging, PersistentVector } from "near-sdk-as"
import { AccountId, ONE_NEAR } from '../../utils';

//States will tell us the current state of the rental
export enum States{Free,Processing,Booked}

//Main class
@nearBindgen
export class Rental {

  vehicle: string;  
  owner: AccountId;
  description: string; //Contact no. ,email and physical address are must
  state: States;
  pricePerHour: u128;
  tenant:AccountId;
  approved:bool;
  price:u128;

  //Takes these 3 arguments to initialise a Rental object
  constructor(vehicle: string, description: string, pricePerHour:u128) {
    this.owner = Context.sender;
    this.state = States.Free;
    this.vehicle=vehicle;
    this.description = description;
    this.pricePerHour=pricePerHour;
    this.approved=false;
  }

  //Anyone can be interested in any rental, argument is no. of hours they will need it for
  @mutateState()
  interested( hours: u128): void{
    assert(this.state != States.Processing, `Vehicle is not currently free and is in the process of being rented to ${this.tenant}`);
    assert(this.state != States.Booked, `Vehicle is booked by ${this.tenant}`);
    this.tenant=Context.sender;
    this.state=States.Processing;
    this.price=u128.mul(ONE_NEAR,u128.mul(hours,this.pricePerHour));
  }

  //Approval will be given by the owner towards the one who showed interest the latest
  @mutateState()
  give_Approval(): void{
    if (!this.approved){
      assert(this.state == States.Processing, `No approval needed as of now`);
      assert(this.owner==Context.sender, `Approval can only be granted by the rentee.`);
      this.approved=true;
    }
  }

  //To not give permission
  reject_Approval(): void{
    assert(this.approved==false, `It has already been approved, cant be rejected now.`);
    assert(this.state==States.Processing,` The rental should be processing, not free or booked`);
    this.state=States.Free;
    this.tenant="";
    this.price=u128.from(0);
  }

  //Payment will be done by the chosen tenant towards the owner once approved
  @mutateState()
  do_payment(): void{
    assert(this.tenant==Context.sender,`Only ${this.tenant} can call this function once approval is given`);
    assert(this.approved==true,`Please ask the tenant for approval`);
    assert(u128.from(Context.attachedDeposit)==this.price,`Please pay ${this.price}!`);
    ContractPromiseBatch.create(this.owner).transfer(this.price);
    this.state=States.Booked;
  }

  //Reset function to reset the rental instead of adding it again
  @mutateState()
  reset(): void{
    assert(this.state==States.Booked,`Only reset if the booking is over and you need to post it again.`);
    assert(this.owner==Context.sender,`Only owner can reset`);
    this.state=States.Free;
    this.approved=false;
    this.tenant="";
    this.price=u128.from(0);
  }
}

//Persistent Vector to carry our rental objects
export let rentals= new PersistentVector<Rental>("r");
