// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    // As of Solidity 0.7.0, an unsafe feature related to mappings in Structs was removed.
    // If a struct or array contains a mapping, it can only be used in storage. Prior to 0.7.0,
    // mapping members were silently skipped in memory, which is confusing and error-prone.
    //
    // So the line which is given in the course code:
    //
    // Request[] public requests;
    //
    // now becomes the following 2 lines of code. Also in the createRequest
    // function, instead of creating a memory Struct, which the code was proviously
    // doing, we now have to create a storage Struct.
    //
    // And finally, wherever the course code has the line `requests.length` gets replaced
    // by `numRequests`.
    //
    // https://docs.soliditylang.org/en/v0.7.0/070-breaking-changes.html#mappings-outside-storage
    // https://docs.soliditylang.org/en/v0.8.6/types.html?highlight=struct#structs
    //
    uint256 numRequests;
    mapping(uint256 => Request) public requests;

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(
            msg.value >= minimumContribution,
            "A minumum contribution is required."
        );
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public onlyManager {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(
            approvers[msg.sender],
            "Only contributors can approve a specific payment request"
        );
        require(
            !request.approvals[msg.sender],
            "You have already voted to approve this request"
        );

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public onlyManager {
        Request storage request = requests[index];
        require(
            request.approvalCount > (approversCount / 2),
            "This request needs more approvals before it can be finalized"
        );
        require(!(request.complete), "This request has already been finalized");

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return numRequests;
    }

    modifier onlyManager() {
        require(
            msg.sender == manager,
            "Only the campaign manager can call this function."
        );
        _;
    }
}
