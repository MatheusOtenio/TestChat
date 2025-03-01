import { useState } from "react";
import styles from "./App.module.css";
import dados from "./data/data.json";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(
    "Bem-vindo! Pergunte algo sobre Matheus Otenio."
  );
  const [showChat, setShowChat] = useState(false); // Estado para controlar a exibição do chat

  async function sendMessage() {
    if (!input.trim()) {
      setResponse("Por favor, insira uma mensagem.");
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

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "HTTP-Referer":
            "https://test-chat-3zdc-git-main-matheusotenios-projects.vercel.app/",
          "X-Title": "WSP ChatBot",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [systemMessage, { role: "user", content: input }],
        }),
      });

      const resText = await res.text();
      try {
        const data = JSON.parse(resText);
        setResponse(data.choices?.[0]?.message?.content || "Sem resposta.");
      } catch (error) {
        console.error("Erro ao converter resposta:", resText);
        setResponse("Erro ao interpretar a resposta do servidor.");
      }
    } catch (error) {
      setResponse("Erro: " + error.message);
    }
  }

  return (
    <div className={styles.container}>
      <button
        onClick={() => setShowChat(!showChat)}
        className={styles.toggleButton}
      >
        Chat
      </button>

      {showChat && (
        <div className={styles.chatBox}>
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
      )}
    </div>
  );
}

export default App;
