import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { VotingDapp } from '../target/types/voting_dapp';
import { BankrunProvider, startAnchor } from 'anchor-bankrun';

const IDL = require('../target/idl/voting_dapp.json');
const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('voting_dapp', () => {
  let context;
  let provider;
  let votingProgram: Program<VotingDapp>; 

  beforeAll(async () => {
    context = await startAnchor("", [{ name: "voting_dapp", programId: votingAddress }], []);
    provider = new BankrunProvider(context);
    votingProgram = new Program<VotingDapp>(IDL, provider); 
  });

  it('Initialize Poll', async () => {
    await votingProgram.methods.intializePoll( 
      new anchor.BN(1), // BN is for u64 in Rust
      "Whats your favourite food",
      new anchor.BN(0),
      new anchor.BN(1829757257),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("Whats your favourite food");
    expect(poll.pollStart.toNumber()).toEqual(0);
  }, 10000);

  it('Initialize Candidate', async () => {
   
    await votingProgram.methods.intializeCandidate(
      "Crunchy",
      new anchor.BN(1)
    ).rpc();

    await votingProgram.methods.intializeCandidate(
      "Smooth",
      new anchor.BN(1)
    ).rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8),Buffer.from("Crunchy")],
      votingAddress
    );
    const crunchyCandidate = await votingProgram.account.candidate.fetch(crunchyAddress);
    console.log(crunchyCandidate);

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8),Buffer.from("Smooth")],
      votingAddress
    );
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress);
    console.log(crunchyCandidate);
  });

  it('Vote', async () => {
    
  });
});
