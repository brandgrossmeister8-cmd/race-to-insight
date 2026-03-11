import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { BrandHeader } from '@/components/game/BrandHeader';
import { Button } from '@/components/ui/button';
import { MAX_PLAYERS } from '@/config/stages';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const LobbyPage = () => {
  const navigate = useNavigate();
  const game = useGame();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'select' | 'admin' | 'player' | 'spectator'>('select');

  const handleCreateRoom = () => {
    game.createRoom();
    setMode('admin');
  };

  const handleJoin = () => {
    if (!code.trim() || !name.trim()) return;
    game.joinRoom(code.trim().toUpperCase(), name.trim());
  };

  const handleJoinSpectator = () => {
    if (!code.trim()) return;
    game.joinAsSpectator(code.trim().toUpperCase());
    navigate('/spectator');
  };

  const handleStartGame = () => {
    game.startGame();
    navigate('/admin');
  };

  // If player joined successfully
  if (game.role === 'player' && game.roomState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full space-y-6">
          <BrandHeader subtitle="Лобби" compact />
          <div className="bg-card rounded-2xl border p-6 text-center space-y-4 shadow-brand">
            <span className="text-4xl">🏎️</span>
            <h2 className="text-xl font-bold">Вы в гонке!</h2>
            <p className="text-muted-foreground text-sm">Ожидайте старта от ведущего...</p>
            <div className="space-y-2">
              {game.roomState.players.map(p => (
                <div key={p.id} className={cn(
                  'flex items-center gap-2 p-2 rounded-lg',
                  p.id === game.myPlayerId ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50',
                )}>
                  <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{p.name}</span>
                  {p.id === game.myPlayerId && <span className="text-xs text-primary ml-auto">Вы</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin created room
  if (game.role === 'admin' && game.roomState) {
    const shareUrl = `${window.location.origin}/lobby?code=${game.roomState.code}`;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full space-y-6">
          <BrandHeader subtitle="Панель ведущего" compact />
          <div className="bg-card rounded-2xl border p-6 space-y-4 shadow-brand">
            <h2 className="text-xl font-bold text-center">Комната создана</h2>
            
            <div className="text-center p-4 rounded-xl bg-gradient-brand">
              <p className="text-primary-foreground text-xs mb-1">Код комнаты</p>
              <p className="text-4xl font-bold text-primary-foreground tracking-widest">{game.roomState.code}</p>
            </div>

            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 p-2 text-xs rounded-lg border bg-muted truncate"
              />
              <Button size="sm" onClick={() => navigator.clipboard.writeText(shareUrl)}>
                📋
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Игроки ({game.roomState.players.length}/{MAX_PLAYERS}):</p>
              {game.roomState.players.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">Ожидание подключений...</p>
              )}
              {game.roomState.players.map(p => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className={cn(
                    'ml-auto text-xs px-2 py-0.5 rounded-full',
                    p.connected ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive',
                  )}>
                    {p.connected ? 'online' : 'offline'}
                  </span>
                </div>
              ))}
            </div>

            {game.isDemo && game.roomState.players.length < 6 && (
              <Button variant="outline" size="sm" className="w-full" onClick={game.addDemoPlayers}>
                🤖 Добавить тестовых игроков
              </Button>
            )}

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleStartGame}
              disabled={game.roomState.players.length === 0}
            >
              🚦 Старт гонки
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Selection / join screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-6">
        <BrandHeader subtitle="Присоединиться к гонке" />

        {mode === 'select' && (
          <div className="space-y-3">
            <Button variant="hero" size="xl" className="w-full" onClick={handleCreateRoom}>
              🏁 Создать комнату (Ведущий)
            </Button>
            <Button variant="race" size="xl" className="w-full" onClick={() => setMode('player')}>
              🏎️ Войти как игрок
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => setMode('spectator')}>
              👁️ Зритель (Spectator)
            </Button>
          </div>
        )}

        {mode === 'player' && (
          <div className="bg-card rounded-2xl border p-6 space-y-4 shadow-brand">
            <h2 className="text-lg font-bold text-center">Вход в гонку</h2>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Код комнаты"
              maxLength={6}
              className="w-full p-3 rounded-lg border bg-background text-center text-2xl font-bold tracking-widest uppercase focus:ring-2 focus:ring-primary outline-none"
            />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ваше имя"
              maxLength={20}
              className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
            />
            {game.error && <p className="text-destructive text-sm text-center">{game.error}</p>}
            <Button variant="hero" size="lg" className="w-full" onClick={handleJoin} disabled={!code || !name}>
              Присоединиться
            </Button>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setMode('select')}>
              ← Назад
            </Button>
          </div>
        )}

        {mode === 'spectator' && (
          <div className="bg-card rounded-2xl border p-6 space-y-4 shadow-brand">
            <h2 className="text-lg font-bold text-center">Режим зрителя</h2>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Код комнаты"
              maxLength={6}
              className="w-full p-3 rounded-lg border bg-background text-center text-2xl font-bold tracking-widest uppercase focus:ring-2 focus:ring-primary outline-none"
            />
            <Button variant="spectator" size="lg" className="w-full" onClick={handleJoinSpectator} disabled={!code}>
              Смотреть
            </Button>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setMode('select')}>
              ← Назад
            </Button>
          </div>
        )}

        {game.isDemo && (
          <p className="text-xs text-center text-muted-foreground">
            Демо-режим: сервер не подключен. Для полной работы запустите backend.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default LobbyPage;
