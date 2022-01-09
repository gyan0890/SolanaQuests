const assert = require('assert');
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

describe('mycalculatordapp', () => {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.mycalculatordapp;
  let _calculator = calculator;

  it('Creates a calculator', async () => {
    await program.rpc.create("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator]
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.greeting === "Welcome to Solana");
    _calculator = calculator;
  });


  it("Adds two numbers", async function() {
    const calculator = _calculator;
    
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(5)));
    assert.ok(account.greeting === "Welcome to Solana");
  });

  it('Subtracts two numbers', async function() {
    const calculator = _calculator;
    await program.rpc.sub(new anchor.BN(5), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });


    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(3)));
    assert.ok(account.greeting === "Welcome to Solana");
  })

  it('Multiplies two numbers', async function() {
    const calculator = _calculator;
    await program.rpc.mul(new anchor.BN(3), new anchor.BN(10), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

  const account = await program.account.calculator.fetch(calculator.publicKey);
  assert.ok(account.result.eq(new anchor.BN(30)));
  assert.ok(account.greeting === "Welcome to Solana");
  })

  it('Divides two numbers', async function() {
    const calculator = _calculator;
    await program.rpc.div(new anchor.BN(11), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

  const account = await program.account.calculator.fetch(calculator.publicKey);
  assert.ok(account.result.eq(new anchor.BN(5)));
  assert.ok(account.remainder.eq(new anchor.BN(1)));
  assert.ok(account.greeting === "Welcome to Solana");
  });
});

