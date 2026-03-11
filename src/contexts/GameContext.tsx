import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { RoomState, Player, GamePhase, SpectatorMode, Role, PlayerStatus } from '@/types/game';
import { INITIAL_SPEED, MAX_PLAYERS, STAGES } from '@/config/stages';
import { connectSocket, isSocketAvailable, disconnectSocket } from '@/lib/socket';

interface GameContextType {
  role: Role | null;
  roomState: RoomState | null;
  myPlayerId: string | null;
  error: string | null;
  connected: boolean;
  isDemo: boolean;

  createRoom: () => void;
  joinRoom: (code: string, name: string) => void;
  joinAsSpectator: (code: string) => void;
  startGame: () => void;
  submitAnswer: (stageIndex: number, answer: unknown) => void;
  adjustSpeed: (playerId: string, delta: 10 | -10) => void;
  broadcastComment: (comment: string) => void;
  nextStage: () => void;
  finishGame: () => void;
  timerControl: (action: 'start' | 'pause' | 'resume' | 'restart') => void;
  setSpectatorMode: (mode: SpectatorMode, focusPlayerId?: string) => void;
  expertContinue: () => void;
  setRole: (role: Role | null) => void;
  restartGame: () => void;
  addDemoPlayers: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 12);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDemo = !isSocketAvailable();

  useEffect(() => {
    if (!isDemo) {
      const socket = connectSocket();
      if (socket) {
        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        socket.on('room-created', (state: RoomState) => { setRoomState(state); });
        socket.on('room-updated', (state: RoomState) => { setRoomState(state); });
        socket.on('room-joined', (data: { state: RoomState; playerId: string }) => {
          setRoomState(data.state);
          if (data.playerId) setMyPlayerId(data.playerId);
        });
        socket.on('error', (msg: { message: string }) => setError(msg.message));
        socket.on('timer-tick', (remaining: number) => {
          setRoomState(prev => prev ? { ...prev, timer: { ...prev.timer, remaining } } : prev);
        });
        socket.on('timer-ended', () => {
          setRoomState(prev => prev ? { ...prev, timer: { ...prev.timer, running: false, remaining: 0 } } : prev);
        });
        return () => { disconnectSocket(); };
      }
    } else {
      setConnected(true);
    }
  }, [isDemo]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startLocalTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setRoomState(prev => {
        if (!prev || !prev.timer.running) return prev;
        const remaining = prev.timer.remaining - 1;
        if (remaining <= 0) {
          clearTimer();
          return { ...prev, timer: { ...prev.timer, running: false, remaining: 0 } };
        }
        return { ...prev, timer: { ...prev.timer, remaining } };
      });
    }, 1000);
  }, [clearTimer]);

  // Demo mode implementations
  const createRoom = useCallback(() => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('create-room');
      return;
    }
    const code = generateCode();
    const adminId = generateId();
    setMyPlayerId(adminId);
    setRole('admin');
    setRoomState({
      id: generateId(),
      code,
      adminId,
      players: [],
      phase: 'lobby',
      currentStage: -1,
      timer: { running: false, remaining: 0, total: 0 },
      spectatorMode: 'track',
      adminComment: '',
    });
  }, [isDemo]);

  const joinRoom = useCallback((code: string, name: string) => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('join-room', { code, name });
      setRole('player');
      return;
    }
    setRoomState(prev => {
      if (!prev || prev.code !== code) {
        setError('Комната не найдена');
        return prev;
      }
      if (prev.players.length >= MAX_PLAYERS) {
        setError('Максимум 6 игроков');
        return prev;
      }
      const playerId = generateId();
      setMyPlayerId(playerId);
      setRole('player');
      const newPlayer: Player = {
        id: playerId, name, speed: INITIAL_SPEED, position: prev.players.length + 1,
        status: 'waiting', connected: true, answers: {},
      };
      return { ...prev, players: [...prev.players, newPlayer] };
    });
  }, [isDemo]);

  const joinAsSpectator = useCallback((code: string) => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('join-spectator', { code });
      setRole('spectator');
      return;
    }
    setRole('spectator');
  }, [isDemo]);

  const startGame = useCallback(() => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('start-game');
      return;
    }
    setRoomState(prev => {
      if (!prev) return prev;
      const stage = STAGES[0];
      return {
        ...prev,
        phase: 'playing',
        currentStage: 0,
        timer: { running: false, remaining: stage.timerSeconds, total: stage.timerSeconds },
        players: prev.players.map(p => ({ ...p, status: 'waiting' as PlayerStatus })),
      };
    });
  }, [isDemo]);

  const submitAnswer = useCallback((stageIndex: number, answer: unknown) => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('submit-answer', { stageIndex, answer });
      return;
    }
    setRoomState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        players: prev.players.map(p =>
          p.id === myPlayerId
            ? { ...p, status: 'submitted' as PlayerStatus, answers: { ...p.answers, [stageIndex]: answer } }
            : p
        ),
      };
    });
  }, [isDemo, myPlayerId]);

  const adjustSpeed = useCallback((playerId: string, delta: 10 | -10) => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('admin-adjust-speed', { playerId, delta });
      return;
    }
    setRoomState(prev => {
      if (!prev) return prev;
      const players = prev.players.map(p =>
        p.id === playerId ? { ...p, speed: Math.max(0, p.speed + delta), status: 'decided' as PlayerStatus } : p
      );
      // Recalculate positions
      const sorted = [...players].sort((a, b) => b.speed - a.speed);
      sorted.forEach((p, i) => { p.position = i + 1; });
      return { ...prev, players: players.map(p => ({ ...p, position: sorted.findIndex(s => s.id === p.id) + 1 })) };
    });
  }, [isDemo]);

  const broadcastComment = useCallback((comment: string) => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('admin-broadcast-comment', { comment });
      return;
    }
    setRoomState(prev => prev ? { ...prev, adminComment: comment, phase: 'expert-comment' as GamePhase,
      players: prev.players.map(p => ({ ...p, status: 'comment' as PlayerStatus })) } : prev);
  }, [isDemo]);

  const nextStage = useCallback(() => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('admin-next-stage');
      return;
    }
    setRoomState(prev => {
      if (!prev) return prev;
      const next = prev.currentStage + 1;
      if (next >= STAGES.length) return { ...prev, phase: 'final' };
      const stage = STAGES[next];
      return {
        ...prev, currentStage: next, phase: 'playing',
        timer: { running: false, remaining: stage.timerSeconds, total: stage.timerSeconds },
        adminComment: '',
        players: prev.players.map(p => ({ ...p, status: 'waiting' as PlayerStatus })),
      };
    });
  }, [isDemo]);

  const finishGame = useCallback(() => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('admin-finish-game');
      return;
    }
    setRoomState(prev => prev ? { ...prev, phase: 'final' } : prev);
  }, [isDemo]);

  const timerControl = useCallback((action: 'start' | 'pause' | 'resume' | 'restart') => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('admin-timer-control', { action });
      return;
    }
    setRoomState(prev => {
      if (!prev) return prev;
      const stage = STAGES[prev.currentStage];
      if (!stage) return prev;
      switch (action) {
        case 'start':
        case 'resume':
          startLocalTimer();
          return { ...prev, timer: { ...prev.timer, running: true } };
        case 'pause':
          clearTimer();
          return { ...prev, timer: { ...prev.timer, running: false } };
        case 'restart':
          clearTimer();
          const newTimer = { running: false, remaining: stage.timerSeconds, total: stage.timerSeconds };
          return { ...prev, timer: newTimer };
        default: return prev;
      }
    });
  }, [isDemo, startLocalTimer, clearTimer]);

  const setSpectatorModeCtx = useCallback((mode: SpectatorMode, focusPlayerId?: string) => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('admin-set-spectator-mode', { mode, focusPlayerId });
      return;
    }
    setRoomState(prev => prev ? { ...prev, spectatorMode: mode, focusPlayerId } : prev);
  }, [isDemo]);

  const expertContinue = useCallback(() => {
    if (!isDemo) {
      const socket = connectSocket();
      socket?.emit('admin-expert-continue');
      return;
    }
    nextStage();
  }, [isDemo, nextStage]);

  const restartGame = useCallback(() => {
    clearTimer();
    setRoomState(null);
    setRole(null);
    setMyPlayerId(null);
    setError(null);
  }, [clearTimer]);

  const addDemoPlayers = useCallback(() => {
    if (!isDemo) return;
    const demoNames = ['Алексей', 'Мария', 'Дмитрий', 'Елена', 'Сергей', 'Ольга'];
    setRoomState(prev => {
      if (!prev) return prev;
      const remaining = MAX_PLAYERS - prev.players.length;
      const toAdd = demoNames.slice(0, remaining);
      const newPlayers = toAdd.map((name, i) => ({
        id: generateId(),
        name,
        speed: INITIAL_SPEED,
        position: prev.players.length + i + 1,
        status: 'waiting' as PlayerStatus,
        connected: true,
        answers: {},
      }));
      return { ...prev, players: [...prev.players, ...newPlayers] };
    });
  }, [isDemo]);

  return (
    <GameContext.Provider value={{
      role, roomState, myPlayerId, error, connected, isDemo,
      createRoom, joinRoom, joinAsSpectator, startGame, submitAnswer,
      adjustSpeed, broadcastComment, nextStage, finishGame,
      timerControl, setSpectatorMode: setSpectatorModeCtx, expertContinue,
      setRole, restartGame, addDemoPlayers,
    }}>
      {children}
    </GameContext.Provider>
  );
}
