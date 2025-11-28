
# 🌱 HSCare - Mobile App
```
O HSCare Mobile é a interface do usuário para o sistema de gestão de saúde pessoal. 
Desenvolvido com React Native e Expo, ele oferece uma experiência fluida para agendamentos, 
gestão de exames e interação com IA.
```
## 📱 Tecnologias Utilizadas
```
- React Native com Expo: Framework de desenvolvimento mobile.
- TypeScript: Para segurança e tipagem.
- Expo Router: Navegação baseada em arquivos.
- Axios / Fetch: Comunicação com a API.
- Expo FileSystem & Sharing: Para download e visualização de documentos.
```
## 📂 Estrutura do Projeto

```text
app/
├── (auth)/         # Telas de Login e Registro
├── (tabs)/         # Telas principais (Home, Agenda, Documentos, Perfil)
├── (app)/          # Outras telas (Chat IA, Detalhes)
└── _layout.tsx     # Configuração principal de navegação e Contextos
components/         # Componentes reutilizáveis
context/            # Context API (AuthContext para login persistente)
services/           # Comunicação com o Backend (api.ts)
```
## 🛠️ Pré-requisitos
```
Node.js instalado.

Aplicativo Expo Go instalado no seu celular (Android ou iOS) ou um emulador configurado.

O Backend do HSCare rodando localmente ou em um servidor.
```

## ⚙️ Instalação e Configuração
```
Clone o repositório e entre na pasta do frontend:
cd frontend

Instale as dependências:
npm install

Configure o Endereço da API: Abra o arquivo services/api.ts. 
Localize a constante BASE_URL e substitua pelo endereço IP da sua máquina na rede local 
(não use localhost se for testar no celular físico).

TypeScript

// Exemplo:
const BASE_URL = '[http://192.168.1.15:5000/api](http://192.168.1.15:5000/api)';

```
## ✨ Funcionalidades
```
Login Seguro: Autenticação persistente com armazenamento seguro de token.

Minha Agenda: Visualização e cadastro de compromissos médicos.

Documentos: Upload de exames/receitas (via galeria ou câmera) e visualização direta no app.

Lembretes: Gestão de medicamentos e tarefas.

HS Helper: Chatbot de IA integrado para tirar dúvidas de saúde.
```
## 📱 Iniciando o serviço do Front-End
```
Inicie o Projeto:
npx expo start

Execute no Dispositivo:
Leia o QR Code exibido no terminal com o app Expo Go (Android).

Ou pressione 'A' para abrir no emulador Android.
```
