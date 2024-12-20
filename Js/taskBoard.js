<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Criar Coluna</title>
  <link rel="stylesheet" href="/styles/global.css">
  <script type="module" src="/scripts/pages/taskBoard.js"></script>
</head>
<body>
  <div id="email-display"></div>
  <button id="logout-btn">Logout</button>

  <!-- Botão Dropdown -->
  <div class="dropdown">
    <button id="dropdown-btn">Clique</button>
    <ul id="dropdown-content"></ul>
  </div>

  <!-- Container para as colunas -->
  <div id="column-container"></div>

  <div class="form-container">
    <h2>Criar Coluna</h2>
    <div id="createColumnForm">
        <label for="boardId">Board ID</label>
        <input type="number" id="boardId" name="boardId" value="1" required>

        <label for="name">Nome da Coluna</label>
        <input type="text" id="name" name="name" placeholder="Nome da coluna" required>

        <label for="position">Posição</label>
        <input type="number" id="position" name="position" value="0" required>

        <label for="isActive">Ativo</label>
        <input type="checkbox" id="isActive" name="isActive" checked>

        <button type="button" id="createColumnBtn">Criar Coluna</button>
    </div>
    
    <div class="message" id="responseMessage"></div>
  </div>

</body>
</html>
