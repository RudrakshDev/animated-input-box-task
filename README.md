# Animated Search Box

A modern, responsive search interface built with Next.js and TypeScript, featuring smooth animations, real-time filtering, and a clean design aesthetic.

## ✨ Features

- **Real-time Search**: Instant search results as you type
- **Animated Transitions**: Smooth fade-in animations for search results
- **Content Filtering**: Filter by People, Shots, Teams, and Tags
- **Settings Panel**: Customizable search preferences with toggle options
- **Mobile Responsive**: Optimized for all screen sizes

- **Modern Design**: Clean, professional interface with proper contrast ratios

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RudrakshDev/animated-input-box-task.git
cd animated-input-box-task
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Usage

### Basic Search
1. Click on the search input box
2. Start typing to see real-time results
3. Use the filter tabs to narrow down results by content type

### Advanced Features
- **Settings**: Click the gear icon to access search preferences
- **Content Types**: Toggle different content types on/off in settings
- **Mobile**: Swipe through filter tabs on mobile devices

### Search Tips
- If you don't find your result immediately, try starting with "r"
- Use the filter tabs to focus on specific content types
- Settings allow you to customize which content types are shown

## 🏗️ Project Structure

```
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout component
│   ├── loading.tsx          # Loading state component
│   └── page.tsx             # Main page component
├── components/
│   └── search-interface.tsx # Main search interface component
├── public/
│   └── images...
└── README.md
```

## 🛠️ Technical Details

### Built With
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Geist Font** - Modern typography

### Key Components

#### SearchInterface
The main component handling:
- Search state management
- Real-time filtering
- Animation orchestration
- Settings management

#### Features
- **Debounced Search**: Optimized performance with input debouncing
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Gestures**: Mobile-optimized interactions
- **State Persistence**: Settings preserved across sessions