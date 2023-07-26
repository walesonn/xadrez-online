![1](https://user-images.githubusercontent.com/62410044/165881465-4df81417-6ee5-4ea3-979d-9685d6a848f5.gif)

# Xadrez Online
Jogo de xadrez online feito usando a biblioteca Socket.IO

- Suporta múltiplas salas de jogos simultâneas
- Simples e rápido de se iniciar um novo jogo

# Como rodar localmente
#### Requisitos: ter o Node e o NPM instalados
- Clone a branch main deste repositório para seu computador
- Abra a pasta do projeto pelo seu terminal e execute os seguintes comandos:
  - <strong>npm install</strong>
  - <strong>npm start</strong>

E pronto! Mantenha o terminal aberto e clique <a href="http://localhost:3000">aqui</a> para abrir o projeto.

### FLUXO DE AUDIO ENTRE OS DOIS JOGADORES
- Os jogadores podem se comunicar em tempo real durante a partida, para isso se faz necessário algum dispositivo que capte audio, como headsets ou fone de ouvido, plugados na máquina dos jogadores.

#### ATENÇÃO
- É de extrema importância e para bom funcionamento da comunicação de audio entre os dois players de que esta aplicação seja configurada em um endpoint https://<domain here> pois por segurança o google bloqueia a transmissão de audio entre endpoints não seguros, ou seja, http://.
```Para testar aplicação em ambiente de desenvolvimento ou seja http://localhost a comunicação funciona normalmente porém se usar http://<ip da maquina> ocorrerá o problema de bloqueio.```