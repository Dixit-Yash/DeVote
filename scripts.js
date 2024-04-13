//const Web3 = require('web3');
const web3 = new Web3(window.ethereum);
let account;
const CONTRACT_ADDRESS = "0xAC3A6a7169aBac82816D053575A0F557e7773a00";
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "_candidateName",
				"type": "string[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "getVoteCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

document.addEventListener("DOMContentLoaded", function () {
    if (window.ethereum) {
        ethereum.request({ method: "eth_requestAccounts" }).then(function (accounts) {
            account = accounts[0];
            console.log(account);
            updateCandidates();
        }).catch(function (error) {
            console.error("Error requesting accounts:", error);
        });
    } else {
        console.log("Please install MetaMask to use this feature.");
    }
});

function updateCandidates() {
    contract.methods.candidateCount().call().then(function (count) {
        console.log(`Total number of candidates: ${count}`);
        for (let i = 1; i <= count; i++) {
            contract.methods.candidates(i).call().then(function (candidate) {
                const candidateNameElement = document.getElementById(`${candidate.id}`);
                const candidateVoteElement = document.getElementById(`candidate${candidate.id}`);
                if (candidateNameElement && candidateVoteElement) {
                    candidateNameElement.textContent = candidate.name;
                    candidateVoteElement.textContent = candidate.voteCount;
                }
                // Print candidate info to the console
                console.log(`Candidate ${candidate.id}: ${candidate.name} - Votes: ${candidate.voteCount}`);
            }).catch(function (error) {
                console.error(`Error fetching candidate ${i}:`, error);
            });
        }
    }).catch(function (error) {
        console.error("Error fetching the candidate count:", error);
    });
}

function vote() {
    var candidateId = document.getElementById("candidate").value;

    const transaction = {
        from: account,
        to: CONTRACT_ADDRESS,
        data: contract.methods.vote(candidateId).encodeABI(),
        gas: 3200000

    }

    web3.eth.sendTransaction(transaction).on("transactionHash", function(hash){
        console.log("Transaction Hash",hash);
    })
    .on("error",function(error){
        console.log(error)
    })

    updateCandidates();



}



