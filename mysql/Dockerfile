#essa Docker File só é nescessária por causa do encionding do mysql
#toda vez que eu seedava o bd os caractéres especiais vinham errados/quebrados
#depois de pesquisar muito ví que é pq o docker cria um ambiente ubuntu/linux que vem por padrão 
#com um enconding onde os caractéres especiais não funcionam direito e, ao mesmo tempo,
#não tem como mudar isso direito pq não existe a pasta charmaps com esses mapeamentos no ambiente.
#o que foi feito então é que eu copiei a pasta charmaps para o projeto e essa docker file
#faz com que essa pasta seja então jogada para a imagem da docker do mysql e roda os comandos que 
#alteram o encoding antes de seedar o banco para que dê tudo certo.

#Antes de fazer isso eu tentei alterar o encoding/collation do mysql e do phpmyadmin
#que eu usava para ver os bancos de dados com mais facilidade mas nada estava duncionando


FROM mysql:latest AS builder

FROM builder
RUN mkdir /usr/share/il8n/charmaps
COPY charmaps /usr/share/il8n/charmaps
RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8