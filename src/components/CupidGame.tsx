import { useState, useEffect, useCallback } from "react";
import { Heart, Award, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Cupid {
  id: number;
  x: number;
  y: number;
  caught: boolean;
}

export const CupidGame = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [cupids, setCupids] = useState<Cupid[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const spawnCupid = useCallback(() => {
    if (gameOver || !gameStarted) return;

    const newCupid: Cupid = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // 10-90% to avoid edges
      y: Math.random() * 60 + 10, // 10-70% to avoid edges
      caught: false,
    };

    setCupids((prev) => [...prev, newCupid]);

    // Remove cupid after 2 seconds if not caught
    setTimeout(() => {
      setCupids((prev) => {
        const cupid = prev.find((c) => c.id === newCupid.id);
        if (cupid && !cupid.caught) {
          setLives((l) => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameOver(true);
              if (score > highScore) {
                setHighScore(score);
              }
            }
            return newLives;
          });
        }
        return prev.filter((c) => c.id !== newCupid.id);
      });
    }, 2000);
  }, [gameOver, gameStarted, score, highScore]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      spawnCupid();
    }, 1000);

    return () => clearInterval(interval);
  }, [spawnCupid, gameStarted, gameOver]);

  const catchCupid = (id: number) => {
    setCupids((prev) =>
      prev.map((cupid) =>
        cupid.id === id ? { ...cupid, caught: true } : cupid
      )
    );
    setScore((s) => s + 10);

    // Remove caught cupid after animation
    setTimeout(() => {
      setCupids((prev) => prev.filter((c) => c.id !== id));
    }, 300);
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setCupids([]);
    setGameOver(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setCupids([]);
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="overflow-hidden bg-card border-border shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-6 border-b border-border">
          <h1 className="text-4xl font-bold text-center text-foreground mb-2 flex items-center justify-center gap-2">
            <Heart className="w-8 h-8 fill-heart text-heart animate-pulse" />
            Atrapa a Cupido
            <Heart className="w-8 h-8 fill-heart text-heart animate-pulse" />
          </h1>
          <p className="text-center text-muted-foreground">
            ¡Haz clic en Cupido antes de que llegue a tu corazón!
          </p>
        </div>

        {/* Game Stats */}
        <div className="bg-secondary/50 p-4 flex justify-around items-center border-b border-border">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Puntos</div>
            <div className="text-3xl font-bold text-foreground">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Vidas</div>
            <div className="flex gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 ${
                    i < lives
                      ? "fill-heart text-heart"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Award className="w-4 h-4" />
              Récord
            </div>
            <div className="text-3xl font-bold text-accent">{highScore}</div>
          </div>
        </div>

        {/* Game Area */}
        <div
          className="relative bg-game-bg aspect-video overflow-hidden"
          style={{ minHeight: "400px" }}
        >
          {!gameStarted ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Heart className="w-24 h-24 mx-auto fill-heart text-heart animate-pulse" />
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  ¡Comenzar Juego!
                </Button>
              </div>
            </div>
          ) : gameOver ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm">
              <div className="text-center space-y-6 p-8">
                <h2 className="text-5xl font-bold text-foreground">
                  ¡Juego Terminado!
                </h2>
                <div className="space-y-2">
                  <p className="text-3xl text-foreground">
                    Puntuación: <span className="font-bold text-accent">{score}</span>
                  </p>
                  {score >= highScore && score > 0 && (
                    <p className="text-xl text-success font-semibold animate-pulse">
                      ¡Nuevo Récord! 🎉
                    </p>
                  )}
                </div>
                <Button
                  onClick={resetGame}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Jugar de Nuevo
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Heart at bottom center (player's heart) */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <Heart className="w-20 h-20 fill-heart text-heart drop-shadow-lg animate-pulse" />
              </div>

              {/* Cupids */}
              {cupids.map((cupid) => (
                <button
                  key={cupid.id}
                  onClick={() => !cupid.caught && catchCupid(cupid.id)}
                  className={`absolute transition-all duration-300 cursor-pointer hover:scale-110 ${
                    cupid.caught
                      ? "scale-0 opacity-0"
                      : "scale-100 opacity-100 animate-bounce"
                  }`}
                  style={{
                    left: `${cupid.x}%`,
                    top: `${cupid.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="relative">
                    <div className="text-6xl">💘</div>
                    {cupid.caught && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl animate-ping">💥</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
