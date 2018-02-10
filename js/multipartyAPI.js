window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
	//window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  // Now you can start your app & access web3 freely:
  MPS();

})

function MPS() {
	mpsAPIContract = web3.eth.contract(MPSABI).at(MPS_addr);
	getPartiesPercents();
}

function getPartiesPercents(){
	mpsAPIContract.getPartiesPercents(function(error, result){
		if(!error){
			partiesPercents = result;
			waitForPartiesPercents();
		}
		else {
			console.error(error);
			return;
		}
	});
}

function waitForPartiesPercents() {
	if (partiesPercents != null) {
		parties = partiesPercents[0];
		percents = [];
		for( i=0; i < partiesPercents[1].length; i++ ) {
			percents.push(partiesPercents[1][i].c[0]/10);
		}
		partiesPercents = null;
		drawParties();
	}
	else setTimeout(waitForPartiesPercents, 500);
};

function modifyPartiesPercent(_new_bool, _party_addr, _percent, _id) {
	mpsAPIContract.modifyParties(_new_bool, _party_addr, _percent, _id, function(error, result){
		if(!error){
			partyChange = result;
			waitModifyPartiesPercent();
		}
		else {
			console.error(error);
			return;
		}
	});
}

function waitModifyPartiesPercent() {
	if (partyChange != null) {
		getPartiesPercents();
		partyChange = null;
	}
	else window.setTimeout(waitModifyPartiesPercent, 500);
};

function drawParties(){
	partiesList = ""
	for( i=0 ; i < parties.length ; i++ ) {
			partiesList += '<div id="party'+i+'">Address:<input type="text" size="46" class="address" value="'+parties[i]+'">Percent:<input type="number"  min=".1" max="100" step=".1" value="'+percents[i]+'" size="5" class="percent"><button type="button" onClick="modifyPartiesPercent(0, this.parentNode.getElementsByClassName('+"'address'"+')[0].value, this.parentNode.getElementsByClassName('+"'percent'"+')[0].value * 10, '+i+')">Modify</button></div></div>';
	}
	partiesList += '<div id="newparty">Address:<input type="text" size="46" class="address">Percent:<input type="number"  min=".1" max="100"  step=".1" size="5" class="percent"><button type="button" onClick="modifyPartiesPercent(1, this.parentNode.getElementsByClassName('+"'address'"+')[0].value, this.parentNode.getElementsByClassName('+"'percent'"+')[0].value * 10, '+i+')">Create</button></div></div>';
	document.getElementById("partyList").innerHTML = partiesList;
}
