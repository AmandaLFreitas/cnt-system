Aqui está uma proposta de `README.md` estruturada para o seu repositório, focada na clareza para a sua equipa e na organização do seu fluxo de trabalho:

---

# 📝 Sistema de Chamada - CNT Informática

Este é o sistema interno de gestão de alunos e registo de presenças da CNT Informática. O projeto foi desenvolvido com **React**, **TypeScript** e **Vite**, utilizando componentes do **shadcn/ui** para uma interface moderna e responsiva.

## 🚀 Funcionalidades Principais

* **Gestão de Alunos**: Cadastro, edição e visualização detalhada de informações dos alunos.
* **Folha de Presença**: Registo diário de faltas e presenças de forma simplificada.
* **Visualização de Horários**: Consulta de vagas e ocupação por turnos.
* **Relatórios**: Acesso a dados de frequência e finalização de cursos.
* **Design Responsivo**: Otimizado para uso em computadores (Secretaria/Chefia) e telemóveis (Professores).

## 🛠️ Tecnologias Utilizadas

* **Frontend**: React.js com Vite.
* **Estilização**: Tailwind CSS e Lucide React (ícones).
* **Componentes**: Radix UI e shadcn/ui.
* **Validações**: Zod e React Hook Form.
* **Containerização**: Docker (Nginx para servir os arquivos estáticos).

## 💻 Como Executar o Projeto

### Localmente

1. Instale as dependências:
```bash
npm install

```


2. Inicie o servidor de desenvolvimento:
```bash
npm run dev

```



### Via Docker

O projeto já inclui um `Dockerfile` pronto para produção:

1. Construa a imagem:
```bash
docker build -t sistema-cnt .

```


2. Execute o container:
```bash
docker run -p 80:80 sistema-cnt

```



## ☁️ Deploy e Acesso

Para que a equipa aceda ao sistema de qualquer dispositivo:

* O deploy pode ser feito via **Vercel**, **Netlify** ou **Firebase Hosting**.
* Os dados são sincronizados através da integração com o banco de dados (Firestore/Firebase).

---

### 💡 Analogia de Programação

Este repositório funciona como o **Livro de Atas** da escola. O código define onde as linhas e colunas ficam (Interface), e a conexão com a nuvem garante que, se a professora escrever na página 1 pelo telemóvel, a secretária verá a mesma anotação no notebook dela instantaneamente.

### 📚 Links Úteis

* [Documentação do Vite](https://vitejs.dev/)
* [Tutorial Firebase + React](https://www.google.com/search?q=https://www.youtube.com/watch%3Fv%3D9idm0atW27k)
