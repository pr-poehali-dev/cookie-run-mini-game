import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Ingredient {
  id: string;
  name: string;
  image?: string;
  emoji: string;
  required: number;
  current: number;
  special?: boolean;
}

interface Decoration {
  id: string;
  name: string;
  image?: string;
  emoji: string;
  added: boolean;
  special?: boolean;
}

type GameStage = 'intro' | 'dialogue1' | 'dialogue2' | 'blackout' | 'shadow-kitchen' | 'ingredients' | 'baking' | 'decoration' | 'complete';

const Index = () => {
  const [gameStage, setGameStage] = useState<GameStage>('intro');
  const [dialogueStep, setDialogueStep] = useState(0);
  const [showBlackScreen, setShowBlackScreen] = useState(false);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'egg', name: 'Яйца', emoji: '🥚', required: 3, current: 0 },
    { id: 'milk', name: 'Молоко', emoji: '🥛', required: 1, current: 0 },
    { id: 'flour', name: 'Мука', emoji: '🌾', required: 2, current: 0 },
    { id: 'sugar', name: 'Сахар', emoji: '🍬', required: 2, current: 0 },
    { id: 'salt', name: 'Соль', emoji: '🧂', required: 1, current: 0 },
    { id: 'vanilla-cone', name: 'Ванильный рожок', image: 'https://cdn.poehali.dev/files/80fe75d3-fefc-4d33-b256-1c24d90ee11c.png', emoji: '🍦', required: 1, current: 0, special: true },
    { id: 'soulgem', name: 'СоулДжем', image: 'https://cdn.poehali.dev/files/fcd6c79c-e70a-4298-8dc4-9a80d57bda0f.png', emoji: '💎', required: 1, current: 0, special: true },
  ]);

  const [decorations, setDecorations] = useState<Decoration[]>([
    { id: 'strawberry', name: 'Клубника', emoji: '🍓', added: false },
    { id: 'cherry', name: 'Вишня', image: 'https://cdn.poehali.dev/files/3031bba8-dd66-4831-908f-c941c037bc14.png', emoji: '🍒', added: false },
    { id: 'sprinkles', name: 'Посыпка', emoji: '✨', added: false },
    { id: 'raspberry', name: 'Малиновое варенье', emoji: '🫐', added: false },
  ]);

  const [bakingProgress, setBakingProgress] = useState(0);

  const totalRequired = ingredients.reduce((sum, ing) => sum + ing.required, 0);
  const totalAdded = ingredients.reduce((sum, ing) => sum + ing.current, 0);
  const ingredientsProgress = (totalAdded / totalRequired) * 100;
  const decorationsAdded = decorations.filter(d => d.added).length;

  const dialogues = {
    intro: [
      { speaker: 'vanilla', text: 'Shadow Milk, давай вместе испечём ванильный торт! 🍰', image: 'https://cdn.poehali.dev/files/9f36997f-ea66-4bd9-bfac-a0dad940110c.png', emotion: 'happy' },
      { speaker: 'shadow', text: 'Хм... Звучит скучно, но почему бы и нет~ 😏', image: 'https://cdn.poehali.dev/files/94fd5299-cf50-470d-bd90-90b2b57a4bda.png', emotion: 'bored' },
    ],
    dialogue1: [
      { speaker: 'vanilla', text: 'Отлично! Давай начнём с ингредиентов!', image: 'https://cdn.poehali.dev/files/87ad8234-a254-47f7-b7dd-a002a3464b5a.png', emotion: 'excited' },
      { speaker: 'shadow', text: '*зевает* Это так... обыденно... 😴', image: 'https://cdn.poehali.dev/files/7d392ee5-7710-4f34-ada0-003088f3acae.png', emotion: 'sleepy' },
    ],
    dialogue2: [
      { speaker: 'shadow', text: 'Знаешь что, Ваниль? Мне надоело! 😈', image: 'https://cdn.poehali.dev/files/759acc78-0be6-4c30-a3a4-765c75bb5607.png', emotion: 'evil' },
      { speaker: 'shadow', text: 'Пора добавить... ВАНИЛЬНЫЙ СЮРПРИЗ! ✨', image: 'https://cdn.poehali.dev/files/56bd70dc-7d67-4aca-85a2-0f455c1b406f.png', emotion: 'excited' },
      { speaker: 'vanilla', text: 'Что?! Shadow, подожди— 😨', image: 'https://cdn.poehali.dev/files/7b9e2a9e-2260-403b-81ac-41f2e95b7408.png', emotion: 'worried' },
    ],
  };

  const handleStartGame = () => {
    setGameStage('intro');
    setDialogueStep(0);
  };

  const handleNextDialogue = () => {
    if (gameStage === 'intro') {
      if (dialogueStep < dialogues.intro.length - 1) {
        setDialogueStep(dialogueStep + 1);
      } else {
        setGameStage('dialogue1');
        setDialogueStep(0);
      }
    } else if (gameStage === 'dialogue1') {
      if (dialogueStep < dialogues.dialogue1.length - 1) {
        setDialogueStep(dialogueStep + 1);
      } else {
        setGameStage('dialogue2');
        setDialogueStep(0);
      }
    } else if (gameStage === 'dialogue2') {
      if (dialogueStep < dialogues.dialogue2.length - 1) {
        setDialogueStep(dialogueStep + 1);
      } else {
        setShowBlackScreen(true);
        setTimeout(() => {
          setGameStage('shadow-kitchen');
          setShowBlackScreen(false);
          toast('😈 Теперь готовим по-моему!', { duration: 3000 });
        }, 2000);
      }
    }
  };

  const handleStartCooking = () => {
    setGameStage('ingredients');
  };

  const handleAddIngredient = (id: string) => {
    setIngredients(prev =>
      prev.map(ing => {
        if (ing.id === id && ing.current < ing.required) {
          const newCurrent = ing.current + 1;
          
          if (ing.special) {
            toast.success(`✨ Особый ингредиент! ${ing.name}`, { duration: 2000 });
          } else {
            toast.success(`${ing.emoji} Добавлено: ${ing.name} (${newCurrent}/${ing.required})`);
          }
          
          if (newCurrent === ing.required) {
            toast('✓ Готово!', { duration: 1500 });
          }
          
          return { ...ing, current: newCurrent };
        }
        return ing;
      })
    );
  };

  const handleStartBaking = () => {
    const allComplete = ingredients.every(ing => ing.current === ing.required);
    
    if (!allComplete) {
      toast.error('❌ Добавьте все ингредиенты!');
      return;
    }

    setGameStage('baking');
    toast.loading('🔥 Shadow Milk готовит...', { duration: 1000 });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setBakingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setGameStage('decoration');
          toast.success('😈 Корж готов! Время украшать!');
        }, 500);
      }
    }, 100);
  };

  const handleAddDecoration = (id: string) => {
    setDecorations(prev =>
      prev.map(dec => {
        if (dec.id === id && !dec.added) {
          toast.success(`${dec.emoji} Добавлено: ${dec.name}`);
          return { ...dec, added: true };
        }
        return dec;
      })
    );
  };

  const handleFinishCake = () => {
    if (decorationsAdded < 2) {
      toast.error('❌ Добавьте минимум 2 украшения!');
      return;
    }
    
    setGameStage('complete');
    toast.success('🎉 Торт Shadow Milk готов!', { duration: 5000 });
  };

  const handleReset = () => {
    setGameStage('intro');
    setDialogueStep(0);
    setBakingProgress(0);
    setIngredients(prev => prev.map(ing => ({ ...ing, current: 0 })));
    setDecorations(prev => prev.map(dec => ({ ...dec, added: false })));
  };

  if (showBlackScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-6xl text-white animate-pulse">✨</div>
      </div>
    );
  }

  if (gameStage === 'intro' || gameStage === 'dialogue1' || gameStage === 'dialogue2') {
    const currentDialogues = gameStage === 'intro' ? dialogues.intro : gameStage === 'dialogue1' ? dialogues.dialogue1 : dialogues.dialogue2;
    const currentDialogue = currentDialogues[dialogueStep];
    const isVanilla = currentDialogue.speaker === 'vanilla';

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
        isVanilla 
          ? 'bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300' 
          : 'bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800'
      }`}>
        <Card className="max-w-3xl w-full p-8 shadow-2xl border-4 border-white">
          <div className="flex flex-col items-center space-y-6">
            <img 
              src={currentDialogue.image}
              alt={currentDialogue.speaker}
              className="w-48 h-48 object-contain animate-float"
            />
            
            <Card className={`p-6 w-full border-4 ${
              isVanilla 
                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400' 
                : 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-400'
            }`}>
              <p className={`text-xl md:text-2xl font-bold text-center ${
                isVanilla ? 'text-yellow-900' : 'text-white'
              }`}>
                {currentDialogue.text}
              </p>
            </Card>

            <Button
              onClick={handleNextDialogue}
              size="lg"
              className={`text-xl py-6 px-12 font-bold shadow-xl hover:scale-105 transition-transform ${
                isVanilla
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}
            >
              {dialogueStep < currentDialogues.length - 1 ? 'Далее →' : gameStage === 'dialogue2' ? '✨ Сюрприз!' : 'Далее →'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (gameStage === 'shadow-kitchen') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <Card className="max-w-3xl w-full p-8 text-center space-y-6 shadow-2xl border-4 border-blue-400">
          <div className="text-8xl animate-wiggle">😈</div>
          
          <img 
            src="https://cdn.poehali.dev/files/56bd70dc-7d67-4aca-85a2-0f455c1b406f.png"
            alt="Shadow Milk"
            className="w-48 h-48 mx-auto object-contain animate-bounce"
          />
          
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Кухня Shadow Milk
          </h1>
          
          <p className="text-xl text-blue-200 font-semibold">
            Теперь готовим по-настоящему интересный торт! 🎭
          </p>
          
          <p className="text-lg text-blue-300">
            Добавим особые ингредиенты... хе-хе-хе! 😏
          </p>

          <Button
            onClick={handleStartCooking}
            size="lg"
            className="text-2xl py-8 px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-110 transition-transform duration-300 shadow-xl font-bold"
          >
            🎭 Начать готовить
          </Button>
        </Card>
      </div>
    );
  }

  if (gameStage === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <Card className="max-w-2xl w-full p-8 text-center space-y-6 shadow-2xl border-4 border-blue-400">
          <div className="text-9xl animate-bounce">🎉</div>
          
          <img 
            src="https://cdn.poehali.dev/files/10e7a190-5aba-4ef4-9d11-7868ddaeb4d9.png"
            alt="Shadow Milk"
            className="w-40 h-40 mx-auto object-contain animate-wiggle"
          />
          
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Идеально!
          </h1>
          <div className="text-8xl my-8 animate-pulse-scale">🍰</div>
          <p className="text-2xl font-bold text-blue-200">
            Торт с ванильным сюрпризом готов!
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 my-4">
            <img src="https://cdn.poehali.dev/files/80fe75d3-fefc-4d33-b256-1c24d90ee11c.png" className="w-16 h-16 object-contain animate-bounce" />
            <img src="https://cdn.poehali.dev/files/fcd6c79c-e70a-4298-8dc4-9a80d57bda0f.png" className="w-16 h-16 object-contain animate-bounce" />
            {decorations.filter(d => d.added).map(dec => (
              <span key={dec.id} className="text-4xl animate-float">
                {dec.image ? <img src={dec.image} className="w-16 h-16 object-contain" /> : dec.emoji}
              </span>
            ))}
          </div>
          
          <p className="text-lg text-blue-300 font-semibold">
            Shadow Milk создал свой шедевр! 😈✨
          </p>
          <Button
            onClick={handleReset}
            size="lg"
            className="text-2xl py-8 px-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-110 transition-transform duration-300 shadow-xl font-bold"
          >
            🔄 Начать заново
          </Button>
        </Card>
      </div>
    );
  }

  if (gameStage === 'baking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 p-4">
        <Card className="max-w-2xl w-full p-8 text-center space-y-6 shadow-2xl border-4 border-blue-400">
          <img 
            src="https://cdn.poehali.dev/files/759acc78-0be6-4c30-a3a4-765c75bb5607.png"
            alt="Shadow Milk"
            className="w-32 h-32 mx-auto object-contain"
          />
          
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            🔥 Магическая выпечка
          </h1>
          
          <div className="text-9xl animate-wiggle my-8">
            🔥
          </div>
          
          <Progress value={bakingProgress} className="h-8" />
          <p className="text-2xl font-bold text-blue-200">
            {Math.round(bakingProgress)}%
          </p>
          
          <div className="text-6xl animate-pulse-scale">
            🍰
          </div>
          
          <p className="text-lg text-blue-300 font-semibold">
            Shadow Milk колдует над тортом... ✨
          </p>
        </Card>
      </div>
    );
  }

  if (gameStage === 'decoration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="p-6 shadow-xl border-4 border-blue-400 bg-gradient-to-r from-blue-900/80 to-purple-900/80">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <img 
                src="https://cdn.poehali.dev/files/94fd5299-cf50-470d-bd90-90b2b57a4bda.png"
                alt="Shadow Milk"
                className="w-24 h-24 object-contain"
              />
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  🎨 Украшаем шедевр
                </h1>
                <p className="text-lg text-blue-200 font-semibold mt-2">
                  Украшений: {decorationsAdded}/4 (минимум 2)
                </p>
              </div>
              
              <div className="text-6xl animate-pulse-scale">
                🍰
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {decorations.map((decoration) => {
              return (
                <Card
                  key={decoration.id}
                  className={`p-6 text-center space-y-3 transition-all duration-300 border-4 ${
                    decoration.added
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-blue-400 shadow-lg'
                      : 'bg-blue-900/50 border-blue-600 hover:border-purple-400 hover:scale-105 cursor-pointer'
                  }`}
                  onClick={() => !decoration.added && handleAddDecoration(decoration.id)}
                >
                  {decoration.image ? (
                    <img src={decoration.image} className={`w-16 h-16 mx-auto object-contain ${!decoration.added ? 'animate-float' : ''}`} />
                  ) : (
                    <div className={`text-6xl ${!decoration.added ? 'animate-float' : ''}`}>
                      {decoration.emoji}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white">
                    {decoration.name}
                  </h3>
                  <div className="text-3xl font-bold">
                    {decoration.added ? (
                      <span className="text-green-400 animate-pulse-scale">✓</span>
                    ) : (
                      <span className="text-purple-300">+</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 text-center space-y-4 border-4 border-blue-400 bg-gradient-to-r from-blue-900/80 to-purple-900/80">
            <div className="flex justify-center gap-4 flex-wrap my-4">
              {decorations.filter(d => d.added).map(dec => (
                <span key={dec.id} className="text-5xl animate-bounce">
                  {dec.image ? <img src={dec.image} className="w-16 h-16 object-contain" /> : dec.emoji}
                </span>
              ))}
            </div>
            
            <Button
              onClick={handleFinishCake}
              disabled={decorationsAdded < 2}
              size="lg"
              className={`text-2xl py-8 px-12 font-bold shadow-xl transition-all duration-300 ${
                decorationsAdded >= 2
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-110 animate-pulse-scale'
                  : 'opacity-50 cursor-not-allowed bg-gray-700'
              }`}
            >
              ✨ Завершить шедевр
            </Button>
            
            {decorationsAdded < 2 && (
              <p className="text-sm text-blue-300 font-semibold">
                Добавьте минимум 2 украшения
              </p>
            )}
          </Card>

          <div className="text-center">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="text-lg font-bold border-2 border-blue-400 bg-blue-900/50 text-white hover:bg-blue-800"
            >
              🔄 Начать заново
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-6 shadow-xl border-4 border-blue-400 bg-gradient-to-r from-blue-900/80 to-purple-900/80">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <img 
              src="https://cdn.poehali.dev/files/56bd70dc-7d67-4aca-85a2-0f455c1b406f.png"
              alt="Shadow Milk"
              className="w-24 h-24 object-contain"
            />
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                😈 Готовим тесто
              </h1>
              <div className="text-2xl font-bold text-blue-200 mt-2">
                {totalAdded}/{totalRequired}
              </div>
            </div>
          </div>
          
          <Progress value={ingredientsProgress} className="h-6 mb-2 mt-4" />
          <p className="text-sm text-center font-semibold text-blue-200">
            Прогресс: {Math.round(ingredientsProgress)}%
          </p>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ingredients.map((ingredient) => {
            const isComplete = ingredient.current === ingredient.required;
            const canAdd = ingredient.current < ingredient.required;

            return (
              <Card
                key={ingredient.id}
                className={`p-6 text-center space-y-3 transition-all duration-300 border-4 ${
                  ingredient.special
                    ? isComplete
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-blue-400 shadow-xl'
                      : 'bg-gradient-to-br from-purple-900 to-blue-900 border-purple-500 shadow-lg'
                    : isComplete
                    ? 'bg-gradient-to-br from-blue-700 to-purple-700 border-blue-400 shadow-lg'
                    : 'bg-blue-900/50 border-blue-600'
                } ${canAdd && !isComplete ? 'hover:scale-105 cursor-pointer hover:border-purple-400' : ''}`}
                onClick={() => canAdd && handleAddIngredient(ingredient.id)}
              >
                {ingredient.image ? (
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.name}
                    className={`w-16 h-16 mx-auto object-contain ${!isComplete && canAdd ? 'animate-float' : ''}`}
                  />
                ) : (
                  <div className={`text-6xl ${!isComplete && canAdd ? 'animate-float' : ''}`}>
                    {ingredient.emoji}
                  </div>
                )}
                <h3 className={`text-lg font-bold ${ingredient.special ? 'text-yellow-300' : 'text-white'}`}>
                  {ingredient.name}
                </h3>
                {ingredient.special && <div className="text-xs text-yellow-200">✨ Особый</div>}
                <div className="text-3xl font-bold">
                  {isComplete ? (
                    <span className="text-green-400 animate-pulse-scale">✓</span>
                  ) : (
                    <span className="text-purple-300">
                      {ingredient.current}/{ingredient.required}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-8 text-center space-y-4 border-4 border-blue-400 shadow-xl bg-gradient-to-r from-blue-900/80 to-purple-900/80">
          <div className="text-7xl mx-auto animate-bounce">
            🥣
          </div>
          <Button
            onClick={handleStartBaking}
            disabled={ingredientsProgress < 100}
            size="lg"
            className={`text-2xl py-8 px-12 font-bold shadow-xl transition-all duration-300 ${
              ingredientsProgress === 100
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-110 animate-pulse-scale'
                : 'opacity-50 cursor-not-allowed bg-gray-700'
            }`}
          >
            🔥 Магическая выпечка
          </Button>
          {ingredientsProgress < 100 && (
            <p className="text-sm text-blue-300 font-semibold">
              Добавьте все ингредиенты
            </p>
          )}
        </Card>

        <div className="text-center">
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="text-lg font-bold border-2 border-blue-400 bg-blue-900/50 text-white hover:bg-blue-800"
          >
            🔄 Начать заново
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;