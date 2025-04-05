import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, AlertCircle, Award } from "lucide-react";

interface CoinCollectorGameProps {
  darkMode: boolean;
  onFinish?: (score: number) => void;
}

// Financial tips that appear when collecting coins
const FINANCE_TIPS = [
  "Save at least 20% of your income for long-term goals.",
  "Pay off high-interest debt before investing.",
  "Build an emergency fund covering 3-6 months of expenses.",
  "Start investing early to benefit from compound interest.",
  "Don't try to time the market - invest regularly.",
  "Live below your means to build wealth over time.",
  "Track your spending to identify savings opportunities.",
  "Set specific financial goals with deadlines.",
  "Review your budget regularly and adjust as needed.",
  "Diversify your investments to reduce risk.",
];

// Bad financial decisions to avoid
const BAD_DECISIONS = [
  "Carrying credit card balances month to month",
  "Taking payday loans with high interest",
  "Buying a car you can't afford",
  "Ignoring your retirement planning",
  "Making impulse purchases regularly",
];

const CoinCollectorGame: React.FC<CoinCollectorGameProps> = ({
  darkMode,
  onFinish,
}) => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentTip, setCurrentTip] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [obstacleHit, setObstacleHit] = useState("");
  const [showObstacleMessage, setShowObstacleMessage] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("financeGameHighScore");
    return saved ? parseInt(saved) : 0;
  });

  // Three.js references
  const mountRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const coinsRef = useRef<THREE.Mesh[]>([]);
  const obstaclesRef = useRef<THREE.Mesh[]>([]);
  const directionRef = useRef({ x: 0, z: 0 });
  const lastTimeRef = useRef(0);

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setGameEnded(false);
  };

  // Handle game controls
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          directionRef.current.z = -1;
          break;
        case "ArrowDown":
        case "s":
          directionRef.current.z = 1;
          break;
        case "ArrowLeft":
        case "a":
          directionRef.current.x = -1;
          break;
        case "ArrowRight":
        case "d":
          directionRef.current.x = 1;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "w":
        case "s":
          directionRef.current.z = 0;
          break;
        case "ArrowLeft":
        case "ArrowRight":
        case "a":
        case "d":
          directionRef.current.x = 0;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, gameEnded]);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded]);

  // End the game
  const endGame = () => {
    setGameEnded(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("financeGameHighScore", score.toString());
    }

    if (onFinish) {
      onFinish(score);
    }
  };

  // Set up the Three.js scene
  useEffect(() => {
    if (!mountRef.current || !gameStarted || gameEnded) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(darkMode ? 0x111827 : 0xf0f9ff);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    // Create ground
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: darkMode ? 0x334155 : 0xdbeafe,
      side: THREE.DoubleSide,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -0.5;
    scene.add(floor);

    // Add grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x888888, 0x444444);
    gridHelper.position.y = -0.49;
    scene.add(gridHelper);

    // Create player (wallet)
    const walletGeometry = new THREE.BoxGeometry(1, 0.2, 1.5);
    const walletMaterial = new THREE.MeshStandardMaterial({
      color: 0x4338ca,
      roughness: 0.5,
    });
    const wallet = new THREE.Mesh(walletGeometry, walletMaterial);
    wallet.position.set(0, 0, 0);
    scene.add(wallet);
    playerRef.current = wallet;

    // Generate initial coins and obstacles
    generateCoins(scene);
    generateObstacles(scene);

    // Animation loop
    const animate = (time: number) => {
      if (
        !sceneRef.current ||
        !cameraRef.current ||
        !rendererRef.current ||
        !playerRef.current
      )
        return;

      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Move player
      if (playerRef.current) {
        const moveSpeed = 5;
        playerRef.current.position.x +=
          directionRef.current.x * moveSpeed * deltaTime;
        playerRef.current.position.z +=
          directionRef.current.z * moveSpeed * deltaTime;

        // Keep player in bounds
        playerRef.current.position.x = Math.max(
          -14,
          Math.min(14, playerRef.current.position.x)
        );
        playerRef.current.position.z = Math.max(
          -14,
          Math.min(14, playerRef.current.position.z)
        );

        // Camera follows player
        camera.position.x = playerRef.current.position.x;
        camera.position.z = playerRef.current.position.z + 10;
        camera.lookAt(playerRef.current.position);
      }

      // Check coin collisions
      checkCoinCollisions();

      // Check obstacle collisions
      checkObstacleCollisions();

      // Rotate coins
      coinsRef.current.forEach((coin) => {
        coin.rotation.y += 2 * deltaTime;
      });

      // Render
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    frameIdRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current)
        return;

      cameraRef.current.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      window.removeEventListener("resize", handleResize);
    };
  }, [gameStarted, gameEnded, darkMode]);

  // Generate coins (good financial decisions)
  const generateCoins = (scene: THREE.Scene) => {
    // Clear existing coins
    coinsRef.current.forEach((coin) => scene.remove(coin));
    coinsRef.current = [];

    // Create new coins
    const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: 0xfcd34d,
      metalness: 0.7,
      roughness: 0.3,
    });

    // Add 10 coins in random positions
    for (let i = 0; i < 10; i++) {
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      coin.rotation.x = Math.PI / 2;

      // Random position
      coin.position.set(
        (Math.random() - 0.5) * 25,
        0,
        (Math.random() - 0.5) * 25
      );

      scene.add(coin);
      coinsRef.current.push(coin);
    }
  };

  // Generate obstacles (bad financial decisions)
  const generateObstacles = (scene: THREE.Scene) => {
    // Clear existing obstacles
    obstaclesRef.current.forEach((obstacle) => scene.remove(obstacle));
    obstaclesRef.current = [];

    // Create new obstacles
    const obstacleGeometry = new THREE.SphereGeometry(0.7, 16, 16);
    const obstacleMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.7,
      metalness: 0.2,
    });

    // Add 5 obstacles in random positions
    for (let i = 0; i < 5; i++) {
      const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

      // Store the bad decision as a user data property
      obstacle.userData = {
        badDecision: BAD_DECISIONS[i % BAD_DECISIONS.length],
      };

      // Random position
      obstacle.position.set(
        (Math.random() - 0.5) * 25,
        0,
        (Math.random() - 0.5) * 25
      );

      scene.add(obstacle);
      obstaclesRef.current.push(obstacle);
    }
  };

  // Check for coin collisions
  const checkCoinCollisions = () => {
    if (!playerRef.current || !sceneRef.current) return;

    const playerPos = playerRef.current.position;
    const collisionDistance = 1.2;

    for (let i = coinsRef.current.length - 1; i >= 0; i--) {
      const coin = coinsRef.current[i];
      const coinPos = coin.position;

      const distance = Math.sqrt(
        Math.pow(playerPos.x - coinPos.x, 2) +
          Math.pow(playerPos.z - coinPos.z, 2)
      );

      if (distance < collisionDistance) {
        // Collect coin
        setScore((prev) => prev + 10);

        // Remove from scene
        sceneRef.current.remove(coin);
        coinsRef.current.splice(i, 1);

        // Show a random financial tip
        const tip =
          FINANCE_TIPS[Math.floor(Math.random() * FINANCE_TIPS.length)];
        setCurrentTip(tip);
        setShowTip(true);

        setTimeout(() => {
          setShowTip(false);
        }, 3000);

        // Create a new coin to replace the collected one
        if (sceneRef.current) {
          const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
          const coinMaterial = new THREE.MeshStandardMaterial({
            color: 0xfcd34d,
            metalness: 0.7,
            roughness: 0.3,
          });

          const newCoin = new THREE.Mesh(coinGeometry, coinMaterial);
          newCoin.rotation.x = Math.PI / 2;

          // Random position away from player
          let x, z;
          do {
            x = (Math.random() - 0.5) * 25;
            z = (Math.random() - 0.5) * 25;
          } while (
            Math.sqrt(
              Math.pow(playerPos.x - x, 2) + Math.pow(playerPos.z - z, 2)
            ) < 5
          );

          newCoin.position.set(x, 0, z);

          sceneRef.current.add(newCoin);
          coinsRef.current.push(newCoin);
        }
      }
    }
  };

  // Check for obstacle collisions
  const checkObstacleCollisions = () => {
    if (!playerRef.current || !sceneRef.current) return;

    const playerPos = playerRef.current.position;
    const collisionDistance = 1.3;

    for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
      const obstacle = obstaclesRef.current[i];
      const obstaclePos = obstacle.position;

      const distance = Math.sqrt(
        Math.pow(playerPos.x - obstaclePos.x, 2) +
          Math.pow(playerPos.z - obstaclePos.z, 2)
      );

      if (distance < collisionDistance) {
        // Penalty for hitting obstacle
        setScore((prev) => Math.max(0, prev - 5));

        // Show the bad decision message
        setObstacleHit(obstacle.userData.badDecision);
        setShowObstacleMessage(true);

        setTimeout(() => {
          setShowObstacleMessage(false);
        }, 3000);

        // Move obstacle to a new position
        if (sceneRef.current) {
          // Random position away from player
          let x, z;
          do {
            x = (Math.random() - 0.5) * 25;
            z = (Math.random() - 0.5) * 25;
          } while (
            Math.sqrt(
              Math.pow(playerPos.x - x, 2) + Math.pow(playerPos.z - z, 2)
            ) < 5
          );

          obstacle.position.set(x, 0, z);
        }
      }
    }
  };

  // Instructions for game controls
  const renderInstructions = () => (
    <div
      className={`mb-6 p-4 rounded-lg ${
        darkMode ? "bg-gray-800" : "bg-blue-50"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        How to Play
      </h3>
      <ul
        className={`list-disc pl-5 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <li>Use the arrow keys or WASD to move your wallet</li>
        <li>Collect gold coins (good financial decisions) to gain points</li>
        <li>Avoid red spheres (bad financial decisions) that cost points</li>
        <li>Learn financial tips as you play</li>
        <li>Collect as many points as possible before time runs out</li>
      </ul>
    </div>
  );

  // Render game UI
  return (
    <div className="flex flex-col w-full">
      {!gameStarted ? (
        <div
          className={`p-6 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Financial Decision Collector
          </h2>

          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Navigate your wallet through the financial world. Collect good
            financial decisions while avoiding poor ones. Learn financial tips
            and improve your money management knowledge!
          </p>

          {renderInstructions()}

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-all"
            >
              Start Game
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-lg ${
              darkMode ? "bg-gray-800/90" : "bg-white/90"
            } shadow-md backdrop-blur-sm flex items-center space-x-4`}
          >
            <div className="flex items-center">
              <DollarSign
                className={`h-5 w-5 mr-1 ${
                  darkMode ? "text-yellow-400" : "text-yellow-500"
                }`}
              />
              <span
                className={`font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {score}
              </span>
            </div>

            <div className="flex items-center">
              <TrendingUp
                className={`h-5 w-5 mr-1 ${
                  timeLeft > 10
                    ? darkMode
                      ? "text-green-400"
                      : "text-green-500"
                    : darkMode
                    ? "text-red-400"
                    : "text-red-500"
                }`}
              />
              <span
                className={`font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {timeLeft}s
              </span>
            </div>

            {highScore > 0 && (
              <div className="flex items-center">
                <Award
                  className={`h-5 w-5 mr-1 ${
                    darkMode ? "text-indigo-400" : "text-indigo-500"
                  }`}
                />
                <span
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {highScore}
                </span>
              </div>
            )}
          </div>

          {showTip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`absolute top-16 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 rounded-lg max-w-md ${
                darkMode ? "bg-green-900/90" : "bg-green-100/90"
              } shadow-md backdrop-blur-sm`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-green-300" : "text-green-800"
                }`}
              >
                <span className="font-bold">Financial Tip:</span> {currentTip}
              </p>
            </motion.div>
          )}

          {showObstacleMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`absolute top-16 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 rounded-lg max-w-md ${
                darkMode ? "bg-red-900/90" : "bg-red-100/90"
              } shadow-md backdrop-blur-sm flex items-start`}
            >
              <AlertCircle
                className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                  darkMode ? "text-red-300" : "text-red-800"
                }`}
              />
              <p
                className={`text-sm ${
                  darkMode ? "text-red-300" : "text-red-800"
                }`}
              >
                <span className="font-bold">Bad Financial Decision:</span>{" "}
                {obstacleHit}
              </p>
            </motion.div>
          )}

          <div className="w-full h-[500px]" ref={mountRef}></div>

          {gameEnded && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-6 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-xl max-w-md mx-auto text-center`}
              >
                <h2
                  className={`text-2xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Game Over!
                </h2>

                <p
                  className={`mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Your financial journey has come to an end.
                </p>

                <div className="mb-6">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Final Score:
                  </p>
                  <p
                    className={`text-4xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {score}
                  </p>

                  {score === highScore && score > 0 && (
                    <div
                      className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode
                          ? "bg-indigo-900/50 text-indigo-300"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      <Award className="h-3 w-3 mr-1" /> New High Score!
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-all"
                  >
                    Play Again
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGameStarted(false)}
                    className={`px-6 py-2 rounded-lg font-medium shadow-md ${
                      darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } transition-all`}
                  >
                    Main Menu
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoinCollectorGame;
