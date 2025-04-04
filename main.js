import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

import bip39 from 'bip39';
import * as XLSX from 'xlsx';  
import promptSync from 'prompt-sync'; 

const prompt = promptSync(); // Khởi tạo prompt-sync

const numWallets = parseInt(prompt('Nhập số lượng ví muốn tạo: '), 10);

// Mảng để lưu các ví
const wallets = [];

// Tạo ví theo số lượng yêu cầu
for (let i = 0; i < numWallets; i++) {
  // Tạo 12-word seed phrase (mnemonic)
  const mnemonic = bip39.generateMnemonic();
  // console.log(`\nWallet ${i + 1}:`);
  // console.log("Seed phrase:", mnemonic);

  // Tạo keypair từ mnemonic
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

  
  const publicKey = keypair.getPublicKey();
  const secretKey = keypair.getSecretKey();
  // console.log("Secret Key:", secretKey);
  
  
  const suiAddress = publicKey.toSuiAddress();
  // console.log("SUI address:", suiAddress);

  // Lưu thông tin ví vào mảng
  wallets.push({
    "Seed Phrase": mnemonic,
    "Secret Key": secretKey.toString('hex'),  // Chuyển secretKey sang chuỗi hex để dễ đọc
    "SUI Address": suiAddress
  });
}

// Tạo workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(wallets);
XLSX.utils.book_append_sheet(wb, ws, "Wallets");

// Xuất ra file Excel
const fileName = 'wallets.xlsx';
XLSX.writeFile(wb, fileName);
console.log(`\nĐã tạo ${numWallets} ví và xuất ra file ${fileName}`);
