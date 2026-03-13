import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BrandHeader } from '@/components/game/BrandHeader';
import { BRAND_NAME, GAME_TITLE, STAGES } from '@/config/stages';
import { motion } from 'framer-motion';
import { 
  Trophy, Users, Monitor, Timer, Zap, Target, 
  ChevronRight, MapPin, Gauge, Flag, ArrowRight
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const }
  })
};

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Users, title: 'До 6 игроков', desc: 'Командная работа в формате Zoom-тренинга' },
    { icon: Monitor, title: 'Spectator View', desc: 'Общий экран для трансляции в Zoom' },
    { icon: Timer, title: 'Таймеры этапов', desc: 'Контроль времени на каждый этап' },
    { icon: Zap, title: 'Realtime', desc: 'Мгновенная синхронизация через WebSocket' },
    { icon: Target, title: '6 этапов', desc: 'От ассортимента до креативности' },
    { icon: Trophy, title: 'Рейтинг', desc: 'Живой лидерборд с анимациями обгонов' },
  ];

  const stages = STAGES.map((s, i) => ({
    city: s.cityName.toUpperCase(),
    time: `${Math.floor(s.timerSeconds / 60)}:${String(s.timerSeconds % 60).padStart(2, '0')}`,
    type: s.answerType === 'single-choice' ? 'Выбор' :
          s.answerType === 'slider' ? 'Слайдер' :
          s.answerType === 'textarea' ? 'Эссе' : 'Карточки',
  }));

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-dark">
        <motion.p
          className="absolute top-6 left-0 right-0 z-20 text-3xl md:text-4xl text-primary-foreground font-black tracking-wide text-center px-4"
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
        >
          <span>{BRAND_NAME.toUpperCase()}</span>
        </motion.p>

        {/* Track lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[20, 35, 50, 65, 80].map((top, i) => (
            <div key={i} className="absolute left-0 right-0 h-px bg-track-line" style={{ top: `${top}%`, opacity: 0.08 + i * 0.03 }} />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={`d-${i}`} className="absolute w-px h-3 bg-track-line opacity-20" style={{ left: `${3 + i * 3.3}%`, top: '49%' }} />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2A168F] bg-[#2A168F] text-white text-sm mb-8">
              <Gauge className="w-4 h-4" />
              Интерактивная бизнес-игра
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4 tracking-tight"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            <span className="text-white">{GAME_TITLE}</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Тренинг по маркетинговой стратегии в метафоре гоночной трассы.
            <br />6 городов - 6 решений.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Button
              variant="hero"
              size="xl"
              className="w-[260px] justify-center bg-[#2A168F] hover:bg-[#6838CE] text-white"
              onClick={() => navigate('/game')}
            >
              🚕 Начать игру <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button variant="outline" size="xl" className="w-[260px] justify-center border-[#A977FA]/50 text-[#A977FA] hover:bg-[#A977FA]/10" onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Как это работает?
            </Button>
          </motion.div>

          {/* Speed display */}
          <motion.div
            className="mt-16 flex items-center justify-center gap-8"
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
          >
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-gradient-brand">60</span>
              <span className="text-xs text-muted-foreground mt-1">км/ч старт</span>
            </div>
            <div className="w-24 h-px bg-gradient-to-r from-primary to-secondary" />
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-spectator">120</span>
              <span className="text-xs text-muted-foreground mt-1">км/ч макс</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Всё для вовлекающего тренинга</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Мультиплеер, реалтайм, спектакулярный вид для Zoom — всё в браузере</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="bg-card border-border hover:border-primary/40 transition-colors h-full group">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <f.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Route / Stages */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-dark">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Маршрут гонки</h2>
            <p className="text-muted-foreground">6 городов — 6 ключевых маркетинговых решений</p>
          </motion.div>

          <div className="relative">
            {/* Track line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-spectator" />

            <div className="space-y-8">
              {stages.map((s, i) => (
                <motion.div
                  key={i}
                  className="relative pl-16 md:pl-20"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-6 top-3 w-4 h-4 rounded-full bg-gradient-brand border-2 border-background shadow-brand" />

                  <Card className="bg-card/5 border-dashboard-border backdrop-blur-sm">
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <MapPin className="w-5 h-5 text-secondary shrink-0" />
                        <div>
                          <h3 className="font-bold text-[#2A168F]">{s.city}</h3>
                          <p className="text-xs text-muted-foreground">Этап {i + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Timer className="w-4 h-4" /> {s.time}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                          {s.type}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Finish */}
              <motion.div
                className="relative pl-16 md:pl-20"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={6}
              >
                <div className="absolute left-4 md:left-6 top-3 w-4 h-4 rounded-full bg-spectator border-2 border-background" />
                <div className="flex items-center gap-3 p-5">
                  <Flag className="w-6 h-6 text-spectator" />
                  <span className="font-bold text-primary-foreground text-lg">Финиш — итоговый рейтинг</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Как играть</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Создайте комнату', desc: 'Ведущий создаёт игровую комнату и получает код для участников. До 6 игроков.' },
              { step: '02', title: 'Проходите этапы', desc: 'Каждый город — маркетинговый вопрос. Ведущий оценивает ответы: +10 или −10 км/ч.' },
              { step: '03', title: 'Финишируйте', desc: 'Финальная скорость = качество маркетинговой стратегии. 120 км/ч — идеальный результат.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-brand mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speed scale */}
      <section className="py-24 px-6 bg-gradient-dark">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Шкала скорости</h2>
            <p className="text-muted-foreground">Что означает ваша финальная скорость</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { speed: 0, label: 'Работа вхолостую', color: 'bg-destructive' },
              { speed: 30, label: 'На грани остановки', color: 'bg-destructive/70' },
              { speed: 60, label: 'Базовый уровень, стагнация', color: 'bg-spectator' },
              { speed: 90, label: 'Хороший прогресс, 50% потенциала', color: 'bg-success/70' },
              { speed: 120, label: 'Идеальная система маркетинга', color: 'bg-success' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <div className="w-16 text-right">
                  <span className="text-2xl font-bold text-primary-foreground">{item.speed}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <div className="flex-1 py-3 px-4 rounded-lg bg-card/5 border border-dashboard-border">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <div className="hidden sm:block flex-1 max-w-[200px]">
                  <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.speed / 120) * 100}%` }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы к заезду?</h2>
          <p className="text-muted-foreground mb-8">Запустите игру прямо сейчас — нужен только браузер</p>
          <Button variant="hero" size="xl" className="w-[260px] justify-center" onClick={() => navigate('/game')}>
            🚕 Начать игру <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">И</span>
            </div>
            <span className="text-sm font-semibold">{BRAND_NAME}</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {BRAND_NAME}. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
