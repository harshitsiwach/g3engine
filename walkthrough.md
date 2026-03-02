# 🎮 Web3 Browser Game Engine: Architecture & Workflow Specification

## 🌟 1. Platform Overview
A zero-code, browser-based 3D game engine powered by Three.js. It allows creators to build interactive 3D games via drag-and-drop, integrate multi-chain Web3 wallets (Solana & EVM) with a single click, and export seamless, embeddable builds to social platforms (X/Twitter, Telegram, Line, Farcaster, Web).

---

## 🎨 2. UI and UX Design Principles
The platform must feel like a modern, premium creative tool (similar to Spline, Figma, or PlayCanvas). The UI should get out of the user's way, maximizing the 3D canvas space.

*   **Canvas-First Layout:** The Three.js viewport occupies 100% of the background. UI elements float over the canvas using glassmorphism (translucent, blurred backgrounds).
*   **Clean Hierarchy:** 
    *   *Left Panel:* Scene Graph (Tree view of objects, lights, and cameras).
    *   *Bottom Panel:* Asset Library (Drag-and-drop 3D models, materials, Web3 nodes) & Visual Scripting Node Editor (collapsible).
    *   *Right Panel:* Contextual Inspector (Properties of the currently selected object).
    *   *Top Bar:* Global controls (Play/Stop, Undo/Redo, "Add Web3 Wallet", and "Publish").
*   **"No-Jargon" Web3 UX:** Users should never see complex terms like "RPC Endpoints" or "ABI". Web3 features are presented as simple visual nodes (e.g., "Give Player Item", "Require NFT to Enter").
*   **Theme:** Dark mode default. Charcoal backgrounds (`#121212`), subtle glowing borders for active states, and high-contrast primary buttons (e.g., Neon Purple or Solana Green).

---

## 🗺️ 3. Detailed User Workflow

### Step 1: Onboarding & Project Setup
1.  **Login:** User arrives at the landing page and clicks "Start Creating." They log in via Email or Socials (Google/X). *UX Detail: No mandatory crypto wallet connection required to sign up.*
2.  **Dashboard:** The user sees a clean grid of their past projects and a "New Project" button.
3.  **Template Selection:** They can choose a blank 3D canvas or pre-built templates (e.g., "3D Platformer," "Web3 Token Gate Room").

### Step 2: Building the Game (The Editor)
1.  **Scene Population:** The user drags a 3D character from the bottom Asset Library into the center viewport.
2.  **Manipulation:** Using standard gizmos (translation arrows, rotation rings), they position the character.
3.  **Visual Scripting:** The user opens the Node Editor. They drag a "Keyboard Input" node and connect it to a "Move Character" node using simple bezier curves.
4.  **Instant Preview:** They press the "Play" button in the Top Bar. The UI tucks away, and they can playtest their logic instantly in the browser.

### Step 3: One-Click Web3 Integration
1.  **Enable Web3:** The user clicks a glowing "Enable Web3" toggle in the Top Bar.
2.  **Wallet Drop-in:** A "Connect Wallet" UI component automatically appears in their game's UI overlay. 
3.  **Web3 Logic:** The user drags an "On Wallet Connect" node in the logic editor and connects it to a "Show Hidden Door" node. 
4.  **Chain Agnostic:** The engine handles the complexity; it automatically supports users logging in with Solana or EVM wallets natively in the published game.

### Step 4: Exporting & Publishing
1.  **The Publish Button:** Once satisfied, the user clicks "Publish."
2.  **Choose Destination:** A modal asks: "Where do you want to publish?" (Options: Web, X/Twitter Player, Telegram Mini App).
3.  **Seamless Upload:** A loading spinner appears. Under the hood, the platform serializes the scene to JSON and uploads it to decentralized storage (Arweave) gaslessly on the user's behalf.
4.  **The Share Screen:** The user is presented with a shortlink (`play.engine.com/xyz`). 
5.  **Social Sharing:** They click "Share to X". The link generates a dynamic Twitter Player Card. When posted, their game is playable directly inside the Twitter timeline.

---

## 🛠️ 4. Required Agent Skills (`skills.sh` Ecosystem)

To build this architecture, your coding agent will require procedural knowledge from the `skills.sh` ecosystem [web:101]. Below are the specific agent skills and technical instructions you must implement (either by running `npx skills add <skill-name>` or by defining these behaviors in your local `SKILL.md` files [web:103][web:107]).

### Skill 1: `threejs-r3f-editor-core`
*   **Domain:** 3D Graphics & React Three Fiber.
*   **Procedural Knowledge for Agent:**
    *   Always use `@react-three/fiber` and `@react-three/drei` for declarative 3D rendering.
    *   Implement a central JSON state manager (using Zustand) to hold the `SceneGraph`.
    *   Use `TransformControls` from `drei` to allow users to move/rotate/scale clicked objects.
    *   Ensure all 3D scene data can be serialized into a clean JSON object via a custom `exportScene()` function.

### Skill 2: `react-flow-visual-scripting`
*   **Domain:** UI/UX & Logic Compilation.
*   **Procedural Knowledge for Agent:**
    *   Use `React Flow` to build the node-based visual scripting interface.
    *   Define strict node types: `EventNodes` (Start, Update, Click), `ActionNodes` (Move, Hide, Play Sound), and `Web3Nodes`.
    *   Create a compiler function that traverses the React Flow graph (edges and nodes) and translates it into an array of executable JavaScript callbacks for the Three.js game loop.

### Skill 3: `privy-multichain-auth`
*   **Domain:** Web3 & Embedded Wallets.
*   **Procedural Knowledge for Agent:**
    *   Integrate `@privy-io/react-auth` for seamless onboarding.
    *   Configure Privy to generate both **Solana** and **EVM** embedded wallets for users signing in with email/socials.
    *   When the published game runs, use Privy's `useWallets()` hook to seamlessly sign transactions (e.g., minting an NFT or saving a high score to the blockchain) without requiring users to install browser extensions.

### Skill 4: `nextjs-social-metadata-player`
*   **Domain:** Server-Side Rendering (SSR) & Social Media Embeds.
*   **Procedural Knowledge for Agent:**
    *   Use Next.js App Router.
    *   Build a dynamic route at `app/play/[gameId]/page.tsx`.
    *   Implement the `generateMetadata` function to render specific `<meta>` tags before client load.
    *   **Crucial for X/Twitter:** Return `{ twitter: { card: 'player', players: { playerUrl: '...' } } }` to ensure the WebGL iframe is embedded directly in user feeds.
    *   **Crucial for Telegram:** Ensure the game layout forces `100vw` and `100vh` to fit perfectly inside the Telegram Mini App WebView.

### Skill 5: `irys-gasless-storage`
*   **Domain:** Decentralized Infrastructure.
*   **Procedural Knowledge for Agent:**
    *   Integrate the `@irys/upload` SDK on the Next.js backend.
    *   Implement "Server-Side Signing" where the platform's backend wallet pays the fractional Arweave storage fees.
    *   When the user clicks "Publish," the agent must POST the Three.js scene JSON to the backend, which uploads it to Arweave via Irys and returns a permanent, immutable URL for the game player to consume.

---

## 🚀 5. Getting Started (Prompt for the Agent)
**Agent Instructions:** "Review this architecture document. Begin by initializing a Next.js App Router project and installing the required procedural `SKILL.md` contexts for Three.js, React Flow, and Privy. Start by building the overarching layout defined in the UI/UX Design Principles."
