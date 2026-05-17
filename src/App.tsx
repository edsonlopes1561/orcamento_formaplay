import React, { useEffect, useMemo, useState } from "react";

type Orcamento = {
  id: number;
  numero: string;
  cliente: string;
  telefone: string;
  cidade: string;
  email: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
  frete: number;
  desconto: number;
  subtotal: number;
  total: number;
  prazoEntrega: string;
  validade: string;
  pagamento: string;
  observacoes: string;
  data: string;
};

type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  cidade: string;
  email: string;
};

const produtos = [
  { nome: "Desafio Logístico", valor: 290 },
  { nome: "Desafio Kids", valor: 190 },
  { nome: "Edição Professor", valor: 390 },
];

export default function App() {
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [email, setEmail] = useState("");

  const [clientesSalvos, setClientesSalvos] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");

  const [produto, setProduto] = useState("Desafio Logístico");
  const [quantidade, setQuantidade] = useState(3);
  const [valorUnitario, setValorUnitario] = useState(290);
  const [frete, setFrete] = useState(30);
  const [desconto, setDesconto] = useState(0);

  const [prazoEntrega, setPrazoEntrega] = useState("A combinar");
  const [validade, setValidade] = useState("7 dias");
  const [pagamento, setPagamento] = useState("PIX ou transferência bancária");
  const [observacoes, setObservacoes] = useState("Orçamento comercial sem valor fiscal.");

  const [numeroAtual, setNumeroAtual] = useState("0001");
  const [proximoNumero, setProximoNumero] = useState("0001");
  const [historico, setHistorico] = useState<Orcamento[]>([]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("formaplay_orcamentos");
    const numeroSalvo = localStorage.getItem("formaplay_numero_atual");
    const clientes = localStorage.getItem("formaplay_clientes");

    if (dadosSalvos) setHistorico(JSON.parse(dadosSalvos));
    if (clientes) setClientesSalvos(JSON.parse(clientes));

    if (numeroSalvo) {
      setNumeroAtual(numeroSalvo);
      setProximoNumero(numeroSalvo);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formaplay_orcamentos", JSON.stringify(historico));
  }, [historico]);

  useEffect(() => {
    localStorage.setItem("formaplay_clientes", JSON.stringify(clientesSalvos));
  }, [clientesSalvos]);

  useEffect(() => {
    localStorage.setItem("formaplay_numero_atual", proximoNumero);
  }, [proximoNumero]);

  const subtotal = useMemo(() => quantidade * valorUnitario, [quantidade, valorUnitario]);
  const total = useMemo(() => subtotal + frete - desconto, [subtotal, frete, desconto]);

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function escolherProduto(nome: string) {
    const item = produtos.find((p) => p.nome === nome);
    if (item) {
      setProduto(item.nome);
      setValorUnitario(item.valor);
    }
  }

  function salvarCliente() {
    if (!cliente.trim()) {
      alert("Digite o nome do cliente antes de salvar.");
      return;
    }

    const novoCliente: Cliente = {
      id: Date.now(),
      nome: cliente,
      telefone,
      cidade,
      email,
    };

    setClientesSalvos([novoCliente, ...clientesSalvos]);
    alert("Cliente salvo com sucesso!");
  }

  function selecionarCliente(id: string) {
    setClienteSelecionado(id);

    const encontrado = clientesSalvos.find((c) => String(c.id) === id);

    if (encontrado) {
      setCliente(encontrado.nome);
      setTelefone(encontrado.telefone);
      setCidade(encontrado.cidade);
      setEmail(encontrado.email);
    }
  }

  function excluirCliente(id: number) {
    if (confirm("Deseja excluir este cliente?")) {
      setClientesSalvos(clientesSalvos.filter((c) => c.id !== id));
    }
  }

  function imprimir() {
    window.print();
  }

  function enviarWhatsApp() {
    const mensagem =
      `Olá! Segue o orçamento FormaPlay:%0A%0A` +
      `Orçamento Nº ${numeroAtual}%0A` +
      `Cliente: ${cliente || "Não informado"}%0A` +
      `Telefone: ${telefone || "Não informado"}%0A` +
      `Cidade/UF: ${cidade || "Não informado"}%0A` +
      `E-mail: ${email || "Não informado"}%0A` +
      `Produto: ${produto}%0A` +
      `Quantidade: ${quantidade}%0A` +
      `Valor unitário: ${moeda(valorUnitario)}%0A` +
      `Subtotal: ${moeda(subtotal)}%0A` +
      `Frete: ${moeda(frete)}%0A` +
      `Desconto: ${moeda(desconto)}%0A` +
      `Total final: ${moeda(total)}%0A%0A` +
      `Prazo de entrega: ${prazoEntrega}%0A` +
      `Validade: ${validade}%0A` +
      `Pagamento: ${pagamento}%0A` +
      `Observações: ${observacoes}`;

    window.open(`https://wa.me/?text=${mensagem}`, "_blank");
  }

  function salvarOrcamento() {
    const novo: Orcamento = {
      id: Date.now(),
      numero: numeroAtual,
      cliente: cliente || "Cliente não informado",
      telefone: telefone || "Não informado",
      cidade: cidade || "Não informado",
      email: email || "Não informado",
      produto,
      quantidade,
      valorUnitario,
      frete,
      desconto,
      subtotal,
      total,
      prazoEntrega,
      validade,
      pagamento,
      observacoes,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    setHistorico([novo, ...historico]);

    const novoProximo = String(Number(proximoNumero) + 1).padStart(4, "0");
    setProximoNumero(novoProximo);
    setNumeroAtual(novoProximo);

    alert("Orçamento salvo com sucesso!");
  }

  function novoOrcamento() {
    setCliente("");
    setTelefone("");
    setCidade("");
    setEmail("");
    setClienteSelecionado("");
    setProduto("Desafio Logístico");
    setQuantidade(3);
    setValorUnitario(290);
    setFrete(30);
    setDesconto(0);
    setPrazoEntrega("A combinar");
    setValidade("7 dias");
    setPagamento("PIX ou transferência bancária");
    setObservacoes("Orçamento comercial sem valor fiscal.");
    setNumeroAtual(proximoNumero);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function carregarOrcamento(item: Orcamento) {
    setCliente(item.cliente);
    setTelefone(item.telefone);
    setCidade(item.cidade);
    setEmail(item.email);
    setProduto(item.produto);
    setQuantidade(item.quantidade);
    setValorUnitario(item.valorUnitario);
    setFrete(item.frete);
    setDesconto(item.desconto);
    setPrazoEntrega(item.prazoEntrega);
    setValidade(item.validade);
    setPagamento(item.pagamento);
    setObservacoes(item.observacoes);
    setNumeroAtual(item.numero);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function excluirOrcamento(id: number) {
    if (confirm("Deseja excluir este orçamento?")) {
      setHistorico(historico.filter((item) => item.id !== id));
    }
  }

  function limparHistorico() {
    if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
      setHistorico([]);
      setNumeroAtual("0001");
      setProximoNumero("0001");
      localStorage.removeItem("formaplay_orcamentos");
      localStorage.removeItem("formaplay_numero_atual");
    }
  }

  return (
    <div style={page}>
      <style>
        {`
          @page {
            size: A4;
            margin: 0;
          }

          @media print {
            html, body, #root {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              overflow: hidden !important;
              background: white !important;
            }

            * {
              box-sizing: border-box !important;
            }

            .no-print {
              display: none !important;
              height: 0 !important;
              overflow: hidden !important;
            }

            .app-box {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              max-width: 210mm !important;
              max-height: 297mm !important;
              overflow: hidden !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              background: white !important;
            }

            .print-area {
              display: block !important;
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 12mm !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              background: white !important;
            }
          }
        `}
      </style>

      <div style={appBox} className="app-box">
        <div className="no-print">
        <header
  style={{
    background: "linear-gradient(135deg,#00143a,#003b9a)",
    padding: "28px 20px",
    borderRadius: "0 0 26px 26px",
    boxShadow: "0 8px 25px rgba(0,0,0,.25)",
    marginBottom: 18,
  }}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    <div
      style={{
        background: "rgba(255,255,255,.04)",
        border: "3px solid rgba(80,150,255,.55)",
        borderRadius: 28,
        padding: "18px 36px",
        boxShadow: "0 0 25px rgba(0,140,255,.35)",
        marginBottom: 18,
        width: "fit-content",
      }}
    >
      <img
        src="/logo.png"
        alt="FormaPlay"
        style={{
          width: "clamp(180px, 42vw, 420px)",
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>

    <div
      style={{
        display: "flex",
        gap: 26,
        flexWrap: "wrap",
        justifyContent: "center",
        color: "white",
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      <span>🧾 Orçamento</span>
      <span>👥 Clientes</span>
      <span>📦 Produtos</span>
      <span>🚚 Frete</span>
      <span>📊 Relatórios</span>
    </div>
  </div>
</header>

          <section style={hero}>
            <h2 style={{ margin: 0 }}>FORMA PLAY</h2>
            <p>APRENDER • JOGAR • EVOLUIR</p>

            <div style={icones}>
              <div style={cardIcone}>📋<br />Cotar</div>
              <div style={cardIcone}>👥<br />Clientes</div>
              <div style={cardIcone}>🚚<br />Orçar</div>
              <div style={cardIcone}>📈<br />Analisar</div>
            </div>
          </section>

          <main style={conteudo}>
            <section style={card}>
              <h2>Dados do cliente</h2>

              <label style={label}>Selecionar cliente salvo</label>
              <select value={clienteSelecionado} onChange={(e) => selecionarCliente(e.target.value)} style={input}>
                <option value="">Novo cliente / Digitar manualmente</option>
                {clientesSalvos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} - {c.cidade}
                  </option>
                ))}
              </select>

              <label style={label}>Cliente</label>
              <input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do cliente" style={input} />

              <label style={label}>Telefone</label>
              <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(14) 99999-9999" style={input} />

              <label style={label}>Cidade / UF</label>
              <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Jaú / SP" style={input} />

              <label style={label}>E-mail</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.com" style={input} />

              <button style={botaoRoxo} onClick={salvarCliente}>
                Salvar cliente
              </button>
            </section>

            <section style={card}>
              <h2>Produto</h2>

              <label style={label}>Produto</label>
              <select value={produto} onChange={(e) => escolherProduto(e.target.value)} style={input}>
                {produtos.map((item) => (
                  <option key={item.nome} value={item.nome}>
                    {item.nome} - {moeda(item.valor)}
                  </option>
                ))}
              </select>

              <div style={duasColunas}>
                <div>
                  <label style={label}>Quantidade</label>
                  <input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} style={input} />
                </div>

                <div>
                  <label style={label}>Valor unitário</label>
                  <input type="number" value={valorUnitario} onChange={(e) => setValorUnitario(Number(e.target.value))} style={input} />
                </div>
              </div>

              <div style={duasColunas}>
                <div>
                  <label style={label}>Frete</label>
                  <input type="number" value={frete} onChange={(e) => setFrete(Number(e.target.value))} style={input} />
                </div>

                <div>
                  <label style={label}>Desconto</label>
                  <input type="number" value={desconto} onChange={(e) => setDesconto(Number(e.target.value))} style={input} />
                </div>
              </div>
            </section>

            <section style={card}>
              <h2>Condições comerciais</h2>

              <label style={label}>Prazo de entrega</label>
              <input value={prazoEntrega} onChange={(e) => setPrazoEntrega(e.target.value)} style={input} />

              <label style={label}>Validade do orçamento</label>
              <input value={validade} onChange={(e) => setValidade(e.target.value)} style={input} />

              <label style={label}>Forma de pagamento</label>
              <input value={pagamento} onChange={(e) => setPagamento(e.target.value)} style={input} />

              <label style={label}>Observações</label>
              <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} style={textarea} />
            </section>

            <section style={card}>
              <h2>Resumo financeiro</h2>

              <Linha nome="Subtotal" valor={moeda(subtotal)} />
              <Linha nome="Frete" valor={moeda(frete)} />
              <Linha nome="Desconto" valor={moeda(desconto)} />

              <div style={totalBox}>
                <span>Total final</span>
                <strong>{moeda(total)}</strong>
              </div>

              <button style={botaoCinza} onClick={novoOrcamento}>Novo orçamento</button>
              <button style={botaoLaranja} onClick={salvarOrcamento}>Salvar orçamento</button>
              <button style={botaoAzul} onClick={imprimir}>Gerar PDF / Imprimir</button>
              <button style={botaoVerde} onClick={enviarWhatsApp}>Enviar por WhatsApp</button>
            </section>
          </main>

          <section style={clientesBox}>
            <h2>Clientes salvos</h2>

            {clientesSalvos.length === 0 ? (
              <p style={{ color: "#666" }}>Nenhum cliente salvo ainda.</p>
            ) : (
              clientesSalvos.map((c) => (
                <div key={c.id} style={clienteItem}>
                  <div>
                    <strong>{c.nome}</strong>
                    <p style={{ margin: "4px 0" }}>{c.telefone}</p>
                    <small>{c.cidade} • {c.email}</small>
                  </div>

                  <button style={botaoPequenoVermelho} onClick={() => excluirCliente(c.id)}>
                    Excluir
                  </button>
                </div>
              ))
            )}
          </section>
        </div>

        <section style={orcamentoPrint} className="print-area">
          <div style={orcHeaderPrint}>
            <div>
              <h2 style={{ margin: 0, color: "#0047ab", fontSize: 28 }}>
                FormaPlay
              </h2>
              <p style={{ margin: 0 }}>Jogos Educacionais</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <strong style={{ fontSize: 17 }}>ORÇAMENTO #{numeroAtual}</strong>
              <p style={{ margin: "5px 0 0" }}>{new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

          <div style={dadosClientePrint}>
            <p><strong>Cliente:</strong> {cliente || "Não informado"}</p>
            <p><strong>Telefone:</strong> {telefone || "Não informado"}</p>
            <p><strong>Cidade/UF:</strong> {cidade || "Não informado"}</p>
            <p><strong>E-mail:</strong> {email || "Não informado"}</p>
          </div>

          <table style={tabelaPrint}>
            <thead>
              <tr style={{ background: "#0047ab", color: "white" }}>
                <th style={celulaPrint}>Produto</th>
                <th style={celulaPrint}>Qtd.</th>
                <th style={celulaPrint}>Unitário</th>
                <th style={celulaPrint}>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={celulaPrint}>{produto}</td>
                <td style={celulaPrint}>{quantidade}</td>
                <td style={celulaPrint}>{moeda(valorUnitario)}</td>
                <td style={celulaPrint}>{moeda(subtotal)}</td>
              </tr>
            </tbody>
          </table>

          <div style={resumoPrint}>
            <Linha nome="Subtotal" valor={moeda(subtotal)} />
            <Linha nome="Frete" valor={moeda(frete)} />
            <Linha nome="Desconto" valor={moeda(desconto)} />

            <div style={totalPrint}>
              <span>Total final</span>
              <strong>{moeda(total)}</strong>
            </div>
          </div>

          <div style={condicoesBoxPrint}>
            <p><strong>Prazo de entrega:</strong> {prazoEntrega}</p>
            <p><strong>Validade:</strong> {validade}</p>
            <p><strong>Pagamento:</strong> {pagamento}</p>
            <p><strong>Observações:</strong> {observacoes}</p>
          </div>

          <div style={assinaturaBox}>
            <div style={linhaAssinatura}></div>
            <p>Assinatura / Aprovação do cliente</p>
          </div>

          <footer style={rodapePrint}>
            FormaPlay • Orçamento comercial sem valor fiscal
          </footer>
        </section>

        <section style={historicoBox} className="no-print">
          <div style={historicoTopo}>
            <h2>Histórico de orçamentos</h2>
            <button style={botaoLimpar} onClick={limparHistorico}>Limpar histórico</button>
          </div>

          {historico.length === 0 ? (
            <p style={{ color: "#666" }}>Nenhum orçamento salvo ainda.</p>
          ) : (
            historico.map((item) => (
              <div key={item.id} style={historicoItem}>
                <div>
                  <strong>ORÇAMENTO #{item.numero}</strong>
                  <p style={{ margin: "4px 0" }}>{item.cliente}</p>
                  <small>{item.data} • {item.produto}</small>
                </div>

                <div style={{ textAlign: "right" }}>
                  <strong style={{ color: "green" }}>{moeda(item.total)}</strong>

                  <div style={{ marginTop: 10 }}>
                    <button style={botaoPequenoAzul} onClick={() => carregarOrcamento(item)}>Carregar</button>
                    <button style={botaoPequenoVermelho} onClick={() => excluirOrcamento(item.id)}>Excluir</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function Linha({ nome, valor }: { nome: string; valor: string }) {
  return (
    <div style={linhaResumo}>
      <span>{nome}</span>
      <strong>{valor}</strong>
    </div>
  );
}

const page: React.CSSProperties = {
  fontFamily: "Arial",
  background: "#dfeeff",
  minHeight: "100vh",
  padding: 14,
};

const appBox: React.CSSProperties = {
  maxWidth: 1100,
  margin: "auto",
  background: "white",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 20px 50px rgba(0,0,0,.18)",
};

const topHeader: React.CSSProperties = {
  background: "linear-gradient(135deg,#001d3d,#0058d8)",
  color: "white",
  padding: 24,
};

const logoTexto: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 900,
  letterSpacing: 1,
  marginBottom: 8,
  color: "white",
};

const menu: React.CSSProperties = {
  display: "flex",
  gap: 12,
  marginTop: 20,
  flexWrap: "wrap",
};

const hero: React.CSSProperties = {
  background: "linear-gradient(135deg,#0058d8,#00a3ff)",
  color: "white",
  padding: 24,
};

const icones: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 12,
  marginTop: 20,
};

const cardIcone: React.CSSProperties = {
  background: "rgba(255,255,255,.18)",
  borderRadius: 16,
  padding: 14,
  textAlign: "center",
  fontWeight: "bold",
};

const conteudo: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20,
  padding: 20,
};

const card: React.CSSProperties = {
  background: "#f8fbff",
  border: "1px solid #d6e6fa",
  borderRadius: 18,
  padding: 22,
};

const label: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: 14,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #c9d7ea",
  marginTop: 6,
  marginBottom: 14,
  fontSize: 15,
};

const textarea: React.CSSProperties = {
  ...input,
  minHeight: 90,
  resize: "vertical",
};

const duasColunas: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 14,
};

const linhaResumo: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 8,
};

const totalBox: React.CSSProperties = {
  marginTop: 20,
  padding: 18,
  background: "white",
  borderRadius: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "green",
  fontSize: 22,
  fontWeight: "bold",
};

const botaoRoxo: React.CSSProperties = {
  width: "100%",
  padding: 14,
  background: "#6f42c1",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontWeight: "bold",
};

const botaoCinza: React.CSSProperties = {
  width: "100%",
  marginTop: 18,
  padding: 14,
  background: "#667085",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontWeight: "bold",
};

const botaoLaranja: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: 14,
  background: "#ffb000",
  color: "#0b1b35",
  border: "none",
  borderRadius: 12,
  fontWeight: "bold",
};

const botaoAzul: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: 14,
  background: "#0047ab",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontWeight: "bold",
};

