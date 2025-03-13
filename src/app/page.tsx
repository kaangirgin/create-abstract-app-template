"use client";

import Image from "next/image";
import { useLoginWithAbstract, useWriteContractSponsored } from "@abstract-foundation/agw-react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { getGeneralPaymasterInput } from "viem/zksync";
import { parseAbi } from "viem";
import Puzzle from './Puzzle';

export default function Home() {
  const { login, logout } = useLoginWithAbstract();
  const { address, status } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const { writeContractSponsored, data: transactionHash } = useWriteContractSponsored();
  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  return (
<div className="grid grid-cols-12 min-h-screen">
  {/* Left column (3/12 width) - with "test" text */}
  <div className="col-span-9 flex items-center justify-center">
  <div className="App">
      <h1>Puzzle Game</h1>
      {status === "connected" ? (
        <PuzzleGame />
      ):(
        <p className="text-sm sm:text-base font-medium font-[family-name:var(--font-roobert)] mb-1">
                      Connected to Abstract Global Wallet to Mumble Play Puzzle
                    </p>
      )}
    </div>
  </div>
  
  {/* Right column (9/12 width) - your content */}
  <div className="col-span-3">
    <div className="relative grid grid-rows-[1fr_auto] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-avenue-mono)] bg-black overflow-hidden">
      {/* Grids and aurora gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute top-0 left-0 right-0 h-[70vh] bg-gradient-to-b from-[#00ff00] to-transparent opacity-15 blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#00ff00] to-transparent opacity-10 blur-3xl"></div>

      {/* Main content */}
      <main className="relative flex flex-col items-center justify-center z-10 text-white text-center">
        <div className="flex flex-col items-center gap-8">
          <Image
            src="/abstract.svg"
            alt="Abstract logo"
            width={240}
            height={32}
            quality={100}
            priority
          />
          <div className="flex justify-center w-full">
            {status === "connected" ? (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-lg backdrop-blur-sm w-full max-w-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm sm:text-base font-medium font-[family-name:var(--font-roobert)] mb-1">
                      Connected to Abstract Global Wallet
                    </p>
                    <p className="text-xs text-gray-400 font-mono break-all">
                      {address}
                    </p>
                    <p className="text-sm sm:text-base font-medium font-[family-name:var(--font-roobert)] mb-1">
                      <a
                        href={`https://explorer.testnet.abs.xyz/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Explorer
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <button
                      className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center bg-white/10 text-white gap-2 hover:bg-white/20 text-sm h-10 px-5 font-[family-name:var(--font-roobert)] w-full sm:flex-1"
                      onClick={logout}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Disconnect
                    </button>
                    <button
                      className={`rounded-full border border-solid transition-colors flex items-center justify-center text-white gap-2 text-sm h-10 px-5 font-[family-name:var(--font-roobert)] w-full sm:flex-1
                        ${!sendTransaction || isPending || transactionReceipt?.status === 'success'
                          ? "bg-gray-500 cursor-not-allowed opacity-50"
                          : "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 border-transparent"
                        }`}
                      onClick={() =>
                        writeContractSponsored({
                          abi: parseAbi([
                            "function mint(address,uint256) external",
                          ]),
                          address: "0xC4822AbB9F05646A9Ce44EFa6dDcda0Bf45595AA",
                          functionName: "mint",
                          args: [address, BigInt(1)],
                          paymaster:
                            "0x5407B5040dec3D339A9247f3654E59EEccbb6391",
                          paymasterInput: getGeneralPaymasterInput({
                            innerInput: "0x",
                          }),
                        })
                      }
                      disabled={!writeContractSponsored || isPending || transactionReceipt?.status === 'success'}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span className="w-full text-center">
                        {!transactionReceipt
                          ? 'Submit tx'
                          : transactionReceipt.status === 'success'
                            ? 'Success'
                            : 'Failed'}
                      </span>
                    </button>
                  </div>
                  {!!transactionReceipt && (
                    <a
                      href={`https://explorer.testnet.abs.xyz/tx/${transactionReceipt?.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="text-sm sm:text-base font-medium font-[family-name:var(--font-roobert)] mb-1">
                        Transaction Status: {transactionReceipt?.status}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {transactionReceipt?.transactionHash?.slice(0, 8)}...
                        {transactionReceipt?.transactionHash?.slice(-6)}
                      </p>
                    </a>
                  )}
                </div>
              </div>
            ) : status === "reconnecting" || status === "connecting" ? (
              <div id="loading-spinner-container" className="flex items-center justify-center w-10 h-10">
                <div id="loading-spinner" className="animate-spin">
                  <Image src="/abs.svg" alt="Loading" width={24} height={24} />
                </div>
              </div>
            ) : (
              <button
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] hover:text-white dark:hover:bg-[#e0e0e0] dark:hover:text-black text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 font-[family-name:var(--font-roobert)]"
                onClick={login}
              >
                <Image
                  className="dark:invert"
                  src="/abs.svg"
                  alt="Abstract logomark"
                  width={20}
                  height={20}
                  style={{ filter: "brightness(0)" }}
                />
                Sign in with Abstract
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
</div>
  );
}