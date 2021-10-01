import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import {  web3Accounts,  web3Enable,  web3FromSource} from '@polkadot/extension-dapp';
const { ApiPromise, WsProvider } = require('@polkadot/api');

function App() {

  const [api, setApi] = useState(0);

  useEffect(() => {
    const settingApi = async () => {
      const provider = new WsProvider('ws://127.0.0.1:9944');
      // Create the API and wait until ready
      const api = await ApiPromise.create({ provider });
      setApi(api)
      console.log('api: ', api)
    }
    settingApi()
  }, [])

  async function enableWallet(e) {
    e.preventDefault();

    const allInjected = await web3Enable('my cool dapp');
    console.log('allInjected: ', allInjected)
    const allAccounts = await web3Accounts();
    console.log('allAccounts: ', allAccounts)
    const account = allAccounts[0];
    const injector = await web3FromSource(account.meta.source);
    console.log('injector: ', injector)
    api.tx.balances.transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
        .signAndSend(account.address,
            { signer: injector.signer }, ({ status }) => {
          if (status.isInBlock) {
            console.log(`Completed at block hash #${status.asInBlock.toString()}`);
          } else {
            console.log(`Current status: ${status.type}`);
          }}).catch((error) => {
            console.log(':( transaction failed', error);
          });
  }

  return (
    <div className="App">
      <Button onClick={(event)=> enableWallet(event)}>Enable wallet</Button>
    </div>
  );
}

export default App;
