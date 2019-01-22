pragma solidity ^0.5.0;

library SafeMathLib {
	function time(uint a, uint b) public pure returns (uint result){
	uint c = a*b;
	assert(a == 0 || c / a == b);
	return c;
	}

	function minus(uint a, uint b) public pure returns (uint result) {
	assert( b <= a );
	return a-b;
	}

	function plus(uint a, uint b) public pure returns (uint result) {

	uint c = a + b;
	assert( c >= a && c >= b);
	return c;
	}

	function assert(bool assertion) private pure {
	if(!assertion) revert();
	}
}