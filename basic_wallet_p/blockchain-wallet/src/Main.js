import React, { Component } from "react";
import axios from "axios";
import "./App.css";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      balance: 0,
      transactions: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
  }

  inputHandler(event) {
    event.preventDefault();
    axios.get(process.env.REACT_APP_URL).then(response => {
      const chain = response.data.chain;
      const temp_transactions = [];

      for (let i = 0; i < chain.length; i++) {
        for (let j = 0; j < chain[i].transactions.length; j++) {
          const transacData = chain[i].transactions[j];
          const recipient = transacData.recipient;
          const sender = transacData.sender;
          const name = this.state.name;

          if (name === recipient || name === sender) {
            temp_transactions.push(transacData);
            if (name === recipient) {
              this.setState({ balance: this.state.balance+1 });
            } else if (name === sender) {
              this.setState({ balance: this.state.balance-1 });
            }
          }
        }
      }
      this.setState({ transactions: temp_transactions });
    });
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  render() {
    return (
      <div className="main-page">
        <div className="input-form">
          <form onSubmit={this.inputHandler}>
            <input
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div>
          <h3>
            Current Balance for {this.state.name}: {this.state.balance}
          </h3>
          <h3>Transactions:</h3>
          {this.state.transactions.map(transaction => {
            return (
              <div className="Transactions">
                <p>Amount: {transaction.amount}</p>
                <p>Sender: {transaction.sender}</p>
                <p>Recipient: {transaction.recipient}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
