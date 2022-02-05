## Tips for using scripts

1. Pay close attention to check if the "key" variable is u128 or u32. In case of u128 the input number must be like "1". 
2. In the **2.use-contract.sh** file, ACC1 is the owner of the rentals and ACC2 is the tenant. If two accounts are unavailable ,create accounts using [near create-account](https://docs.near.org/docs/concepts/account#accounts-and-contracts).
3. To use **3.cleanup.sh** export BENEFICIARY to an account where the near tokens would be sent once the account is deleted. 