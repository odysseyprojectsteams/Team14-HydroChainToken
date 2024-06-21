// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HydroChainToken is ERC20, ERC20Burnable, Ownable {
    constructor()
        ERC20("HydroChainToken", "HCT")
        Ownable()
    {
        ERC20._mint(msg.sender, (30 * 10**18) );
    }


    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transfer(address to, uint256 value) public override  virtual returns (bool)
    {
        require(balanceOf(msg.sender) >= value, "transfer amount exceeds your balance, Try again with less transfer ammount");
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }
    function transferFrom(address from, address to, uint256 value) public override  virtual returns (bool) {
        require(balanceOf(from) >= value, "transfer amount exceeds your balance, Try again with less transfer ammount");
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    function getTokenName() public view returns (string memory) {
        return name();
    }

    function getTokenSymbol() public view returns (string memory) {
        return symbol();
    }

}
