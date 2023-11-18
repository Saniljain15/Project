const express = require('express');
const app = express();
app.use(express.json());


const accounts = [
  { no: 100, name: 'Sanil', balance: 1000 },
  { no: 101, name: 'Vinay', balance: 1500 },
  { no: 102, name: 'Vidit', balance: 2000 },
  { no: 103, name: 'Vivek', balance: 3000 },
];

app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/api/accounts', (req, res) => {
  res.send(accounts);
});

app.get('/api/accounts/:no', (req, res) => {
  const acc = accounts.find((a) => a.no === parseInt(req.params.no));
  if (!acc) res.status(404).send('The given account no is not found');
  res.send(acc);
});

app.post('/api/accounts', (req, res) => {
  const newAccount = {
    no: accounts.length + 100,
    name: req.body.name,
    balance: 0, 
  };
  accounts.push(newAccount);
  res.send(newAccount);
});

app.delete('/api/accounts/:no', (req, res) => {
  const index = accounts.findIndex((a) => a.no === parseInt(req.params.no));
  if (index === -1) return res.status(404).send('The given account no is not found');

  const deletedAccount = accounts.splice(index, 1);
  res.send(deletedAccount);
});

app.post('/api/accounts/transfer', (req, res) => {
  const { from, to, amount } = req.body;

  const fromAccount = accounts.find((a) => a.no === from);
  const toAccount = accounts.find((a) => a.no === to);

  if (!fromAccount || !toAccount) {
    return res.status(404).send('One or both of the accounts not found');
  }

  if (fromAccount.balance < amount) {
    return res.status(400).send('Insufficient funds for the transfer');
  }

  fromAccount.balance -= amount;
  toAccount.balance += amount;

  res.send({
    fromAccount,
    toAccount,
    message: `Transferred ${amount} from account ${from} to account ${to}`,
  });
});

app.listen(3000, () => console.log('Listening on port 3000...'));
