import {
  base64ToUint8,
  decryptWithPass,
  fromBase64,
  proofOfWork,
  UserRootData,
} from "mtgatool-db";

import { UserRecoveryData } from "../types/dbTypes";

/* eslint-disable prefer-promise-reject-errors */
export default function checkPassphrase(username: string, passphrase: string) {
  return window.toolDb.getData<UserRootData>(`==${username}`).then((userData) =>
    window.toolDb
      .getData<UserRecoveryData>(
        `:${userData?.keys.skpub}.recovery`,
        false,
        5000
      )
      .then((rec) => {
        if (rec) {
          const { recovery, iv } = rec;
          return proofOfWork(passphrase, 3).then(({ hash }) =>
            decryptWithPass(fromBase64(recovery), hash, base64ToUint8(iv))
          );
        }
        return Promise.reject(new Error("Could not find recovery data"));
      })
  );
}
