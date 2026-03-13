import { useGame } from '@/contexts/GameContext';
import { BrandHeader } from '@/components/game/BrandHeader';
import { RaceTrack } from '@/components/game/RaceTrack';
import { Leaderboard } from '@/components/game/Leaderboard';
import { SpeedBadge } from '@/components/game/SpeedBadge';
import { TimerDisplay } from '@/components/game/TimerDisplay';
import { STAGES, getInterpretation, GAME_TITLE } from '@/config/stages';
import { motion } from 'framer-motion';

const SpectatorViewPage = () => {
  const { roomState } = useGame();

  if (!roomState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dashboard">
        <p className="text-muted-foreground text-2xl">Ожидание подключения...</p>
      </div>
    );
  }

  const stage = roomState.currentStage >= 0 ? STAGES[roomState.currentStage] : null;
  const sorted = [...roomState.players].sort((a, b) => b.speed - a.speed);
  const focusPlayer = roomState.focusPlayerId ? roomState.players.find(p => p.id === roomState.focusPlayerId) : null;

  // Common header for spectator
  const SpectatorHeader = () => (
    <div className="flex items-center justify-between px-6 py-3 bg-gradient-dark">
      <BrandHeader compact />
      {stage && (
        <div className="text-right">
          <p className="text-[#2A168F] font-bold">{stage.cityName.toUpperCase()}</p>
          <p className="text-xs text-muted-foreground">{stage.title}</p>
        </div>
      )}
    </div>
  );

  // TRACK mode
  if (roomState.spectatorMode === 'track' && roomState.phase === 'playing') {
    return (
      <div className="min-h-screen bg-dashboard flex flex-col">
        <SpectatorHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          <h2 className="text-3xl font-bold text-primary-foreground">{GAME_TITLE}</h2>
          <TimerDisplay
            remaining={roomState.timer.remaining}
            total={roomState.timer.total}
            running={roomState.timer.running}
          />
          <RaceTrack players={sorted} className="max-w-4xl" />
        </div>
      </div>
    );
  }

  // RANKING mode
  if (roomState.spectatorMode === 'ranking') {
    return (
      <div className="min-h-screen bg-dashboard flex flex-col">
        <SpectatorHeader />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full">
            <Leaderboard players={sorted} className="text-lg" />
          </div>
        </div>
      </div>
    );
  }

  // FOCUS mode
  if (roomState.spectatorMode === 'focus' && focusPlayer) {
    return (
      <div className="min-h-screen bg-dashboard flex flex-col">
        <SpectatorHeader />
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border p-8 max-w-md w-full text-center space-y-6 shadow-brand-lg"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto">
              {focusPlayer.name.charAt(0)}
            </div>
            <h2 className="text-3xl font-bold">{focusPlayer.name}</h2>
            <SpeedBadge speed={focusPlayer.speed} size="lg" />
            <p className="text-lg text-muted-foreground">Позиция: #{focusPlayer.position}</p>
            {stage && focusPlayer.answers[roomState.currentStage] && (
              <div className="p-4 rounded-xl bg-muted text-left text-sm">
                <p className="font-medium mb-1">Ответ:</p>
                <p>{String(focusPlayer.answers[roomState.currentStage])}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // COMMENT mode
  if (roomState.spectatorMode === 'comment' || roomState.phase === 'expert-comment') {
    return (
      <div className="min-h-screen bg-dashboard flex flex-col">
        <SpectatorHeader />
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border p-8 max-w-2xl w-full space-y-6 shadow-brand-lg"
          >
            <div className="text-center">
              <span className="text-5xl">🔧</span>
              <h2 className="text-2xl font-bold mt-3">Pit-stop: Экспертный разбор</h2>
              {stage && <p className="text-[#2A168F] font-bold">{stage.cityName.toUpperCase()}</p>}
            </div>
            {roomState.adminComment && (
              <div className="p-6 rounded-xl bg-spectator/10 border border-spectator/30 text-lg leading-relaxed">
                {roomState.adminComment}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // FINAL mode
  if (roomState.spectatorMode === 'final' || roomState.phase === 'final') {
    return (
      <div className="min-h-screen bg-dashboard flex flex-col">
        <SpectatorHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
            <span className="text-7xl">🏁</span>
            <h2 className="text-4xl font-bold text-primary-foreground mt-4">Финиш!</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
            {sorted.slice(0, 3).map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="bg-card rounded-2xl border p-6 text-center space-y-3 shadow-brand"
              >
                <span className="text-4xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                <h3 className="text-xl font-bold">{p.name}</h3>
                <SpeedBadge speed={p.speed} size="lg" />
                <p className="text-xs text-muted-foreground italic">{getInterpretation(p.speed)}</p>
              </motion.div>
            ))}
          </div>
          {sorted.length > 3 && (
            <div className="flex flex-wrap gap-3 justify-center">
              {sorted.slice(3).map(p => (
                <div key={p.id} className="bg-card rounded-xl border px-4 py-2 flex items-center gap-2">
                  <span className="font-medium">{p.name}</span>
                  <SpeedBadge speed={p.speed} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: show track
  return (
    <div className="min-h-screen bg-dashboard flex flex-col">
      <SpectatorHeader />
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
        <h2 className="text-3xl font-bold text-primary-foreground">{GAME_TITLE}</h2>
        <RaceTrack players={sorted} className="max-w-4xl" />
        <Leaderboard players={sorted} className="max-w-2xl" />
      </div>
    </div>
  );
};

export default SpectatorViewPage;