const botaoVerde: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: 14,
  background: "#09913a",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontWeight: "bold",
};

const orcamentoPrint: React.CSSProperties = {
  margin: 20,
  background: "white",
  border: "1px solid #d6e6fa",
  borderRadius: 18,
  padding: 18,
};

const orcHeaderPrint: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 15,
  borderBottom: "3px solid #0047ab",
  marginBottom: 12,
  paddingBottom: 10,
};

const dadosClientePrint: React.CSSProperties = {
  background: "#f8fbff",
  border: "1px solid #d6e6fa",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
};

const tabelaPrint: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 10,
};

const celulaPrint: React.CSSProperties = {
  padding: 9,
  border: "1px solid #dce8f8",
};

const resumoPrint: React.CSSProperties = {
  marginLeft: "auto",
  marginTop: 12,
  maxWidth: 300,
  background: "#f8fbff",
  border: "1px solid #d6e6fa",
  borderRadius: 12,
  padding: 12,
};

const totalPrint: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  borderTop: "2px solid #dce8f8",
  paddingTop: 10,
  marginTop: 10,
  color: "green",
  fontSize: 20,
  fontWeight: "bold",
};

const condicoesBoxPrint: React.CSSProperties = {
  marginTop: 12,
  background: "#f8fbff",
  border: "1px solid #d6e6fa",
  borderRadius: 14,
  padding: 12,
};

