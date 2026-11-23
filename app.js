// EC02 - Gestão de Funcionários: classes, DOM, funções anônimas e métodos de array.
class Funcionario {
  constructor(id, nome, idade, cargo, salario) {
    this.id = id;
    this.nome = nome;
    this.idade = idade;
    this.cargo = cargo;
    this.salario = salario;
  }

  getId() { return this.id; }
  getNome() { return this.nome; }
  getIdade() { return this.idade; }
  getCargo() { return this.cargo; }
  getSalario() { return this.salario; }

  setNome(nome) { this.nome = nome; }
  setIdade(idade) { this.idade = idade; }
  setCargo(cargo) { this.cargo = cargo; }
  setSalario(salario) { this.salario = salario; }

  toString() {
    return `${this.nome} (${this.idade} anos) - ${this.cargo} - ${formatarMoeda(this.salario)}`;
  }
}

const form = document.getElementById('formFuncionario');
const tabela = document.getElementById('tabelaFuncionarios');
const campoNome = document.getElementById('nome');
const campoIdade = document.getElementById('idade');
const campoCargo = document.getElementById('cargo');
const campoSalario = document.getElementById('salario');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const tituloFormulario = document.getElementById('tituloFormulario');
const formatarMoeda = valor => Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

let funcionarios = [];
let proximoId = 1;
let idEmEdicao = null;

try {
  const salvos = JSON.parse(localStorage.getItem('ec02_funcionarios') || '[]');
  if (Array.isArray(salvos)) {
    funcionarios = salvos.map(item => new Funcionario(item.id, item.nome, item.idade, item.cargo, item.salario));
    proximoId = funcionarios.reduce((maior, funcionario) => Math.max(maior, funcionario.getId()), 0) + 1;
  }
} catch (erro) {
  console.warn('Não foi possível carregar os dados salvos.', erro);
}

const salvarDados = () => localStorage.setItem('ec02_funcionarios', JSON.stringify(funcionarios));

function mostrarMensagem(texto, tipo = 'success') {
  const mensagem = document.getElementById('mensagem');
  mensagem.textContent = texto;
  mensagem.className = `alert alert-${tipo}`;
}

function criarCelula(linha, texto) {
  const celula = document.createElement('td');
  celula.textContent = texto;
  linha.appendChild(celula);
  return celula;
}

function preencherLista(id, itens) {
  const lista = document.getElementById(id);
  lista.replaceChildren();
  if (itens.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nenhum resultado.';
    lista.appendChild(li);
    return;
  }
  itens.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    lista.appendChild(li);
  });
}

function atualizarRelatorios() {
  // filter: somente funcionários com salário maior que R$ 5.000.
  const altosSalarios = funcionarios.filter(f => f.getSalario() > 5000);
  preencherLista('relatorioAltosSalarios', altosSalarios.map(f => f.toString()));

  // reduce: soma dos salários para calcular a média.
  const totalSalarios = funcionarios.reduce((total, f) => total + f.getSalario(), 0);
  const media = funcionarios.length ? totalSalarios / funcionarios.length : 0;
  document.getElementById('relatorioMedia').textContent = formatarMoeda(media);

  // map e Set: lista de cargos sem repetição (ignorando maiúsculas/minúsculas).
  const cargosPorChave = new Map();
  funcionarios.map(f => f.getCargo()).forEach(cargo => {
    const chave = cargo.toLocaleLowerCase('pt-BR');
    if (!cargosPorChave.has(chave)) cargosPorChave.set(chave, cargo);
  });
  const cargosUnicos = [...new Set(cargosPorChave.values())];
  preencherLista('relatorioCargos', cargosUnicos);

  // map: nomes em letras maiúsculas.
  preencherLista('relatorioNomes', funcionarios.map(f => f.getNome().toLocaleUpperCase('pt-BR')));
}

function cancelarEdicao() {
  idEmEdicao = null;
  form.reset();
  tituloFormulario.textContent = 'Cadastrar funcionário';
  btnSalvar.textContent = 'Cadastrar';
  btnCancelar.classList.add('d-none');
}

