import { GlobalProvider } from "./state/GlobalContext";

import ThemeToggler from "./components/ThemeToggler";
import Header from "./components/Header";

import CurrentUsage from "./features/CurrentUsage";
import HistoricalUsage from "./features/HistoricalUsage";

import { APP_TITLE } from "./utils/constants";

import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <Header>
        <h1>{APP_TITLE}</h1>
        {/* Change between dark and light themes. I just wanted to try it */}
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
