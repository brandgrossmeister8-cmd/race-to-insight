import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { BrandHeader } from '@/components/game/BrandHeader';
import { racingSounds } from '@/hooks/useRacingSounds';
import { SpeedBadge } from '@/components/game/SpeedBadge';
import { TimerDisplay } from '@/components/game/TimerDisplay';
import { MiniTrack } from '@/components/game/MiniTrack';
import { RaceTrack } from '@/components/game/RaceTrack';
import { Leaderboard } from '@/components/game/Leaderboard';
import { StageAnswer } from '@/components/game/StageAnswer';
import { STAGES } from '@/config/stages';
import { getInterpretation } from '@/config/stages';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const PlayerGamePage = () => {
  const game = useGame();
  const [showOverview, setShowOverview] = useState(false);
  const { roomState, myPlayerId } = game;

  if (!roomState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  const me = roomState.players.find(p => p.id === myPlayerId);
  const stage = roomState.currentStage >= 0 ? STAGES[roomState.currentStage] : null;

  // Final screen
  if (roomState.phase === 'final') {
    const sorted = [...roomState.players].sort((a, b) => b.speed - a.speed);
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <BrandHeader subtitle="Финиш!" compact />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto space-y-6 mt-4">
          <div className="text-center">
            <span className="text-6xl">🏁</span>
            <h2 className="text-2xl font-bold mt-2">Гонка завершена!</h2>
          </div>
          {me && (
            <div className="bg-card rounded-2xl border p-6 text-center space-y-3 shadow-brand">
              <p className="text-sm text-muted-foreground">Ваш результат</p>
              <SpeedBadge speed={me.speed} size="lg" />
              <p className="text-sm font-medium">Позиция: #{me.position}</p>
              <p className="text-xs text-muted-foreground italic">{getInterpretation(me.speed)}</p>
            </div>
          )}
          <Leaderboard players={sorted} />
          <Button variant="outline" className="w-full" onClick={() => game.restartGame()}>
            Новая игра
          </Button>
        </motion.div>
      </div>
    );
  }

  // Expert comment screen
  if (roomState.phase === 'expert-comment') {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <BrandHeader subtitle="Pit-stop" compact />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-6 mt-4">
          <div className="bg-card rounded-2xl border p-6 text-center space-y-4 shadow-brand">
            <span className="text-4xl">🔧</span>
            <h2 className="text-xl font-bold">{stage?.cityName} — Разбор</h2>
            {roomState.adminComment && (
              <div className="p-4 rounded-xl bg-spectator/10 border border-spectator/30 text-left">
                <p className="text-sm">{roomState.adminComment}</p>
              </div>
            )}
            {me && <SpeedBadge speed={me.speed} size="lg" />}
            <p className="text-xs text-muted-foreground">Ожидайте продолжения от ведущего</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Overview toggle
  if (showOverview && roomState.players.length > 0) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <BrandHeader compact />
        <div className="max-w-lg mx-auto space-y-4 mt-4">
          <RaceTrack players={roomState.players} />
          <Leaderboard players={roomState.players} />
          <Button variant="outline" className="w-full" onClick={() => setShowOverview(false)}>
            ← Вернуться к этапу
          </Button>
        </div>
      </div>
    );
  }

  // Playing stage
  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <BrandHeader compact />
      <div className="max-w-md mx-auto space-y-4 mt-2">
        {/* Speed + stage header */}
        <div className="flex items-center justify-between">
          <div>
            {stage && (
              <h2 className="font-bold text-lg">
                {stage.title}: <span className="text-gradient-brand">{stage.cityName}</span>
              </h2>
            )}
          </div>
          {me && <SpeedBadge speed={me.speed} size="md" />}
        </div>

        {/* Timer */}
        <TimerDisplay
          remaining={roomState.timer.remaining}
          total={roomState.timer.total}
          running={roomState.timer.running}
        />

        {/* Mini track */}
        <MiniTrack players={roomState.players} myId={myPlayerId || undefined} />

        {/* Answer UI */}
        {stage && (
          <StageAnswer
            stage={stage}
            onSubmit={(answer) => game.submitAnswer(roomState.currentStage, answer)}
            disabled={!roomState.timer.running && roomState.timer.remaining === roomState.timer.total}
            submitted={me?.status === 'submitted' || me?.status === 'decided'}
          />
        )}

        {/* Overview button */}
        <Button variant="ghost" size="sm" className="w-full" onClick={() => setShowOverview(true)}>
          👁️ Общий обзор трассы
        </Button>
      </div>
    </div>
  );
};

export default PlayerGamePage;
