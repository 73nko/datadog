import { GlobalProvider } from "./state/GlobalContext";

import ThemeToggler from "./components/ThemeToggler";
import Header from "./components/Header";

import CurrentUsage from "./features/CurrentUsage";
import HistoricalUsage from "./features/HistoricalUsage";

import "./styles/App.css";

const APP_TITLE = "Load Monitoring Web Application";

function App() {
  return (
    <div className="App">
      <Header>
        <h1>{APP_TITLE}</h1>
        <ThemeToggler />
      </Header>

      <main>
        <GlobalProvider>
          <CurrentUsage />
          <HistoricalUsage />
        </GlobalProvider>
      </main>
    </div>
  );
}

export default App;
