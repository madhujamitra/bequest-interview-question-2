# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**


Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance


## **Solution : My approch**


#### 1. How does the client ensure that their data has not been tampered with?

To ensure that the client's data has not been tampered with, we implemented a blockchain-like structure to store the data. Each piece of data is hashed using a cryptographic hash function (SHA-256) along with the hash of the previous block, creating a chain of blocks. This makes it extremely difficult to alter any piece of data without breaking the chain. The verification process traverses the entire blockchain to check the integrity of the data against all historical values stored in the blockchain. By comparing the hashes, the client can determine whether the data has been tampered with.


#### 2. If the data has been tampered with, how can the client recover the lost data?

If tampering is detected, the client can recover the lost data using the versioning system implemented in the blockchain. Each update to the data creates a new block with the data, its hash, and the hash of the previous block, maintaining a history of all changes. The client can retrieve this history and select a specific version to recover. The selected version is then added as new data with a new hash and previous hash, effectively restoring the data to a valid state. This ensures that the client can always roll back to a previously valid version of the data in case of tampering.

### Backend Code (app.ts) Confirmation
The backend code properly implements the linked list structure for the blockchain. Each block (node) in the chain contains the data, its hash, and the hash of the previous block, ensuring a linked sequence of data. The addBlock function correctly adds new blocks to the chain, and the verification process (/verify endpoint) iterates through the entire linked list to check the data integrity.

### Implementation Details

1. Linked List Structure: Each block in the blockchain contains data, a hash, and a previous hash, forming a linked list.
2. Verification: The /verify endpoint checks the data against all blocks in the linked list, ensuring comprehensive validation.
3. Recovery: The /recover endpoint allows retrieval of any historical data from the linked list, restoring the selected version as new data with a new hash.