import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {VotingDapp} from '../target/types/voting_dapp'

describe('voting_dapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.VotingDapp as Program<VotingDapp>

  const voting_dappKeypair = Keypair.generate()

  it('Initialize VotingDapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        voting_dapp: voting_dappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([voting_dappKeypair])
      .rpc()

    const currentCount = await program.account.voting_dapp.fetch(voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment VotingDapp', async () => {
    await program.methods.increment().accounts({ voting_dapp: voting_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_dapp.fetch(voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment VotingDapp Again', async () => {
    await program.methods.increment().accounts({ voting_dapp: voting_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_dapp.fetch(voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement VotingDapp', async () => {
    await program.methods.decrement().accounts({ voting_dapp: voting_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_dapp.fetch(voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set voting_dapp value', async () => {
    await program.methods.set(42).accounts({ voting_dapp: voting_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_dapp.fetch(voting_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the voting_dapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        voting_dapp: voting_dappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.voting_dapp.fetchNullable(voting_dappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