function editarFuncionario(id) {
  // Arrow function para buscar um funcionário pelo ID.
  const funcionario = funcionarios.find(f => f.getId() === id);
  if (!funcionario) return;
  idEmEdicao = id;
  campoNome.value = funcionario.getNome();
  campoIdade.value = funcionario.getIdade();
  campoCargo.value = funcionario.getCargo();
  campoSalario.value = funcionario.getSalario();
  tituloFormulario.textContent = 'Editar funcionário';
  btnSalvar.textContent = 'Salvar alterações';
  btnCancelar.classList.remove('d-none');
  campoNome.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function excluirFuncionario(id) {
  const funcionario = funcionarios.find(f => f.getId() === id);
  if (!funcionario || !window.confirm(`Excluir ${funcionario.getNome()}?`)) return;
  // Arrow function para remover um funcionário do array.
  funcionarios = funcionarios.filter(f => f.getId() !== id);
  if (idEmEdicao === id) cancelarEdicao();
  salvarDados();
  atualizarTela();
  mostrarMensagem('Funcionário excluído com sucesso.');
}

function atualizarTela() {
  tabela.replaceChildren();
  funcionarios.forEach(funcionario => {
    const linha = document.createElement('tr');
    criarCelula(linha, funcionario.getId());
    criarCelula(linha, funcionario.getNome());
    criarCelula(linha, funcionario.getIdade());
    criarCelula(linha, funcionario.getCargo());
    criarCelula(linha, formatarMoeda(funcionario.getSalario()));
    const acoes = document.createElement('td');
    acoes.className = 'text-nowrap';
    const editar = document.createElement('button');
    editar.type = 'button';
    editar.className = 'btn btn-sm btn-outline-primary me-2';
    editar.textContent = 'Editar';
    // Função anônima tradicional no evento onclick.
    editar.onclick = function () { editarFuncionario(funcionario.getId()); };
    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.className = 'btn btn-sm btn-outline-danger';
    excluir.textContent = 'Excluir';
    // Mesmo evento, agora com arrow function (lambda).
    excluir.onclick = () => excluirFuncionario(funcionario.getId());
    acoes.append(editar, excluir);
    linha.appendChild(acoes);
    tabela.appendChild(linha);
  });
  if (funcionarios.length === 0) {
    const linha = document.createElement('tr');
    const celula = document.createElement('td');
    celula.colSpan = 6;
    celula.className = 'text-center text-muted py-4';
    celula.textContent = 'Nenhum funcionário cadastrado.';
    linha.appendChild(celula);
    tabela.appendChild(linha);
  }
  document.getElementById('contador').textContent = `${funcionarios.length} funcionário(s)`;
  atualizarRelatorios();
}

// Cadastro e atualização usando uma função anônima no evento do formulário.
form.onsubmit = function (evento) {
  evento.preventDefault();
  const nome = campoNome.value.trim();
  const idade = Number(campoIdade.value);
  const cargo = campoCargo.value.trim();
  const salario = Number(campoSalario.value);
  if (!nome || !cargo || !Number.isInteger(idade) || idade < 16 || idade > 120 || !Number.isFinite(salario) || salario <= 0) {
    mostrarMensagem('Preencha todos os campos com valores válidos.', 'danger');
    return;
  }
  if (idEmEdicao === null) {
    funcionarios.push(new Funcionario(proximoId++, nome, idade, cargo, salario));
    mostrarMensagem('Funcionário cadastrado com sucesso.');
  } else {
    //Arrow function para buscar e atualizar usando setters da classe.
    const funcionario = funcionarios.find(f => f.getId() === idEmEdicao);
    if (!funcionario) {
      mostrarMensagem('Funcionário não encontrado.', 'danger');
      cancelarEdicao();
      return;
    }
    funcionario.setNome(nome);
    funcionario.setIdade(idade);
    funcionario.setCargo(cargo);
    funcionario.setSalario(salario);
    mostrarMensagem('Funcionário atualizado com sucesso.');
  }
  cancelarEdicao();
  salvarDados();
  atualizarTela();
};

btnCancelar.onclick = () => cancelarEdicao();
atualizarTela();
