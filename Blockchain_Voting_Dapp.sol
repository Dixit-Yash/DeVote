// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract BlockchainVotingSystem {
    struct Voter {
        bool registered;
        bool voted;
        uint voteIndex;  // Index of the candidate they voted for
    }

    struct Candidate {
        string name;
        uint voteCount;
    }

    address public electionAuthority;
    mapping(address => Voter) public voters;
    Candidate[] private candidates;

    event VoterRegistered(address voter);
    event VoteCasted(address voter, uint candidateIndex);
    event ElectionResult(string winner, uint voteCount);

    modifier onlyElectionAuthority() {
        require(msg.sender == electionAuthority, "Only election authority can perform this action.");
        _;
    }

    constructor(string[] memory candidateNames) {
        electionAuthority = msg.sender;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0
            }));
        }
    }

    function registerVoter(address voter) public onlyElectionAuthority {
        require(!voters[voter].registered, "Voter is already registered.");
        voters[voter] = Voter({
            registered: true,
            voted: false,
            voteIndex: 0
        });
        emit VoterRegistered(voter);
    }

    function vote(uint candidateIndex) public {
        require(voters[msg.sender].registered, "Voter is not registered.");
        require(!voters[msg.sender].voted, "Voter has already voted.");
        require(candidateIndex < candidates.length, "Invalid candidate index.");

        voters[msg.sender].voted = true;
        voters[msg.sender].voteIndex = candidateIndex;
        candidates[candidateIndex].voteCount += 1;

        emit VoteCasted(msg.sender, candidateIndex);
    }

    function tallyVotes() public onlyElectionAuthority returns (string memory) {
        uint winningVoteCount = 0;
        uint winningCandidateIndex = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateIndex = i;
            }
        }

        emit ElectionResult(candidates[winningCandidateIndex].name, winningVoteCount);
        return candidates[winningCandidateIndex].name;
    }

    function getCandidate(uint index) public view returns (string memory name, uint voteCount) {
        require(index < candidates.length, "Invalid candidate index.");
        return (candidates[index].name, candidates[index].voteCount);
    }
}