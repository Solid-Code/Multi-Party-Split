pragma solidity ^0.4.13;


contract percentSplit {
    address owner;
    uint16[] percent;
    address[] parties;
    
    
    function percentSplit() {
        owner = msg.sender;
    }
    
    function setOwner(address _address) only_by(owner) {
        owner = _address;
    }
    
    function modifyParties(bool _new, 
                            address _address,
                            uint16 _percent,
                            uint256 _ID)
                            only_by(owner) {
        if(_new) {
            parties.push(_address);
            percent.push(_percent);   
        }    
        else {
            parties[_ID] = _address;
            percent[_ID] = _percent;
        }
    }

    function() payable {
        for(uint16 i = 0; i < parties.length; i++){
            parties[i].transfer(msg.value * percent[i] / 1000);
        }
        owner.transfer(this.balance);
    }
    
    modifier only_by(address _address) { require(msg.sender == _address);  _;  }
}
