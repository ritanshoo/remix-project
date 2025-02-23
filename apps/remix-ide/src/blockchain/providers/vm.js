const Web3 = require('web3')
import { privateToAddress, hashPersonalMessage } from '@ethereumjs/util'
import BN from 'bn.js'
const { extend } = require('@remix-project/remix-simulator')
class VMProvider {
  constructor (executionContext) {
    this.executionContext = executionContext
    this.worker = null
    this.provider = null
  }

  getAccounts (cb) {
    this.web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return cb('No accounts?')
      }
      return cb(null, accounts)
    })
  }

  resetEnvironment () {
    if (this.worker) this.worker.terminate()
    this.accounts = {}
    this.worker = new Worker(new URL('./worker-vm', import.meta.url))
    const provider = this.executionContext.getProviderObject()

    this.worker.postMessage({ cmd: 'init', fork: this.executionContext.getCurrentFork(), nodeUrl: provider?.options['nodeUrl'], blockNumber: provider?.options['blockNumber']})
    
    let incr = 0
    const stamps = {}
    this.worker.addEventListener('message', (msg) => {
      if (stamps[msg.data.stamp]) {
        stamps[msg.data.stamp](msg.data.error, msg.data.result)
      }
    })
    this.provider = {
      sendAsync: (query, callback) => {
        const stamp = Date.now() + incr
        incr++
        stamps[stamp] = callback
        this.worker.postMessage({ cmd: 'sendAsync', query, stamp })
      }
    }
    this.web3 = new Web3(this.provider)
    extend(this.web3)
    this.accounts = {}
    this.executionContext.setWeb3(this.executionContext.getProvider(), this.web3)
  }

  // TODO: is still here because of the plugin API
  // can be removed later when we update the API
  createVMAccount (newAccount) {
    const { privateKey, balance } = newAccount
    this.RemixSimulatorProvider.Accounts._addAccount(privateKey, balance)
    const privKey = Buffer.from(privateKey, 'hex')
    return '0x' + privateToAddress(privKey).toString('hex')
  }

  newAccount (_passwordPromptCb, cb) {
    this.RemixSimulatorProvider.Accounts.newAccount(cb)
  }

  getBalanceInEther (address, cb) {
    this.web3.eth.getBalance(address, (err, res) => {
      if (err) {
        return cb(err)
      }
      cb(null, Web3.utils.fromWei(new BN(res).toString(10), 'ether'))
    })
  }

  getGasPrice (cb) {
    this.web3.eth.getGasPrice(cb)
  }

  signMessage (message, account, _passphrase, cb) {
    const messageHash = hashPersonalMessage(Buffer.from(message))
    this.web3.eth.sign(message, account, (error, signedData) => {
      if (error) {
        return cb(error)
      }
      cb(null, '0x' + messageHash.toString('hex'), signedData)
    })
  }

  getProvider () {
    return this.executionContext.getProvider()
  }
}

module.exports = VMProvider
