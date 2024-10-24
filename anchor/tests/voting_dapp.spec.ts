import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { VotingDapp } from '../target/types/voting_dapp';
import { BankrunProvider, startAnchor } from 'anchor-bankrun';

const IDL = require('../target/idl/voting_dapp.json');
const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('voting_dapp', () => {
  it('Initialize Poll', async () => {
    const context = await startAnchor("", [{ name: "voting_dapp", programId: votingAddress }], []);

    const provider = new BankrunProvider(context);

    const votingProgram = new Program<VotingDapp>(
      IDL,
      provider,
    );
    await votingProgram.methods.intializePoll(
      new anchor.BN(1), // BN is for u64 rust
      "Whats your favourite food",
      new anchor.BN(0),
      new anchor.BN(1829757257),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8)],
      votingAddress,
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("Whats your favourite food");
    expect(poll.pollStart.toNumber()).toEqual(0);

  }, 10000);
});
