# ToolHub

A premium, privacy-focused browser toolbox with 40+ tools for developers, designers, and power users. All processing happens client-side - your files never leave your device.

## ✨ Features

- 🔧 **40+ Tools** - Text manipulation, image processing, PDF handling, QR codes, and more
- 🛡️ **Privacy First** - All processing happens in your browser
- 🎨 **Beautiful UI** - Modern design with dark/light theme support
- 📱 **Responsive** - Works perfectly on all devices
- ⚡ **Fast** - Optimized performance with instant results
- 🔍 **Search & Filter** - Quickly find the tool you need
- ⭐ **Favorites** - Save your most-used tools
- 🌓 **Dark Mode** - Easy theme switching

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/toolhub.git
cd toolhub
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Image Processing**: Canvas API, imgly-background-removal
- **PDF Processing**: PDF-lib
- **QR Codes**: qrcode, jsQR
- **Barcodes**: JsBarcode

## 📂 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── tools/             # Dynamic tool pages
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── shared/           # Shared components
│   └── layout/           # Layout components
├── features/tools/        # Tool implementations
├── store/                # Zustand stores
└── lib/                  # Utilities and helpers
```

## 🛡️ Privacy

ToolHub processes everything client-side. Your files and data never leave your browser - no server uploads, no data collection, no tracking.

## 📦 Categories

- **Text Tools**: Word counter, case converter, JSON formatter, etc.
- **Image Tools**: Compressor, resizer, background remover, etc.
- **PDF Tools**: Merge, split, convert, compress PDFs
- **QR & Barcode**: Generate and scan QR codes and barcodes
- **Data Tools**: CSV/JSON converter, XML/YAML formatter
- **Utility Tools**: Password generator, UUID generator, etc.
- **Audio & Video**: Convert and edit media files

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🚀 Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
