import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/contexts/GameContext";
import LandingPage from "./pages/LandingPage";
import TitlePage from "./pages/TitlePage";
import RulesPage from "./pages/RulesPage";
import LobbyPage from "./pages/LobbyPage";
import PlayerGamePage from "./pages/PlayerGamePage";
import AdminPanelPage from "./pages/AdminPanelPage";
import SpectatorViewPage from "./pages/SpectatorViewPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TitlePage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/play" element={<PlayerGamePage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/spectator" element={<SpectatorViewPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
