import { API_BASE_URL } from "../../config/apiConfig.js";

const dropdownButton = document.getElementById('dropdown-btn');
const dropdownContent = document.getElementById('dropdown-content');
const columnContainer = document.getElementById('column-container');
const createColumnBtn = document.getElementById('createColumnBtn');
const responseMessage = document.getElementById('responseMessage');

dropdownButton.addEventListener('click', async () => {
  const isVisible = dropdownContent.style.display === 'block';
  if (!isVisible) {
      await preencherDropdown(); // Carrega os boards
  }
  dropdownContent.style.display = isVisible ? 'none' : 'block';
});

// Fecha dropdown ao clicar fora
window.addEventListener('click', (event) => {
  if (!event.target.closest('#dropdown-btn') && !event.target.closest('#dropdown-content')) {
      dropdownContent.style.display = 'none';
  }
});

// Função para buscar boards da API e preencher o dropdown
async function preencherDropdown() {
  dropdownContent.innerHTML = '';
  try {
    const response = await fetch(`${API_BASE_URL}/Boards`); // Uso correto de template string
    if (!response.ok) {
        console.error("Erro ao buscar boards.");
        return;
    }
    const boards = await response.json();
    boards.forEach((board) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="#" id="${board.Id}">${board.Name}</a>`; // Uso correto de template string para HTML
        listItem.addEventListener('click', (event) => {
            event.preventDefault();
            dropdownContent.style.display = 'none';
            buscarColunas(board.Id);
            marcarBoardSelecionado(event.target);
        });
        dropdownContent.appendChild(listItem);
    });
    dropdownContent.style.maxHeight = '200px';
    dropdownContent.style.overflowY = 'auto';
  } catch (error) {
    console.error("Erro ao conectar com a API:", error);
  }
}

// Função para buscar colunas com base no boardId
async function buscarColunas(boardId) {
  columnContainer.innerHTML = ''; // Limpa o container antes de adicionar novas colunas
  try {
    const response = await fetch(`${API_BASE_URL}/ColumnByBoardId?BoardId=${boardId}`);
    
    // Verifica se a resposta da API é ok
    if (!response.ok) {
        console.error("Erro ao buscar colunas.");
        return;
    }
    
    // Recebe as colunas da API
    const colunas = await response.json();
    
    // Verifica se as colunas foram retornadas corretamente
    console.log('Colunas recebidas:', colunas); // Verifique se as colunas estão vindo como um array
    
    // Certifique-se de que `colunas` é um array antes de iterar
    if (Array.isArray(colunas) && colunas.length > 0) {
        // Loop para criar e adicionar colunas no DOM
        colunas.forEach((coluna) => {
            const columnElement = document.createElement('div');
            columnElement.className = 'column';
            columnElement.dataset.columnId = coluna.Id;

            // Adiciona o conteúdo da coluna (Nome e lista de tarefas)
            columnElement.innerHTML = `
                <h3>${coluna.Name}</h3>
                <ul class="tasks-container"></ul>
                <button class="delete-column-btn">Excluir Coluna</button>
            `;
            
            // Adiciona a coluna ao container
            columnContainer.appendChild(columnElement);

            // Chama a função para buscar as tarefas da coluna
            buscarTasks(coluna.Id); 

            // Adiciona funcionalidade de exclusão da coluna
            const deleteButton = columnElement.querySelector('.delete-column-btn');
            deleteButton.addEventListener('click', () => excluirColuna(coluna.Id, columnElement));
        });

        console.log(`Foram adicionadas ${colunas.length} colunas.`);
    } else {
        console.error("Não foi possível encontrar colunas ou a resposta não é um array.");
    }
  } catch (error) {
    console.error("Erro ao conectar com a API:", error);
  }
}

// Função para buscar tarefas de uma coluna
async function buscarTasks(columnId) {
    try {
        const response = await fetch(`${API_BASE_URL}/TasksByColumnId?ColumnId=${columnId}`);
        if (!response.ok) {
            console.error("Erro ao buscar tasks.");
            return;
        }
        const tasks = await response.json();
        const columnElement = document.querySelector(`.column[data-column-id="${columnId}"]`);
        if (columnElement) {
            const tasksContainer = columnElement.querySelector('.tasks-container');
            tasks.forEach(task => {
                const taskElement = document.createElement('li');
                taskElement.className = 'task';
                taskElement.innerHTML = `<span>${task.Title}</span>`;
                tasksContainer.appendChild(taskElement);
            });
        }
    } catch (error) {
        console.error("Erro ao conectar com a API para buscar tasks:", error);
    }
}

// Função para criar uma nova coluna
createColumnBtn.addEventListener('click', function (event) {
  event.preventDefault();

  // Coletar dados do formulário
  const boardId = document.getElementById('boardId').value;
  const name = document.getElementById('name').value;
  const position = document.getElementById('position').value;
  const isActive = document.getElementById('isActive').checked;

  const columnData = {
    BoardId: boardId,
    Name: name,
    Position: position,
    IsActive: isActive
  };

  // Chamar a função para criar a nova coluna
  createColumn(columnData);
});

// Função para enviar a criação da coluna para a API
async function createColumn(columnData) {
    try {
      const response = await fetch('https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Column', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(columnData) // Enviando a coluna diretamente
      });
  
      const responseData = await response.json();
      
      if (response.status === 200) {
        // Sucesso
        responseMessage.textContent = "Coluna criada com sucesso!";
        responseMessage.classList.add('success');
      } else {
        // Caso de erro
        const errorMessage = responseData.message || "Erro ao criar coluna.";
        responseMessage.textContent = errorMessage;
        responseMessage.classList.add('error');
      }
    } catch (error) {
      // Captura de exceções
      console.error("Erro ao conectar com a API:", error);
      responseMessage.textContent = "Erro ao criar coluna.";
      responseMessage.classList.add('error');
    }
}

// Função para excluir uma coluna
async function excluirColuna(columnId, columnElement) {
    try {
        const response = await fetch(`${API_BASE_URL}/TaskBoard/Column?ColumnId=${columnId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error('Erro ao excluir a coluna');
            return;
        }

        // Remove a coluna do DOM
        columnContainer.removeChild(columnElement);

        // Exibe uma mensagem de sucesso
        responseMessage.textContent = 'Coluna excluída com sucesso!';
        responseMessage.classList.add('success');
    } catch (error) {
        console.error('Erro ao excluir a coluna:', error);
        responseMessage.textContent = 'Erro ao excluir coluna.';
        responseMessage.classList.add('error');
    }
}

const user = JSON.parse(localStorage.getItem("user"));

document.addEventListener('DOMContentLoaded', () => {
  if (user && user.email) {
    document.getElementById('email-display').innerText = ` ${user.email}`;
  } else {
    document.getElementById('email-display').innerText = "Email não encontrado.";
  }
});

const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', function () {
    // Remover o token ou dados de autenticação, se existirem
    localStorage.removeItem('authToken');  // Exemplo com localStorage, substitua pelo nome real do seu token
    sessionStorage.removeItem('authToken');  // Caso use sessionStorage

    // Redirecionar para a página de login (substitua pelo URL de sua página de login)
    window.location.href = 'index.html';  // Redireciona para a página de login
});


