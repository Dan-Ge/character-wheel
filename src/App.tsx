// src/App.tsx

// Den Import von App.css können wir lassen, auch wenn die Datei leer ist,
// oder du kannst ihn löschen, wenn du möchtest.
import './App.css'; 

function App() {
  // Wir geben ein Haupt-Div zurück, das den Bildschirm füllt (min-h-screen),
  // einen dunklen Hintergrund hat (bg-gray-900), weiße Schrift (text-white)
  // und den Inhalt zentriert (flex, items-center, justify-center).
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">

      {/* Eine einfache Überschrift für unser Projekt */}
      <h1 className="text-4xl font-bold mb-6">
        Character Wheel 🔮
      </h1>

      {/* Platzhalter für das zukünftige Rad */}
      <div className="text-center text-gray-400">
        <p>(Hier wird bald das Rad erscheinen...)</p>
      </div>

    </div>
  );
}

export default App;