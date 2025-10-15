import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  required: number;
  current: number;
}

interface Decoration {
  id: string;
  name: string;
  emoji: string;
  added: boolean;
}

type GameStage = 'start' | 'ingredients' | 'baking' | 'decoration' | 'complete';

const Index = () => {
  const [gameStage, setGameStage] = useState<GameStage>('start');
  const [selectedCharacter, setSelectedCharacter] = useState<'vanilla' | 'shadow' | null>(null);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'egg', name: 'Яйца', emoji: '🥚', required: 3, current: 0 },
    { id: 'milk', name: 'Молоко', emoji: '🥛', required: 1, current: 0 },
    { id: 'flour', name: 'Мука', emoji: '🌾', required: 2, current: 0 },
    { id: 'sugar', name: 'Сахар', emoji: '🍬', required: 2, current: 0 },
    { id: 'salt', name: 'Соль', emoji: '🧂', required: 1, current: 0 },
    { id: 'vanilla', name: 'Ваниль', emoji: '🌼', required: 1, current: 0 },
  ]);

  const [decorations, setDecorations] = useState<Decoration[]>([
    { id: 'strawberry', name: 'Клубника', emoji: '🍓', added: false },
    { id: 'cherry', name: 'Вишня', emoji: '🍒', added: false },
    { id: 'sprinkles', name: 'Посыпка', emoji: '✨', added: false },
    { id: 'raspberry', name: 'Малиновое варенье', emoji: '🫐', added: false },
    { id: 'cone', name: 'Ванильный рожок', emoji: '🍦', added: false },
  ]);

  const [bakingProgress, setBakingProgress] = useState(0);

  const totalRequired = ingredients.reduce((sum, ing) => sum + ing.required, 0);
  const totalAdded = ingredients.reduce((sum, ing) => sum + ing.current, 0);
  const ingredientsProgress = (totalAdded / totalRequired) * 100;
  const decorationsAdded = decorations.filter(d => d.added).length;

  const handleStartGame = (character: 'vanilla' | 'shadow') => {
    setSelectedCharacter(character);
    setGameStage('ingredients');
    const characterName = character === 'vanilla' ? 'Pure Vanilla Cookie' : 'Shadow Milk Cookie';
    toast.success(`🎮 ${characterName} готовит торт!`);
  };

  const handleAddIngredient = (id: string) => {
    setIngredients(prev =>
      prev.map(ing => {
        if (ing.id === id && ing.current < ing.required) {
          const newCurrent = ing.current + 1;
          toast.success(`${ing.emoji} Добавлено: ${ing.name} (${newCurrent}/${ing.required})`);
          
          if (newCurrent === ing.required) {
            toast('✨ Идеально!', { duration: 2000 });
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
    toast.loading('🔥 Ставим в печь...', { duration: 1000 });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setBakingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setGameStage('decoration');
          toast.success('🎂 Корж готов! Добавим декор!');
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
    if (decorationsAdded < 3) {
      toast.error('❌ Добавьте минимум 3 украшения!');
      return;
    }
    
    setGameStage('complete');
    toast.success('🎉 Ванильный торт готов!', { duration: 5000 });
  };

  const handleReset = () => {
    setGameStage('start');
    setSelectedCharacter(null);
    setBakingProgress(0);
    setIngredients(prev => prev.map(ing => ({ ...ing, current: 0 })));
    setDecorations(prev => prev.map(dec => ({ ...dec, added: false })));
    toast('🔄 Начинаем заново!');
  };

  if (gameStage === 'start') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cookie-pink via-cookie-yellow to-cookie-mint p-4">
        <Card className="max-w-3xl w-full p-8 text-center space-y-6 shadow-2xl border-4 border-white">
          <div className="text-8xl animate-bounce">🍰</div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cookie-pink to-cookie-purple drop-shadow-lg">
            Cookie Run Kingdom
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-cookie-purple">
            Ванильный Торт
          </h2>
          <p className="text-lg text-muted-foreground font-semibold">
            Выбери персонажа и испеки торт! 🎂
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card 
              className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border-4 border-cookie-yellow hover:border-cookie-purple"
              onClick={() => handleStartGame('vanilla')}
            >
              <img 
                src="https://cdn.poehali.dev/files/91e7ad9c-bcfd-4690-9efe-3889b9a5ab62.png" 
                alt="Pure Vanilla Cookie"
                className="w-48 h-48 mx-auto object-contain animate-float"
              />
              <h3 className="text-2xl font-bold text-cookie-purple mt-4">
                Pure Vanilla Cookie
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Мудрый и добрый повар
              </p>
            </Card>

            <Card 
              className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border-4 border-cookie-mint hover:border-cookie-purple"
              onClick={() => handleStartGame('shadow')}
            >
              <img 
                src="https://cdn.poehali.dev/files/3e969ae9-0da6-4246-b846-016512c1c4d4.png" 
                alt="Shadow Milk Cookie"
                className="w-48 h-48 mx-auto object-contain animate-float"
              />
              <h3 className="text-2xl font-bold text-cookie-purple mt-4">
                Shadow Milk Cookie
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Загадочный и креативный повар
              </p>
            </Card>
          </div>
        </Card>
      </div>
    );
  }

  if (gameStage === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cookie-yellow via-cookie-pink to-cookie-purple p-4">
        <Card className="max-w-2xl w-full p-8 text-center space-y-6 shadow-2xl border-4 border-white">
          <div className="text-9xl animate-bounce">🎉</div>
          
          {selectedCharacter && (
            <img 
              src={selectedCharacter === 'vanilla' 
                ? 'https://cdn.poehali.dev/files/91e7ad9c-bcfd-4690-9efe-3889b9a5ab62.png'
                : 'https://cdn.poehali.dev/files/3e969ae9-0da6-4246-b846-016512c1c4d4.png'
              }
              alt="Character"
              className="w-40 h-40 mx-auto object-contain animate-wiggle"
            />
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cookie-pink to-cookie-purple">
            Поздравляем!
          </h1>
          <div className="text-8xl my-8 animate-pulse-scale">🍰</div>
          <p className="text-2xl font-bold text-cookie-purple">
            Ванильный торт готов!
          </p>
          <div className="flex flex-wrap justify-center gap-2 my-4">
            {decorations.filter(d => d.added).map(dec => (
              <span key={dec.id} className="text-4xl animate-bounce">
                {dec.emoji}
              </span>
            ))}
          </div>
          <p className="text-lg text-muted-foreground font-semibold">
            Ты отлично справился с рецептом! 👨‍🍳
          </p>
          <Button
            onClick={handleReset}
            size="lg"
            className="text-2xl py-8 px-12 bg-gradient-to-r from-cookie-mint to-cookie-purple hover:scale-110 transition-transform duration-300 shadow-xl font-bold"
          >
            🔄 Испечь ещё торт
          </Button>
        </Card>
      </div>
    );
  }

  if (gameStage === 'baking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-400 to-cookie-pink p-4">
        <Card className="max-w-2xl w-full p-8 text-center space-y-6 shadow-2xl border-4 border-white">
          {selectedCharacter && (
            <img 
              src={selectedCharacter === 'vanilla' 
                ? 'https://cdn.poehali.dev/files/91e7ad9c-bcfd-4690-9efe-3889b9a5ab62.png'
                : 'https://cdn.poehali.dev/files/3e969ae9-0da6-4246-b846-016512c1c4d4.png'
              }
              alt="Character"
              className="w-32 h-32 mx-auto object-contain"
            />
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-cookie-purple">
            🔥 Выпекаем в печи
          </h1>
          
          <div className="text-9xl animate-wiggle my-8">
            🔥
          </div>
          
          <Progress value={bakingProgress} className="h-8" />
          <p className="text-2xl font-bold text-cookie-purple">
            {Math.round(bakingProgress)}%
          </p>
          
          <div className="text-6xl animate-bounce">
            🍰
          </div>
          
          <p className="text-lg text-muted-foreground font-semibold">
            Ожидаем пока корж испечётся...
          </p>
        </Card>
      </div>
    );
  }

  if (gameStage === 'decoration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cookie-mint via-cookie-yellow to-cookie-pink p-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="p-6 shadow-xl border-4 border-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {selectedCharacter && (
                <img 
                  src={selectedCharacter === 'vanilla' 
                    ? 'https://cdn.poehali.dev/files/91e7ad9c-bcfd-4690-9efe-3889b9a5ab62.png'
                    : 'https://cdn.poehali.dev/files/3e969ae9-0da6-4246-b846-016512c1c4d4.png'
                  }
                  alt="Character"
                  className="w-24 h-24 object-contain"
                />
              )}
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cookie-pink to-cookie-purple">
                  🎨 Украшаем торт
                </h1>
                <p className="text-lg text-muted-foreground font-semibold mt-2">
                  Добавлено украшений: {decorationsAdded}/5 (минимум 3)
                </p>
              </div>
              
              <div className="text-6xl animate-pulse-scale">
                🍰
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {decorations.map((decoration) => {
              return (
                <Card
                  key={decoration.id}
                  className={`p-6 text-center space-y-3 transition-all duration-300 border-4 ${
                    decoration.added
                      ? 'bg-gradient-to-br from-cookie-mint to-white border-cookie-mint shadow-lg'
                      : 'border-white hover:border-cookie-pink hover:scale-105 cursor-pointer'
                  }`}
                  onClick={() => !decoration.added && handleAddDecoration(decoration.id)}
                >
                  <div className={`text-6xl ${!decoration.added ? 'animate-float' : ''}`}>
                    {decoration.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-cookie-purple">
                    {decoration.name}
                  </h3>
                  <div className="text-3xl font-bold">
                    {decoration.added ? (
                      <span className="text-green-600 animate-pulse-scale">✓</span>
                    ) : (
                      <span className="text-cookie-pink">+</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 text-center space-y-4 border-4 border-white shadow-xl">
            <div className="flex justify-center gap-4 flex-wrap my-4">
              {decorations.filter(d => d.added).map(dec => (
                <span key={dec.id} className="text-5xl animate-bounce">
                  {dec.emoji}
                </span>
              ))}
            </div>
            
            <Button
              onClick={handleFinishCake}
              disabled={decorationsAdded < 3}
              size="lg"
              className={`text-2xl py-8 px-12 font-bold shadow-xl transition-all duration-300 ${
                decorationsAdded >= 3
                  ? 'bg-gradient-to-r from-cookie-pink to-cookie-purple hover:scale-110 animate-pulse-scale'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              ✨ Завершить торт
            </Button>
            
            {decorationsAdded < 3 && (
              <p className="text-sm text-muted-foreground font-semibold">
                Добавьте минимум 3 украшения
              </p>
            )}
          </Card>

          <div className="text-center">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="text-lg font-bold border-2 border-cookie-purple hover:bg-cookie-purple hover:text-white"
            >
              🔄 Начать заново
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cookie-mint via-cookie-yellow to-cookie-pink p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-6 shadow-xl border-4 border-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {selectedCharacter && (
              <img 
                src={selectedCharacter === 'vanilla' 
                  ? 'https://cdn.poehali.dev/files/91e7ad9c-bcfd-4690-9efe-3889b9a5ab62.png'
                  : 'https://cdn.poehali.dev/files/3e969ae9-0da6-4246-b846-016512c1c4d4.png'
                }
                alt="Character"
                className="w-24 h-24 object-contain"
              />
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cookie-pink to-cookie-purple">
                🍰 Готовим Тесто
              </h1>
              <div className="text-2xl font-bold text-cookie-purple mt-2">
                {totalAdded}/{totalRequired}
              </div>
            </div>
          </div>
          
          <Progress value={ingredientsProgress} className="h-6 mb-2 mt-4" />
          <p className="text-sm text-center font-semibold text-muted-foreground">
            Прогресс: {Math.round(ingredientsProgress)}%
          </p>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ingredients.map((ingredient) => {
            const isComplete = ingredient.current === ingredient.required;
            const canAdd = ingredient.current < ingredient.required;

            return (
              <Card
                key={ingredient.id}
                className={`p-6 text-center space-y-3 transition-all duration-300 border-4 ${
                  isComplete
                    ? 'bg-gradient-to-br from-cookie-mint to-white border-cookie-mint shadow-lg'
                    : 'border-white hover:border-cookie-pink'
                } ${canAdd && !isComplete ? 'hover:scale-105 cursor-pointer' : ''}`}
                onClick={() => canAdd && handleAddIngredient(ingredient.id)}
              >
                <div className={`text-6xl ${!isComplete && canAdd ? 'animate-float' : ''}`}>
                  {ingredient.emoji}
                </div>
                <h3 className="text-xl font-bold text-cookie-purple">
                  {ingredient.name}
                </h3>
                <div className="text-3xl font-bold">
                  {isComplete ? (
                    <span className="text-green-600 animate-pulse-scale">✓</span>
                  ) : (
                    <span className="text-cookie-pink">
                      {ingredient.current}/{ingredient.required}
                    </span>
                  )}
                </div>
                {!isComplete && canAdd && (
                  <p className="text-sm text-muted-foreground font-semibold">
                    Нажми для добавления
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="p-8 text-center space-y-4 border-4 border-white shadow-xl">
          <div className="text-7xl mx-auto animate-bounce">
            🥣
          </div>
          <Button
            onClick={handleStartBaking}
            disabled={ingredientsProgress < 100}
            size="lg"
            className={`text-2xl py-8 px-12 font-bold shadow-xl transition-all duration-300 ${
              ingredientsProgress === 100
                ? 'bg-gradient-to-r from-cookie-pink to-cookie-purple hover:scale-110 animate-pulse-scale'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            🔥 Поставить в печь
          </Button>
          {ingredientsProgress < 100 && (
            <p className="text-sm text-muted-foreground font-semibold">
              Добавьте все ингредиенты
            </p>
          )}
        </Card>

        <div className="text-center">
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="text-lg font-bold border-2 border-cookie-purple hover:bg-cookie-purple hover:text-white"
          >
            🔄 Начать заново
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
