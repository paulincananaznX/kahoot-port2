import { Question } from '../types';

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Quem é o autor do poema 'À hora de pôr a mesa, éramos cinco'?",
    timeLimit: 20,
    options: [
      { id: 'a', text: "José Saramago", isCorrect: false },
      { id: 'b', text: "Fernando Pessoa", isCorrect: false },
      { id: 'c', text: "José Luís Peixoto", isCorrect: true },
      { id: 'd', text: "Luís de Camões", isCorrect: false }
    ]
  },
  {
    id: 2,
    question: "Onde nasceu o autor José Luís Peixoto?",
    timeLimit: 20,
    options: [
      { id: 'a', text: "Lisboa", isCorrect: false },
      { id: 'b', text: "Galveias", isCorrect: true },
      { id: 'c', text: "Porto", isCorrect: false },
      { id: 'd', text: "Coimbra", isCorrect: false }
    ]
  },
  {
    id: 3,
    question: "Qual é o tema principal da obra 'A Criança em Ruínas'?",
    timeLimit: 20,
    options: [
      { id: 'a', text: "A Guerra Colonial", isCorrect: false },
      { id: 'b', text: "A revolução industrial", isCorrect: false },
      { id: 'c', text: "A política moderna", isCorrect: false },
      { id: 'd', text: "A nostalgia", isCorrect: true }
    ]
  },
  {
    id: 4,
    question: "Quanto à estrutura externa, quantos versos tem o poema?",
    timeLimit: 15,
    options: [
      { id: 'a', text: "15 Versos", isCorrect: true },
      { id: 'b', text: "10 Versos", isCorrect: false },
      { id: 'c', text: "20 Versos", isCorrect: false },
      { id: 'd', text: "12 Versos", isCorrect: false }
    ]
  },
  {
    id: 5,
    question: "Quais são os principais recursos expressivos utilizados no poema?",
    timeLimit: 30,
    options: [
      { id: 'a', text: "Metáfora e Hipérbole", isCorrect: false },
      { id: 'b', text: "Enumeração e Anáfora", isCorrect: true },
      { id: 'c', text: "Ironia e Sarcasmo", isCorrect: false },
      { id: 'd', text: "Personificação e Aliteração", isCorrect: false }
    ]
  },
  {
    id: 6,
    question: "Qual prémio literário ganhou José Luís Peixoto em 2001?",
    timeLimit: 20,
    options: [
      { id: 'a', text: "Prémio Camões", isCorrect: false },
      { id: 'b', text: "Prémio Nobel", isCorrect: false },
      { id: 'c', text: "Prémio José Saramago", isCorrect: true },
      { id: 'd', text: "Prémio Pessoa", isCorrect: false }
    ]
  },
  {
    id: 7,
    question: "Qual elemento do poema simboliza a união familiar, mesmo perante a ausência?",
    timeLimit: 20,
    options: [
      { id: 'a', text: "A Mesa", isCorrect: true },
      { id: 'b', text: "A Janela", isCorrect: false },
      { id: 'c', text: "O Relógio", isCorrect: false },
      { id: 'd', text: "A Porta", isCorrect: false }
    ]
  },
  {
    id: 8,
    question: "Na estrutura interna, o que representa a mudança de 'éramos cinco' para 'somos cinco'?",
    timeLimit: 30,
    options: [
      { id: 'a', text: "A chegada de novos filhos", isCorrect: false },
      { id: 'b', text: "A permanência da memória apesar da morte", isCorrect: true },
      { id: 'c', text: "Um erro de contagem", isCorrect: false },
      { id: 'd', text: "A visita de vizinhos", isCorrect: false }
    ]
  },
  {
    id: 9,
    question: "Que recurso expressivo é evidente no verso 'éramos cinco, somos cinco'?",
    timeLimit: 20,
    options: [
      { id: 'a', text: "Antítese", isCorrect: true },
      { id: 'b', text: "Anáfora", isCorrect: false },
      { id: 'c', text: "Metáfora", isCorrect: false },
      { id: 'd', text: "Personificação", isCorrect: false }
    ]
  },
  {
    id: 10,
    question: "A quem é dirigido o poema quando o sujeito diz 'o teu lugar'?",
    timeLimit: 20,
    options: [
      { id: 'a', text: "Ao pai falecido", isCorrect: true },
      { id: 'b', text: "À mãe", isCorrect: false },
      { id: 'c', text: "A um irmão ausente", isCorrect: false },
      { id: 'd', text: "Ao próprio poeta", isCorrect: false }
    ]
  },
  {
    id: 11,
    question: "Qual é o tom emocional predominante no poema?",
    timeLimit: 20,
    options: [
      { id: 'a', text: "Melancolia e Saudade", isCorrect: true },
      { id: 'b', text: "Alegria e Euforia", isCorrect: false },
      { id: 'c', text: "Raiva e Revolta", isCorrect: false },
      { id: 'd', text: "Indiferença e Frieza", isCorrect: false }
    ]
  }
];