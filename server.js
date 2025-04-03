const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Конфигурация
const PORT = 3000;
const WORLD_SIZE = 5000;

// Состояние игры
const gameState = {
  players: {},
  stars: {},
  leaderboard: {}
};

// Генерация случайных звезд
function generateStars(count) {
  const stars = {};
  for (let i = 0; i < count; i++) {
    const id = `star_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    stars[id] = {
      x: Math.random() * WORLD_SIZE,
      y: Math.random() * WORLD_SIZE,
      id
    };
  }
  return stars;
}

// Обновление таблицы лидеров
function updateLeaderboard() {
  const players = Object.values(gameState.players);
  players.sort((a, b) => b.score - a.score);
  gameState.leaderboard = players.slice(0, 3);
}

// Инициализация звезд
gameState.stars = generateStars(15);

wss.on('connection', (ws) => {
  let playerId = null;

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch (data.type) {
      case 'join':
        // Новый игрок присоединился
        playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        gameState.players[playerId] = {
          id: playerId,
          x: 1500,
          y: 1500,
          speedX: 0,
          speedY: 0,
          color: data.color,
          name: data.name,
          score: 0
        };
        
        // Отправляем текущее состояние игры новому игроку
        ws.send(JSON.stringify({
          type: 'init',
          playerId,
          worldSize: WORLD_SIZE,
          players: gameState.players,
          stars: gameState.stars,
          leaderboard: gameState.leaderboard
        }));
        
        // Оповещаем всех о новом игроке
        broadcast({
          type: 'playerJoined',
          player: gameState.players[playerId]
        });
        break;
        
      case 'update':
        // Обновление состояния игрока
        if (playerId && gameState.players[playerId]) {
          gameState.players[playerId].x = data.x;
          gameState.players[playerId].y = data.y;
          gameState.players[playerId].speedX = data.speedX;
          gameState.players[playerId].speedY = data.speedY;
          
          // Рассылаем обновление другим игрокам
          broadcast({
            type: 'playerUpdated',
            playerId,
            x: data.x,
            y: data.y,
            speedX: data.speedX,
            speedY: data.speedY
          });
        }
        break;
        
      case 'collectStar':
        // Игрок собрал звезду
        if (playerId && gameState.players[playerId] && gameState.stars[data.starId]) {
          // Увеличиваем счет
          gameState.players[playerId].score += 1;
          
          // Удаляем звезду и создаем новую
          delete gameState.stars[data.starId];
          const newStar = generateStars(1);
          const newStarId = Object.keys(newStar)[0];
          gameState.stars[newStarId] = newStar[newStarId];
          
          // Обновляем таблицу лидеров
          updateLeaderboard();
          
          // Рассылаем обновления
          broadcast({
            type: 'starCollected',
            playerId,
            starId: data.starId,
            newStar: gameState.stars[newStarId],
            leaderboard: gameState.leaderboard
          });
        }
        break;
        
      case 'collision':
        // Обработка столкновений между игроками
        if (playerId && gameState.players[playerId] && data.otherPlayerId && gameState.players[data.otherPlayerId]) {
          // Обновляем состояние обоих игроков
          gameState.players[playerId].speedX = data.mySpeedX;
          gameState.players[playerId].speedY = data.mySpeedY;
          gameState.players[data.otherPlayerId].speedX = data.otherSpeedX;
          gameState.players[data.otherPlayerId].speedY = data.otherSpeedY;
          
          // Рассылаем обновления
          broadcast({
            type: 'playersCollided',
            player1: {
              id: playerId,
              speedX: data.mySpeedX,
              speedY: data.mySpeedY
            },
            player2: {
              id: data.otherPlayerId,
              speedX: data.otherSpeedX,
              speedY: data.otherSpeedY
            }
          });
        }
        break;
    }
  });
  
  ws.on('close', () => {
    // Игрок отключился
    if (playerId && gameState.players[playerId]) {
      delete gameState.players[playerId];
      updateLeaderboard();
      broadcast({
        type: 'playerLeft',
        playerId,
        leaderboard: gameState.leaderboard
      });
    }
  });
  
  function broadcast(message) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
});

// Раздача статики (клиентская часть)
app.use(express.static(path.join(__dirname, 'Client')));

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});