# 🔐 MFA Authenticator

A lightweight, privacy-first **2FA/TOTP authenticator** that runs entirely in your browser. No server, no cloud — your keys never leave your device.

## ✨ Features

- **TOTP Code Generation** — Generate time-based one-click 2FA codes (RFC 6238)
- **Multi-key Support** — Paste multiple keys at once, one per line
- **OTPAuth URI** — Supports standard `otpauth://totp/...` URI format
- **Multi-language** — Vietnamese, English, and German
- **Dark / Light Mode** — Toggle theme with one click
- **Copy to Clipboard** — One-click copy with visual feedback
- **Privacy First** — All processing happens client-side, keys are session-only and never stored

## 🛠 Tech Stack

| Layer       | Technology                         |
| ----------- | ---------------------------------- |
| Framework   | React 19 + TypeScript              |
| Build       | Vite 8                             |
| Styling     | Tailwind CSS 4 + tw-animate-css    |
| UI          | shadcn/ui (Base UI) + CVA          |
| Icons       | Phosphor Icons                     |
| OTP Engine  | [otpauth](https://github.com/nicatronTg/otpauth) |
| Font        | Geist Variable                     |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

1. Open the app in your browser
2. Paste your 2FA secret key (or `otpauth://` URI) into the text area
3. Click **"Get codes"** to generate TOTP codes
4. Copy the 6-digit code and use it to log in

> **Note:** Keys are processed entirely on your device and are not saved anywhere. Refreshing the page will clear all keys.

## 📄 License

MIT
