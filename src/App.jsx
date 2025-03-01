import { useState, useEffect } from "react";
import styles from "./App.module.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(
    "Bem-vindo! Pergunte algo sobre Matheus Otenio."
  );
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const res = await fetch("/src/data/data.json");
        const data = await res.json();
        setDados(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    carregarDados();
  }, []);

  async function sendMessage() {
    if (!input.trim()) {
      setResponse("Por favor, insira uma mensagem.");
      return;
    }

    if (!dados) {
      setResponse("Erro ao carregar informações.");
      return;
    }

    setResponse("Carregando...");

    try {
      const systemMessage = {
        role: "system",
        content: `Você é um chatbot especializado em responder apenas sobre ${
          dados.nome
        }. 
                  ${dados.nome} tem ${dados.idade} anos e é ${
          dados.cargo
        }, com habilidades em ${dados.habilidades.join(", ")}. 
                  Ele possui certificações como ${dados.certificacoes.join(
                    ", "
                  )}. 
                  Ele fala japonês (${dados.idiomas.japones}) e inglês (${
          dados.idiomas.ingles
        }). 
                  Responda apenas perguntas sobre ele e suas habilidades. Se a pergunta for fora desse contexto, responda 'Não posso responder essa pergunta.'.`,
      };

      const res = await fetch("http://localhost:5173", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "HTTP-Referer":
            "https://test-chat-dq8lowgbg-matheusotenios-projects.vercel.app",
          "X-Title": "WSP ChatBot",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [systemMessage, { role: "user", content: input }],
        }),
      });

      const data = await res.json();
      setResponse(data.choices?.[0]?.message?.content || "Sem resposta.");
    } catch (error) {
      setResponse("Erro: " + error.message);
    }
  }

  return (
    <div className={styles.container}>
      <h2>Chatbot - Matheus Otenio</h2>
      <div className={styles.chatContainer}>
        <div className={styles.response}>{response}</div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta..."
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.button}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;