const assinaturaBox: React.CSSProperties = {
  marginTop: 28,
  textAlign: "center",
};

const linhaAssinatura: React.CSSProperties = {
  width: 260,
  borderTop: "1px solid #333",
  margin: "0 auto 6px",
};

const rodapePrint: React.CSSProperties = {
  marginTop: 14,
  paddingTop: 10,
  borderTop: "1px solid #d6e6fa",
  textAlign: "center",
  color: "#666",
  fontSize: 12,
};

const clientesBox: React.CSSProperties = {
  margin: 20,
  background: "#f8fbff",
  border: "1px solid #d6e6fa",
  borderRadius: 18,
  padding: 20,
};

const clienteItem: React.CSSProperties = {
  background: "white",
  border: "1px solid #d6e6fa",
  borderRadius: 14,
  padding: 16,
  marginTop: 12,
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const historicoBox: React.CSSProperties = {
  margin: 20,
  background: "#f8fbff",
  border: "1px solid #d6e6fa",
  borderRadius: 18,
  padding: 20,
};

const historicoTopo: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const historicoItem: React.CSSProperties = {
  background: "white",
  border: "1px solid #d6e6fa",
  borderRadius: 14,
  padding: 16,
  marginTop: 12,
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const botaoLimpar: React.CSSProperties = {
  background: "#d62828",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "10px 14px",
  fontWeight: "bold",
};

const botaoPequenoAzul: React.CSSProperties = {
  background: "#0047ab",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 10px",
  marginRight: 6,
  fontWeight: "bold",
};

const botaoPequenoVermelho: React.CSSProperties = {
  background: "#d62828",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "8px 10px",
  fontWeight: "bold",
};