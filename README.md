# Dynamic Theme Generator

A real-time theme generator built with Next.js 15 and Tailwind CSS 4, inspired by daisyUI's theme generator. This mini project demonstrates how to create dynamic themes without using a Tailwind config file.

## ✨ Features

### 🎨 **Real-time Theme Customization**
- **Color Picker**: Interactive color selection for primary, secondary, accent, neutral, info, success, warning, and error colors
- **Radius Controls**: Adjustable border radius for boxes, fields, and selectors
- **Effects Toggle**: Enable/disable depth and noise effects
- **Live Preview**: See changes instantly on sample components

### 🔧 **Theme Export**
- **CSS Variables**: Generate CSS custom properties for your theme
- **Tailwind Config**: Export Tailwind configuration (for reference)
- **Copy to Clipboard**: One-click copying of generated code
- **Theme Pusher Demo**: Simulate pushing themes to connected projects

### 🎯 **Live Preview Components**
- Buttons with custom colors and radius
- Status badges (success, warning, error, info)
- Sample card component
- Input field with custom styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dynamic-theme-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [https://dynamic-theme-generator.vercel.app](https://dynamic-theme-generator.vercel.app)

## 🛠 How It Works

### **Tailwind CSS 4 Integration**
This project uses Tailwind CSS 4's new `@import "tailwindcss"` syntax without requiring a config file. Themes are applied using CSS custom properties and inline styles.

### **Component Architecture**
```
src/
├── app/
│   ├── page.tsx          # Main theme generator interface
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles with Tailwind CSS 4
└── components/
    ├── ColorPicker.tsx   # Color selection component
    ├── RadiusControl.tsx # Radius adjustment component
    ├── LivePreview.tsx   # Real-time component preview
    └── ThemeExporter.tsx # Theme export functionality
```

### **Theme State Management**
The theme state is managed using React's `useState` hook with a structured object containing:
- `colors`: All theme colors
- `radius`: Border radius values
- `effects`: Boolean flags for visual effects

## 🎨 Usage

### **1. Create Your Website First**
- Build and deploy your website (portfolio, blog, e-commerce, etc.)
- Add a webhook endpoint to your website to receive theme updates
- Register your website in the theme pusher system with the webhook URL

### **2. Generate Custom Themes**
- Use the theme generator to customize colors, radius, and effects
- See changes reflected immediately in the live preview
- Click "Save Theme" to store your theme in the database

### **3. Push Themes to Your Live Website**
- Select a saved theme from the dropdown
- Click "Push Theme" to send theme updates to your live website
- Your website will immediately update with the new styling
- View real-time results and deployment logs

### **4. Export Themes (Optional)**
- Click "Copy CSS Variables" to get the CSS custom properties
- Click "Copy Tailwind Config" for the Tailwind configuration
- Use the generated code for manual theme implementation

## 🔮 Future Enhancements

This mini project can be extended with:

### **Advanced Features**
- Theme presets and templates
- Color palette generation
- Advanced effects (gradients, shadows)
- Typography controls
- Spacing system customization

### **Backend Integration**
- User authentication
- Theme storage and management
- Real webhook system for theme pushing
- Project management dashboard
- Theme marketplace

### **Real-time Collaboration**
- WebSocket connections for live theme sharing
- Team collaboration features
- Version control for themes
- A/B testing capabilities

## 🛡️ Technical Details

### **CSS Variables Generation**
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --radius-box: 8px;
  --radius-field: 6px;
  --radius-selector: 4px;
}
```

### **Tailwind CSS 4 Usage**
```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js 15 and Tailwind CSS 4**
