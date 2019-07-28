# VoteBase
A PoC of a secure, reliable &amp; transparent E-voting system

The hassles of ballot based voting system is widely known. While Electronic-Voting does remove most of these hassles, it introduces its own security & trust issues.

However, we propose an End-To-End verifiable e-voting system using blockchain and advanced cryptographic techniques.

## Idea

### Voter ID application
The idea is fairly simple. There is one blockchain with its own set of miners for achieving consensus for the purpose of voter ID authentication, called the **IdentityChain**. To be more specific, as soon as a person turns 18, the system gets to know it and applies automatically for a voter ID. This is known from the Aadhar database to which the system will be linked. During this automatic application, the applicant will be asked a confirmation regarding the data about him/her including address, DOB etc. This is incase he/she wants to change it. Once the application reaches the queue, the miners of the IdentityChain, which is a network of trusted people having computational power, performs the Proof of Work and authenticates the application. When finished successfully, it will be added as a node in the IdentityChain.

### Voting process
A voter can view his/her voter-ID using a common dashboard. On the day of election, they can cast a vote from anywhere in the world digitally. They just need to login into the voting app on which their node in IdentityChain will be fetched. They can view all the candidates and cast their vote. Upon voting, their ID as well as the vote is encrypted using **HOMOMORPHIC ENCRYPTION**.

#### Why Homomorphic encryption?
Using this technique, the encrypted text can never be decrypted into the original plaintext but matches the results of operations as if they were performed on plaintext.

Coming back, the encrypted token is recieved by the voter, which is also added to the second blockchain, called the **VoteChain**. The VoteChain has its own set of miners and upon consensus, the node is added onto the chain, which the voter can verify whether their vote has been accounted while final counting.

### Tabulation
Once the election gets over, the system automatically takes all the cipher texts from the VoteChain, multiplies it to get the result which is who got the highest number of votes. How is this possible? This is where the beauty of homomorphic encryption comes into play. When all the cipher texts are multiplied, the product signifies the candidate who got the highest votes. The public can verfiy this result since the VoteChain is made publicly available.

Hence, with the voters being able to verify whether their vote is accounted, with voters able to verify that their vote is correctly recorded and with the public being able to cross check the tabulation of votes, we achieve security, reliablility and transparency. This is the End-To-End verifiable e-voting system, **VoteBase**.
