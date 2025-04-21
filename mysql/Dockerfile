FROM mysql:latest AS builder

FROM builder
RUN mkdir /usr/share/il8n/charmaps
COPY charmaps /usr/share/il8n/charmaps
RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8