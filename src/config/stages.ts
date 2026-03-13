import { StageConfig, SpeedInterpretation } from '@/types/game';

export const STAGES: StageConfig[] = [
  {
    index: 0,
    title: 'Этап 1',
    cityName: 'Ассортиминск',
    timerSeconds: 60,
    question: 'Выберите основной тип вашего продукта:',
    answerType: 'single-choice',
    options: [
      { id: 'product', label: 'Товар' },
      { id: 'service', label: 'Услуга' },
      { id: 'info', label: 'Информация' },
      { id: 'tech', label: 'Технология' },
      { id: 'serv', label: 'Сервис' },
      { id: 'raw', label: 'Сырье' },
    ],
  },
  {
    index: 1,
    title: 'Этап 2',
    cityName: 'Брендск',
    timerSeconds: 60,
    question: 'Распределите 100% между Брендом и Ассортиментом:',
    answerType: 'slider',
    sliderLabels: ['Бренд', 'Ассортимент'],
  },
  {
    index: 2,
    title: 'Этап 3',
    cityName: 'Зачемград',
    timerSeconds: 180,
    question: 'Зачем клиенты покупают ваш продукт?',
    answerType: 'textarea',
    placeholder: 'Опишите подробно, зачем клиенты покупают ваш продукт...',
  },
  {
    index: 3,
    title: 'Этап 4',
    cityName: 'Траффик-Сити',
    timerSeconds: 60,
    question: 'Как вы привлекаете клиентов?',
    answerType: 'single-choice',
    options: [
      { id: 'all', label: 'Зовем всех' },
      { id: 'self', label: 'Клиенты приходят сами' },
      { id: 'targeted', label: 'Зовем только тех, кто нужен' },
    ],
  },
  {
    index: 4,
    title: 'Этап 5',
    cityName: 'Цалово',
    timerSeconds: 120,
    question: 'Выберите тип клиента и заполните параметры целевой аудитории:',
    answerType: 'choice-then-cards',
    subChoices: {
      B2B: [
        { id: 'sphere', label: 'Сфера деятельности', editable: true },
        { id: 'size', label: 'Размер компании', editable: true },
        { id: 'decision', label: 'ЛПР / должность', editable: true },
        { id: 'geo', label: 'География', editable: true },
        { id: 'need', label: 'Запрос / потребность', editable: true },
        { id: 'custom1', label: '', editable: true, placeholder: 'Свой параметр' },
        { id: 'custom2', label: '', editable: true, placeholder: 'Свой параметр' },
      ],
      B2C: [
        { id: 'age', label: 'Возраст', editable: true },
        { id: 'gender', label: 'Пол', editable: true },
        { id: 'geo', label: 'География', editable: true },
        { id: 'income', label: 'Доход', editable: true },
        { id: 'interests', label: 'Интересы', editable: true },
        { id: 'pains', label: 'Боли', editable: true },
        { id: 'motivation', label: 'Мотивация', editable: true },
        { id: 'custom1', label: '', editable: true, placeholder: 'Свой параметр' },
        { id: 'custom2', label: '', editable: true, placeholder: 'Свой параметр' },
      ],
    },
    subChoiceHints: {
      B2B: 'Минимум 5 параметров',
      B2C: 'Минимум 7 параметров',
    },
  },
  {
    index: 5,
    title: 'Этап 6',
    cityName: 'Выборг',
    timerSeconds: 60,
    question: 'Распределите 100% между Системностью и Креативностью:',
    answerType: 'slider',
    sliderLabels: ['Системность', 'Креативность'],
  },
];

export const SPEED_INTERPRETATIONS: SpeedInterpretation[] = [
  { speed: 0, text: 'Работа вхолостую, ресурсы тратятся зря' },
  { speed: 30, text: 'Движение есть, но бизнес на грани остановки' },
  { speed: 60, text: 'Базовый уровень, стагнация' },
  { speed: 90, text: 'Хороший прогресс, но эффективность ресурсов лишь 50%' },
  { speed: 120, text: 'Идеально выстроенная система маркетинга' },
];

export function getInterpretation(speed: number): string {
  if (speed <= 0) return SPEED_INTERPRETATIONS[0].text;
  if (speed >= 120) return SPEED_INTERPRETATIONS[4].text;
  
  const sorted = [...SPEED_INTERPRETATIONS].sort((a, b) => a.speed - b.speed);
  let closest = sorted[0];
  let minDiff = Math.abs(speed - closest.speed);
  
  for (const interp of sorted) {
    const diff = Math.abs(speed - interp.speed);
    if (diff < minDiff) {
      minDiff = diff;
      closest = interp;
    }
  }
  
  return closest.text;
}

export const INITIAL_SPEED = 60;
export const SPEED_DELTA = 10;
export const MAX_PLAYERS = 6;
export const BRAND_NAME = 'ИМШИНЕЦКАЯ И ПАРТНЕРЫ';
export const GAME_TITLE = 'Маркетинговый заезд';
