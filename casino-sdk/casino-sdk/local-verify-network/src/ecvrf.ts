import type { Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import type { VrfProof } from './verify-network-router.ts';
import { prove, publicKeyPoint } from './verify-network-ecvrf.ts';

export type { VrfProof };

export function publicKeyArrayFromPrivateKey(privateKey: Hex): readonly [bigint, bigint] {
  return publicKeyPoint(privateKeyToAccount(privateKey).publicKey);
}

/** The proof the local node delivers for `requestId`, the VRF input being the id's 32 raw bytes. */
export function generateVrfProof(privateKey: Hex, requestId: Hex): VrfProof {
  return prove({ privateKey, alpha: requestId });
}
