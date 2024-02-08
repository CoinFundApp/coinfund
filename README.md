# CoinFund - Crypto Crowfunding & Donations App

<img src="https://coinfund.app/images/CFI-featured.png">

Decentralized, non-custodial, non-KYC Bitcoin and Altcoin crypto crowdfunding, donations, and atomic swap exchange through open-sourced P2P.

- Wallet forked and rebuilt <a href="https://github.com/CoinFundApp/wallet">here</a>.
- Campaign invoices forked and rebuilt with relays <a href="https://github.com/CoinFundApp/backend_invoices">here</a>.
- Android and iOS app source code <a href="https://github.com/CoinFundApp/cfi-app/tree/flutterflow">here</a>.

## How it works
Use the CoinFund service to generate a Bitcoin (BIP-32) hot wallet using a master seed phrase. The master seed phrase is equally used for Ethereum-based tokens and wallets.

Once a wallet is generated, a new crowdfunding or donations campagin can be initiated. See further tutorial <a href="https://coinfund.app/how/">here</a>. A campaign URL is dynamically generated, which can be shared across social media to drive visibility to the campaign. Each campaign is published across relays found in the `/js/relays.js` file. By publishing campaign data across all contributing relays, this further enhances the censorship-resistance of our platform. 

### Contribute a relay server <a href="https://github.com/CoinFundApp/backend_invoices">here</a>!

Funders and Donators can use their own CoinFund generated wallets to fund or donate to any campaign. Alternatively, a user can connect a third-party wallet using MetaMask or the <a href="https://walletconnect.com/">WalletConnect</a> service.

## Security and privacy
The CoinFund service is designed with security and privacy in mind. The service uses HTTPS to encrypt all communication between your browser and the server, ensuring that your data is protected in transit. The service does not store any of your personal information, master seed phrase, or private key on the server. The private key is stored in the localStorage of the browser.

## Disclaimer
This service is not affiliated with any other cryptocurrency project. The service is offered "as is" without warranty of any kind, either expressed or implied. The creators of this service do not view or save your private key, view or save your master seed phrase, and are not responsible for any damages or losses resulting from misuse or negligence.

## Contributing
If you'd like to contribute to this project, please feel free to submit a Pull Request or open an issue on this GitHub repository. Additionally, help us fight censorship by contributing a <a href="https://github.com/CoinFundApp/backend_invoices">relay server</a>! We welcome contributions from all members of the crypto community.

## Censorship-resistant access: 

- IPFS
https://coinfund.on.fleek.co/

    - CID: QmQB5u753ncZuMviEV2V7MBiq6brYVSZ4tKiuR4gYXQvL6

- Internet Computer
https://25p64-aaaaa-aaaad-qetiq-cai.ic.fleek.co/
