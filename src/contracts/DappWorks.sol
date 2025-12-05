// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DappWorks is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _jobCounter;
    Counters.Counter private _assignmentCounter;

    struct JobStruct {
        uint id;
        address owner;
        address freelancer;
        string jobTitle;
        string description;
        string tags;
        uint prize;
        bool paidOut;
        uint timestamp;
        bool listed;
        bool disputed;
        address[] bidders;
    }

    struct AssignmentStruct {
        uint id;
        address owner;
        string title;
        string description;
        string tags;
        address[] applicants;
        address acceptedStudent;
        bool completed;
        bool certified;
        uint timestamp;
        bool active;
    }

    struct FreelancerStruct {
        uint id;
        uint jId;
        address account;
        bool isAssigned;
    }

    struct BidStruct {
        uint id;
        uint jId;
        address account;
    }

    uint public platformCharge = 5;

    mapping(uint => JobStruct) jobListings;
    mapping(uint => FreelancerStruct[]) freelancers;
    mapping(uint => BidStruct[]) jobBidders;

    mapping(uint => AssignmentStruct) assignmentListings;
    mapping(uint => address[]) assignmentApplicants; // For tracking applicants per assignment

    mapping(uint => bool) jobListingExists;
    mapping(uint => mapping(address => bool)) public hasPlacedBid;

    mapping(uint => bool) assignmentExists;
    mapping(uint => mapping(address => bool)) public hasAppliedForAssignment;

    modifier onlyJobOwner(uint id) {
        require(jobListings[id].owner == msg.sender, "Unauthorized entity");
        _;
    }

    modifier onlyAssignmentOwner(uint id) {
        require(assignmentListings[id].owner == msg.sender, "Unauthorized entity");
        _;
    }

    // Job-related functions (existing)
    function addJobListing(
        string memory jobTitle,
        string memory description,
        string memory tags
    ) public payable {
        require(bytes(jobTitle).length > 0, "Please provide a job title");
        require(bytes(description).length > 0, "Please provide a description");
        require(bytes(tags).length > 0, "Please provide tags");
        require(msg.value > 0 ether, "Insufficient funds");

        _jobCounter.increment();
        uint jobId = _jobCounter.current();

        JobStruct memory jobListing;

        jobListing.id = jobId;
        jobListing.owner = msg.sender;
        jobListing.jobTitle = jobTitle;
        jobListing.description = description;
        jobListing.tags = tags;
        jobListing.prize = msg.value;
        jobListing.listed = true;
        jobListing.timestamp = currentTime();

        jobListings[jobId] = jobListing;
        jobListingExists[jobId] = true;
    }

    function deleteJob(uint id) public {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].listed, "This job has been taken");
        require(!jobListings[id].paidOut, "This job has been paid out");

        jobListingExists[id] = false;

        payTo(jobListings[id].owner, jobListings[id].prize);
    }

    function updateJob(
        uint id,
        string memory jobTitle,
        string memory description,
        string memory tags
    ) public {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].listed, "This job has been taken");
        require(!jobListings[id].paidOut, "This job has been paid out");

        jobListings[id].jobTitle = jobTitle;
        jobListings[id].description = description;
        jobListings[id].tags = tags;
    }

    function bidForJob(uint id) public {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].owner != msg.sender, "Forbidden action!");
        require(!jobListings[id].paidOut, "This job has been paid out");
        require(jobListings[id].listed, "This job have been taken");
        require(!hasPlacedBid[id][msg.sender], "You have placed a bid already");

        BidStruct memory bid;
        bid.id = jobBidders[id].length + 1;
        bid.jId = id;
        bid.account = msg.sender;
        hasPlacedBid[id][msg.sender] = true;

        jobListings[id].bidders.push(msg.sender);
        jobBidders[id].push(bid);
    }

    function acceptBid(
        uint id,
        uint jId,
        address bidder
    ) public onlyJobOwner(jId) {
        require(jobListingExists[jId], "This job listing doesn't exist");
        require(jobListings[jId].listed, "This job have been taken");
        require(!jobListings[jId].paidOut, "This job has been paid out");
        require(hasPlacedBid[jId][bidder], "UnIdentified bidder");

        FreelancerStruct memory freelancer;

        freelancer.id = freelancers[jId].length;
        freelancer.jId = jId;
        freelancer.account = bidder;
        freelancer.isAssigned = true;

        freelancers[jId].push(freelancer);
        jobListings[jId].freelancer = bidder;

        for (uint i = 0; i < jobBidders[jId].length; i++) {
            if (jobBidders[jId][i].id != id) {
                hasPlacedBid[jId][jobBidders[jId][i].account] = false;
            }
        }

        jobListings[jId].listed = false;
    }

    function bidStatus(uint id) public view returns (bool) {
        return hasPlacedBid[id][msg.sender];
    }

    function dispute(uint id) public onlyJobOwner(id) {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(!jobListings[id].disputed, "This job already disputed");
        require(!jobListings[id].paidOut, "This job has been paid out");

        jobListings[id].disputed = true;
    }

    function revoke(uint jId, uint id) public onlyOwner {
        require(jobListingExists[jId], "This job listing doesn't exist");
        require(jobListings[jId].disputed, "This job must be on dispute");
        require(!jobListings[jId].paidOut, "This job has been paid out");

        FreelancerStruct storage freelancer = freelancers[jId][id];

        freelancer.isAssigned = false;
        jobListings[jId].freelancer = address(0);
        payTo(jobListings[jId].owner, jobListings[jId].prize);

        jobListings[jId].listed = true;
    }

    function resolved(uint id) public onlyOwner {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].disputed, "This job must be on dispute");
        require(!jobListings[id].paidOut, "This job has been paid out");

        jobListings[id].disputed = false;
    }

    function payout(uint id) public nonReentrant onlyJobOwner(id) {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(!jobListings[id].listed, "This job has not been taken");
        require(!jobListings[id].disputed, "This job must not be on dispute");
        require(!jobListings[id].paidOut, "This job has been paid out");

        uint reward = jobListings[id].prize;
        uint tax = (reward * platformCharge) / 100;

        payTo(jobListings[id].freelancer, reward - tax);
        payTo(owner(), tax);
        jobListings[id].paidOut = true;
    }

    // Assignment-related functions
    function createAssignment(
        string memory _title,
        string memory _description,
        string memory _tags
    ) public {
        require(bytes(_title).length > 0, "Please provide a title");
        require(bytes(_description).length > 0, "Please provide a description");
        require(bytes(_tags).length > 0, "Please provide tags");

        _assignmentCounter.increment();
        uint assignmentId = _assignmentCounter.current();

        AssignmentStruct memory assignment;

        assignment.id = assignmentId;
        assignment.owner = msg.sender;
        assignment.title = _title;
        assignment.description = _description;
        assignment.tags = _tags;
        assignment.active = true;
        assignment.timestamp = currentTime();

        assignmentListings[assignmentId] = assignment;
        assignmentExists[assignmentId] = true;
    }

    function applyForAssignment(uint _id) public {
        require(assignmentExists[_id], "This assignment doesn't exist");
        require(assignmentListings[_id].owner != msg.sender, "Owner cannot apply");
        require(assignmentListings[_id].active, "Assignment is no longer active");
        require(!hasAppliedForAssignment[_id][msg.sender], "You have already applied");

        hasAppliedForAssignment[_id][msg.sender] = true;
        assignmentListings[_id].applicants.push(msg.sender);
    }

    function acceptApplicant(uint _id, uint _applicantIndex) public onlyAssignmentOwner(_id) {
        require(assignmentExists[_id], "This assignment doesn't exist");
        require(assignmentListings[_id].active, "Assignment is no longer active");
        require(_applicantIndex < assignmentListings[_id].applicants.length, "Invalid applicant index");

        assignmentListings[_id].acceptedStudent = assignmentListings[_id].applicants[_applicantIndex];
        assignmentListings[_id].active = false;
    }

    function completeAssignment(uint _id) public {
        require(assignmentExists[_id], "This assignment doesn't exist");
        require(assignmentListings[_id].acceptedStudent == msg.sender, "Only accepted student can complete");
        require(!assignmentListings[_id].completed, "Already completed");

        assignmentListings[_id].completed = true;
    }

    function issueCertificate(uint _id) public onlyAssignmentOwner(_id) {
        require(assignmentExists[_id], "This assignment doesn't exist");
        require(assignmentListings[_id].completed, "Assignment must be completed first");
        require(!assignmentListings[_id].certified, "Certificate already issued");

        assignmentListings[_id].certified = true;

        emit CertificateIssued(_id, assignmentListings[_id].acceptedStudent, assignmentListings[_id].title);
    }

    // Getters for Jobs (existing)
    function getBidders(
        uint id
    ) public view returns (BidStruct[] memory Bidders) {
        if (jobListings[id].listed && jobListingExists[id]) {
            Bidders = jobBidders[id];
        } else {
            Bidders = new BidStruct[](0);
        }
    }

    function getFreelancers(
        uint id
    ) public view returns (FreelancerStruct[] memory) {
        return freelancers[id];
    }

    function getAcceptedFreelancer(
        uint id
    ) public view returns (FreelancerStruct memory) {
        require(jobListingExists[id], "This job listing doesn't exist");

        for (uint i = 0; i < freelancers[id].length; i++) {
            if (freelancers[id][i].isAssigned) {
                return freelancers[id][i];
            }
        }

        FreelancerStruct memory emptyFreelancer;
        return emptyFreelancer;
    }

    function getJobs() public view returns (JobStruct[] memory ActiveJobs) {
        uint available;
        uint currentIndex = 0;

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                jobListings[i].listed &&
                !jobListings[i].paidOut
            ) {
                available++;
            }
        }

        ActiveJobs = new JobStruct[](available);

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                jobListings[i].listed &&
                !jobListings[i].paidOut
            ) {
                ActiveJobs[currentIndex++] = jobListings[i];
            }
        }
    }

    function getMyJobs() public view returns (JobStruct[] memory MyJobs) {
        uint available;
        uint currentIndex = 0;

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (jobListingExists[i] && jobListings[i].owner == msg.sender) {
                available++;
            }
        }

        MyJobs = new JobStruct[](available);

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (jobListingExists[i] && jobListings[i].owner == msg.sender) {
                MyJobs[currentIndex++] = jobListings[i];
            }
        }
    }

    function getJob(uint id) public view returns (JobStruct memory) {
        return jobListings[id];
    }

    function getAssignedJobs()
        public
        view
        returns (JobStruct[] memory AssignedJobs)
    {
        uint available;

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                !jobListings[i].paidOut &&
                jobListings[i].freelancer == msg.sender
            ) {
                available++;
            }
        }

        AssignedJobs = new JobStruct[](available);

        uint currentIndex = 0;
        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                !jobListings[i].paidOut &&
                jobListings[i].freelancer == msg.sender
            ) {
                AssignedJobs[currentIndex++] = jobListings[i];
            }
        }

        return AssignedJobs;
    }

    function getBidsForBidder() public view returns (BidStruct[] memory Bids) {
        BidStruct[] memory allBids = new BidStruct[](_jobCounter.current());
        uint currentIndex = 0;

        for (uint i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                jobListings[i].listed &&
                !jobListings[i].paidOut
            ) {
                if (hasPlacedBid[i][msg.sender]) {
                    for (uint j = 0; j < jobBidders[i].length; j++) {
                        if (jobBidders[i][j].account == msg.sender) {
                            allBids[currentIndex] = jobBidders[i][j];
                            currentIndex++;
                        }
                    }
                }
            }
        }

        Bids = new BidStruct[](currentIndex);
        for (uint k = 0; k < currentIndex; k++) {
            Bids[k] = allBids[k];
        }

        return Bids;
    }

    function getJobsForBidder()
        public
        view
        returns (JobStruct[] memory bidderJobs)
    {
        JobStruct[] memory matchingJobs = new JobStruct[](
            _jobCounter.current()
        );
        uint currentIndex = 0;

        for (uint i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                jobListings[i].listed &&
                !jobListings[i].paidOut
            ) {
                if (hasPlacedBid[i][msg.sender]) {
                    matchingJobs[currentIndex] = jobListings[i];
                    currentIndex++;
                }
            }
        }

        bidderJobs = new JobStruct[](currentIndex);
        for (uint k = 0; k < currentIndex; k++) {
            bidderJobs[k] = matchingJobs[k];
        }

        return bidderJobs;
    }

    // Getters for Assignments
    function getAssignments() public view returns (AssignmentStruct[] memory ActiveAssignments) {
        uint available;
        uint currentIndex = 0;

        for (uint256 i = 1; i <= _assignmentCounter.current(); i++) {
            if (
                assignmentExists[i] &&
                assignmentListings[i].active &&
                !assignmentListings[i].certified
            ) {
                available++;
            }
        }

        ActiveAssignments = new AssignmentStruct[](available);

        for (uint256 i = 1; i <= _assignmentCounter.current(); i++) {
            if (
                assignmentExists[i] &&
                assignmentListings[i].active &&
                !assignmentListings[i].certified
            ) {
                ActiveAssignments[currentIndex++] = assignmentListings[i];
            }
        }
    }

    function getMyAssignments() public view returns (AssignmentStruct[] memory MyAssignments) {
        uint available;
        uint currentIndex = 0;

        for (uint256 i = 1; i <= _assignmentCounter.current(); i++) {
            if (assignmentExists[i] && assignmentListings[i].owner == msg.sender) {
                available++;
            }
        }

        MyAssignments = new AssignmentStruct[](available);

        for (uint256 i = 1; i <= _assignmentCounter.current(); i++) {
            if (assignmentExists[i] && assignmentListings[i].owner == msg.sender) {
                MyAssignments[currentIndex++] = assignmentListings[i];
            }
        }
    }

    function getAssignment(uint id) public view returns (AssignmentStruct memory) {
        return assignmentListings[id];
    }

    function getMyAssignmentApplications() public view returns (AssignmentStruct[] memory AppliedAssignments) {
        uint available;
        uint currentIndex = 0;

        for (uint256 i = 1; i <= _assignmentCounter.current(); i++) {
            if (
                assignmentExists[i] &&
                assignmentListings[i].active &&
                hasAppliedForAssignment[i][msg.sender]
            ) {
                available++;
            }
        }

        AppliedAssignments = new AssignmentStruct[](available);

        for (uint256 i = 1; i <= _assignmentCounter.current(); i++) {
            if (
                assignmentExists[i] &&
                assignmentListings[i].active &&
                hasAppliedForAssignment[i][msg.sender]
            ) {
                AppliedAssignments[currentIndex++] = assignmentListings[i];
            }
        }

        return AppliedAssignments;
    }

    // Events
    event CertificateIssued(uint indexed assignmentId, address indexed student, string title);

    // Private functions
    function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function getAssignmentApplicants(uint id) public view returns (address[] memory) {
        require(assignmentExists[id], "Assignment doesn't exist");
        return assignmentListings[id].applicants;
    }
}

