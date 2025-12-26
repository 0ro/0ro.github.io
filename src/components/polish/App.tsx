import "./App.css";
import { useStore } from "./store";
import { Home } from "./Home";
import { Admin } from "./Admin";
import { Learn } from "./Learn";
import { Stats } from "./Stats";

function App() {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case "admin":
        return <Admin />;
      case "learn":
        return <Learn />;
      case "stats":
        return <Stats />;
      case "home":
      default:
        return <Home />;
    }
  };

  return <div className="polish-app">{renderView()}</div>;
}

export default App;
