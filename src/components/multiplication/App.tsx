import "./App.css";
import { useStore } from "./store";
import { Home } from "./Home";
import { Level } from "./Level";

function App() {
  const store = useStore();
  return (
    <div className="app">{store.level ? <Level /> : <Home />}</div>
  );
}

export default App;
